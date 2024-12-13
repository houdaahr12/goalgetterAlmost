import express from 'express';
import db from './db.js';

const router = express.Router();

// Ensure all paths include `/api`
const apiBasePath = '/api';

// Middleware to prefix all routes with `/api`
router.use(apiBasePath, (req, res, next) => {
  next();
});


//isAuthenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next(); // Proceed to the next middleware or route handler
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Get the number of tasks due today
router.get('/tasks/today', isAuthenticated, (req, res) => {
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session

  const query = `
    SELECT COUNT(*) AS taskCount
    FROM tasks
    WHERE user_id = ? AND DATE(CONCAT(due_date, ' ', IFNULL(due_time, '00:00:00'))) = CURDATE() 
    AND (status = 'pas commencé' OR status = 'en cours')
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching daily task count:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération du nombre de tâches.' });
    }
    
    res.json({ taskCount: results[0].taskCount });
  });
});

// Get all the tasks of today for the logged-in user
router.get('/tasks', isAuthenticated, (req, res) => {
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session

  const query = `
    SELECT * 
    FROM tasks
    WHERE user_id = ? AND DATE(due_date) = CURDATE()  
      AND (status = 'pas commence' OR status = 'en cours')
    ORDER BY FIELD(priority, 'urgent', 'important', 'moins important')
  `;

  db.query(query, [userId], (err, results) => {
  
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Server Error');
    }
    res.json(results); // Retourner les tâches de l'utilisateur connecté
  });
});

// API endpoint to fetch tasks grouped by status
router.get('/tasks-by-status', isAuthenticated, (req, res) => {
  const userId = req.session.userId; // Retrieve the logged-in user's ID from the session

  const query = `
    SELECT * 
    FROM tasks
    WHERE user_id = ?
    ORDER BY FIELD(status, 'pas commence', 'en cours', 'termine')`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des tâches :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    const groupedTasks = {
      "pas commence": [],
      "en cours": [],
      "termine": [],
    };

    results.forEach((task) => {
      if (groupedTasks[task.status]) {
        groupedTasks[task.status].push(task);
      }
    });

    res.json(groupedTasks);
  });
});

// Add a task
router.post('/tasks-add', isAuthenticated, (req, res) => {
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session
  const { task_name, category, due_date, due_time, priority, status} = req.body;

  console.log('Route /tasks-add appelée avec les données :', req.body);
  console.log('Session User ID:', userId); // Afficher l'ID de l'utilisateur pour le débogage

  // Validation de la priorité
  const validPriorities = ['moins important', 'important', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ message: "Priorité invalide." });
  }

  // Validation de la date d'échéance
  const currentDate = new Date(); // Date actuelle
  const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  let dueDateObj;
  if (due_date) {
    dueDateObj = new Date(due_date); // Convertir la date d'échéance
    const dueDateOnly = new Date(dueDateObj.getFullYear(), dueDateObj.getMonth(), dueDateObj.getDate());

    if (dueDateOnly < currentDateOnly) {
      return res.status(400).json({ message: "La date d'échéance ne peut pas être dans le passé." });
    }
  }

  // Requête SQL pour insérer la tâche
  const query = `INSERT INTO tasks (task_name, category, due_date, due_time, priority, user_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    task_name || null,   // Nom de la tâche
    category || null,    // Catégorie
    due_date || null,    // Date d'échéance
    due_time || null,    // Heure d'échéance
    priority || null,     // Priorité
  
    userId,               // ID de l'utilisateur connecté
    status || 'pas commence'
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion de la tâche :", err);
      return res.status(500).json({ message: "Erreur lors de l'insertion de la tâche." });
    }

    res.status(201).json({ message: "Tâche insérée avec succès !", taskId: result.insertId });
  });
});

// Route pour modifier les informations d'une tâche pour l'utilisateur connecté
router.put('/tasks/:id', isAuthenticated, (req, res) => {
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur depuis la session
  const taskId = req.params.id;
  const { task_name, category, due_date, due_time, priority, status } = req.body;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  // On vérifie si la tâche appartient à l'utilisateur connecté
  const taskOwnershipQuery = `SELECT * FROM tasks WHERE id = ? AND user_id = ?`;
  db.query(taskOwnershipQuery, [taskId, userId], (err, result) => {
    if (err) {
      console.error('Error checking task ownership:', err);
      return res.status(500).json({ message: 'Internal error while checking task ownership.' });
    }

    if (result.length === 0) {
      return res.status(403).json({ message: 'You are not authorized to update this task.' });
    }

    const existingTask = result[0]; // Get the existing task data
    const updates = [];
    const values = [];

    // If no values are provided for task_name, use the existing one
    if (task_name) {
    updates.push('task_name = ?');
    values.push(task_name);
  }
  if (category) {
    updates.push('category = ?');
    values.push(category);
  }

  // Only update the due_date if it's provided (avoid overwriting the date)
  if (due_date) {
    updates.push('due_date = ?');
    values.push(due_date);
  }
  if (due_time) {
    updates.push('due_time = ?');
    values.push(due_time);
  }
  if (priority) {
    updates.push('priority = ?');
    values.push(priority);
  }
  if (status === "termine") {
    updates.push("status = ?");
    values.push(status);
    updates.push("completed_date = NOW()");
  } else {
    // If status isn't being updated to "termine", don't change the completed_date
    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No data to update.' });
  }

  const updateQuery = `
    UPDATE tasks 
    SET ${updates.join(', ')} ,completed_date = NOW()
    WHERE id = ?;
  `;
  values.push(taskId);

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ message: 'Internal error while updating task.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task updated successfully!' });
    });
  });
});

