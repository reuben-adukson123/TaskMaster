This project, TaskMaster, is a task management web application that allows users to manage their tasks efficiently through various features. It is built with Node.js, Express, MongoDB, and Mongoose, and uses JWT (JSON Web Tokens) for authentication and bcrypt for password encryption. Below is a detailed description of the project and its core features:

Project Overview:
TaskMaster is a simple yet powerful task management tool that allows users to:

Register an account.
Login to access their personalized task list.
Create, Update, Delete tasks.
Filter tasks based on priority or due date.
Search for tasks based on title or description.
The app is designed with user authentication and provides a secure environment for users to manage their tasks. It offers an intuitive interface with forms for task creation and management.

Core Features:
User Authentication (Login/Registration):

User Registration: Users can create an account by providing a username and password. Passwords are hashed using bcrypt for security.
Login: Registered users can log in using their username and password. If authentication is successful, a JWT token is generated and stored in a cookie to maintain the user’s session.
Logout: Users can log out, which clears the authentication token from the cookie.
Task Management:

Create Task: Users can create new tasks by providing a title, description, deadline, and priority. The task is associated with the logged-in user.
Edit Task: Users can edit the title, description, priority, and deadline of existing tasks.
Delete Task: Users can delete tasks that they no longer need.
View Tasks: The app displays all tasks created by the logged-in user. Tasks are displayed with their details, including title, description, deadline, and priority.
Task Filtering and Search:

Filter Tasks: Users can filter their tasks based on priority (e.g., low, medium, high) or due date. This helps users organize and prioritize their tasks efficiently.
Search Tasks: Users can search tasks by title or description. The search is case-insensitive, making it easy to find relevant tasks.
Responsive UI and Styling:

The application has a clean and modern user interface. The task list and forms are styled to ensure good usability, with appropriate padding, margins, and centered elements.
The forms for login, registration, and task creation are well-designed with clear input fields and buttons. The task list is left-aligned for better readability, and actions like edit and delete are placed on the same row for better user experience.
Buttons for editing and deleting tasks are styled in distinct colors (green for edit and red for delete) for better visual distinction.
Tech Stack:
Node.js: JavaScript runtime used for building the server-side application.
Express.js: Web framework for building APIs and handling routing.
MongoDB: NoSQL database to store user and task data.
Mongoose: ODM (Object Document Mapping) for interacting with MongoDB.
JWT (JSON Web Tokens): Used for user authentication and maintaining sessions securely.
bcrypt: For hashing passwords and ensuring secure storage.
EJS (Embedded JavaScript Templates): Templating engine to render dynamic HTML views on the server-side.
CSS: For styling the application and making it responsive and user-friendly.
Application Flow:
The user lands on the login page (if not logged in). If they don’t have an account, they can navigate to the register page.
Upon logging in successfully, the user is redirected to their task dashboard where they can:
View a list of tasks.
Add new tasks.
Edit or delete tasks.
Filter tasks by priority or due date.
Search tasks by title or description.
The app uses cookies to store the JWT token, ensuring that users remain logged in as they navigate between pages.
User Stories:
As a user, I can register and create an account to start managing my tasks.
As a user, I can log in and securely access my tasks.
As a user, I can create, edit, and delete tasks to manage my to-do list.
As a user, I can filter tasks by priority or due date to prioritize my work.
As a user, I can search tasks by their title or description to quickly find what I need.
Project Structure:
app.js: Main entry point for the server.
models/user.js: Defines the user schema and model.
models/task.js: Defines the task schema and model.
views/: Contains EJS templates for rendering dynamic content (login, register, tasks).
public/: Contains static files like CSS for styling and images (if any).
routes/: Defines routes for various pages (login, register, tasks).
Security Considerations:
Passwords are hashed using bcrypt to ensure they are stored securely in the database.
The app uses JWT for maintaining secure user sessions, reducing the risk of session hijacking.
All routes that deal with sensitive data (like task management) are protected, and the user must be authenticated to access them.
Deployment:
This application can be deployed to platforms like Vercel or Heroku for hosting, and MongoDB can be hosted on MongoDB Atlas for cloud storage.
After deployment, users can access the app from any browser and manage their tasks seamlessly.
This application is perfect for anyone looking for a simple, secure, and efficient task management tool.
