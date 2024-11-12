// In app.js (or taskRoutes.js)
const Task = require('./models/Task');

// Filter Tasks Route (GET)
app.get('/tasks', async (req, res) => {
  const { priority, dueDate } = req.query;

  try {
    let query = {};

    if (priority) {
      query.priority = priority; // Filter by priority
    }

    if (dueDate) {
      query.dueDate = { $lte: new Date(dueDate) }; // Filter by due date
    }

    const tasks = await Task.find(query).populate('userId');
    res.render('tasks', { tasks }); // Render filtered tasks on the 'tasks' page
  } catch (error) {
    console.error('Error filtering tasks:', error);
    res.status(500).send('Error filtering tasks');
  }
});