// Endpoint to update the status of a task to 'termine' for the logged-in user
router.put('/tasks/complete/:id', isAuthenticated, (req, res) => {
  const userId = req.session.userId; // Get the logged-in user's ID from the session
  const taskId = req.params.id;

  // First, check if the task belongs to the logged-in user
  const taskOwnershipQuery = `SELECT * FROM tasks WHERE id = ? AND user_id = ?`;
  db.query(taskOwnershipQuery, [taskId, userId], (err, result) => {
    if (err) {
      console.error('Error checking task ownership:', err);
      return res.status(500).send('Internal error while checking task ownership.');
    }

    if (result.length === 0) {
      return res.status(403).send('You are not authorized to update this task.');
    }

    // If the task belongs to the user, proceed to update the status
    const query = 'UPDATE tasks SET status = "termine", completed_date = NOW() WHERE id = ?';
    
    db.query(query, [taskId], (err, results) => {
      if (err) {
        console.error('Error updating task status:', err);
        res.status(500).send('Error updating task status');
      } else if (results.affectedRows === 0) {
        res.status(404).send('Task not found');
      } else {
        res.json({ message: 'Task marked as complete', taskId });
      }
    });
  });
});

// Endpoint to get completed tasks
router.get('/history', (req, res) => {
  const query = 'SELECT * FROM tasks WHERE status = "termine" ORDER BY completed_date DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching tasks');
    } else {
      // Group tasks by completed_date
      const groupedTasks = results.reduce((groups, task) => {
        const completedDate = task.completed_date;

        // Check if completed_date is valid and a string, and if not, handle gracefully
        let date = 'Date inconnue'; // Default value for invalid dates
        if (completedDate && typeof completedDate === 'string') {
          // If it's a string, extract the date part
          date = completedDate.split("T")[0]; 
        } else if (completedDate instanceof Date) {
          // If it's a Date object, format it
          date = completedDate.toISOString().split("T")[0];
        }

        // Group tasks by date
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(task);
        return groups;
      }, {});

      res.json(groupedTasks); // Send grouped tasks to the frontend
    }
  });
});


// Endpoint to get deleted tasks=> trashh
router.get('/deleted', (req, res) => {
  const query = 'SELECT * FROM tasks WHERE status = "annule"';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(results);
  });
});

// Delete task endpoint
router.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  const deleteQuery = 'DELETE FROM tasks WHERE id = ?';
  
  db.query(deleteQuery, [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ message: 'Internal error while deleting task.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully!' });
  });
});

// PUT endpoint to restore a task by changing its status
router.put("/restore/:id", (req, res) => {
  const taskId = req.params.id;

  // Only update the status to "pas commence"
  const query = "UPDATE tasks SET status = ? WHERE id = ?";
  const newStatus = "pas commence";

  db.query(query, [newStatus, taskId], (err, results) => {
    if (err) {
      console.error("Error restoring task:", err);
      return res.status(500).send("Error restoring task.");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Task not found.");
    }

    res.send({ message: "Task restored successfully.", taskId, status: newStatus });
  });
});


// Endpoint to update task status to 'annule'
router.put('/tasks/cancel/:id', (req, res) => {
  const taskId = req.params.id;

  // Update the task status in the database
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.query(query, ['annule', taskId], (error, results) => {
    if (error) {
      console.error('Error updating task status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If no rows are affected, the task might not exist
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task status updated to "annule"' });
  });
});


// Endpoint to get tasks completed per week
router.get('/statistiques/completed-per-week', isAuthenticated, (req, res) => {
  const userId = req.session.userId;

  // Query to count tasks completed per week
  const query = `
    SELECT YEAR(completed_date) AS year, WEEK(completed_date) AS week, COUNT(*) AS taskCount
    FROM tasks
    WHERE user_id = ? AND status = 'termine'
    GROUP BY YEAR(completed_date), WEEK(completed_date)
    ORDER BY year DESC, week DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching completed tasks statistics:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération des statistiques.' });
    }

    res.json(results); // Return the statistics per week
  });
});

// Endpoint to get tasks organized by category
router.get('/tasks-by-category', isAuthenticated, (req, res) => {
    const userId = req.session.userId; // Retrieve the logged-in user's ID from the session

    const query = `
        SELECT * 
        FROM tasks
        WHERE user_id = ?
        AND (status = 'pas commence' OR status = 'en cours')
        ORDER BY FIELD(category, 'etude', 'travail', 'maison', 'personnel', 'loisirs', 'autre')`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des tâches :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        const groupedTasks = {
            etude: [],
            travail: [],
            maison: [],
            personnel: [],
            loisirs: [],
            autre: [],
        };

        results.forEach((task) => {
            if (groupedTasks[task.category]) {
                groupedTasks[task.category].push(task);
            }
        });

        res.json(groupedTasks);
    });
});

// Endpoint to get tasks due in the next hour
router.get('/api/notifications', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const currentDateTime = new Date();

  // Add 1 hour to the current date/time
  const oneHourLater = new Date(currentDateTime.getTime() + 60 * 60 * 1000);

  try {
    // Fetch tasks that are due within the next hour
    const tasks = await query(
      `SELECT * FROM tasks 
       WHERE user_id = ? 
         AND due_date BETWEEN ? AND ?
         AND status != 'completed'`,
      [userId, currentDateTime, oneHourLater]
    );

    if (tasks.length > 0) {
      // Send tasks as notifications
      res.json({ notifications: tasks });
    } else {
      res.json({ notifications: [] });
    }
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).send('Server error');
  }
});



export default router;
