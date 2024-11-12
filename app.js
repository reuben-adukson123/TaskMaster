const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Set view engine
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB setup (Replace with your actual MongoDB URI)
mongoose.connect('mongodb://localhost:27017/task_master', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB: ' + err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Task Schema and Model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'] },
  userId: mongoose.Schema.Types.ObjectId
});

const Task = mongoose.model('Task', taskSchema);

// Root Route (Redirect to login page)
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login'); // Render login page
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.send('Invalid password');

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
    res.cookie('token', token); // Set JWT token as a cookie
    res.redirect('/tasks');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Register route
app.get('/register', (req, res) => {
  res.render('register'); // Render register page
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Task management routes (Requires authentication)
app.use((req, res, next) => {
  const token = req.cookies.token; // Get token from cookies
  if (!token) return res.redirect('/login'); // If no token, redirect to login

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) return res.redirect('/login'); // If token is invalid, redirect to login
    req.userId = decoded.userId;
    next();
  });
});

// View tasks route
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.render('tasks', { tasks });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Create task route
app.get('/tasks/new', (req, res) => {
  res.render('create-task'); // Render create task page
});

app.post('/tasks', async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      deadline: new Date(deadline),
      priority,
      userId: req.userId
    });
    await newTask.save();
    res.redirect('/tasks');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Filter tasks (by priority or due date)
app.get('/tasks/filter', async (req, res) => {
  const { priority, dueDate } = req.query;

  let filter = { userId: req.userId };
  if (priority) filter.priority = priority;
  if (dueDate) filter.deadline = { $lte: new Date(dueDate) };

  try {
    const tasks = await Task.find(filter);
    res.render('tasks', { tasks });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Search tasks
app.get('/tasks/search', async (req, res) => {
  const { query } = req.query;

  try {
    const tasks = await Task.find({
      userId: req.userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.render('tasks', { tasks });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Edit task route
app.get('/tasks/:id/edit', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).send('Task not found');
    res.render('edit-task', { task });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Update task route
app.post('/tasks/:id', async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, deadline: new Date(deadline), priority }
    );
    res.redirect('/tasks');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Delete task route
app.post('/tasks/:id/delete', async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.redirect('/tasks');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Server listening
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
