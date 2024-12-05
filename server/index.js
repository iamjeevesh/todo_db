const express = require('express');
const postgres = require('postgres');
const {initTables} = require('./setup');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors')

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const sql = postgres(process.env.DB_URL);

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.CORS_ORIGIN}));

function authenticate(req, res, next) {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      // { userId: user.id }
      req.user = decoded;  // Attach user information to the request object
      next();  // Proceed to the next middleware/route handler
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

// --- Routes ---
// Users
app.get('/api/users',authenticate, async (req, res) => {
  try {
    const users = await sql`SELECT * FROM Users`;
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Hash the password before saving to the database
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
  
      const [user] = await sql`
        INSERT INTO Users (username, email, password_hash)
        VALUES (${username}, ${email}, ${password_hash})
        RETURNING *;
      `;
      const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '1h' });

    // Send JWT in a cookie
      res.cookie('auth_token', token, {
          httpOnly: true,  // Prevent client-side access to the cookie
          secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
          maxAge: 3600000,  // 1 hour expiry
      });
  
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/api/users/logout', authenticate, async (req, res) => {
    res.clearCookie('auth_token');
    res.status(204).end();
});

  
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const [existingUser] = await sql`SELECT * FROM Users WHERE email = ${email}`;

    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, existingUser.password_hash);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: existingUser.user_id }, secretKey, { expiresIn: '1h' });

  // Send JWT in a cookie
    res.cookie('auth_token', token, {
        httpOnly: true,  // Prevent client-side access to the cookie
        secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
        maxAge: 3600000,  // 1 hour expiry
    });

    res.status(201).json(existingUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects
app.get('/api/projects', authenticate,async (req, res) => {
  try {
    const projects = await sql`SELECT * FROM Projects where owner_id = ${req.user.userId}`;
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/create',authenticate, async (req, res) => {
  const { name, description } = req.body;
  try {
    const [project] = await sql`
      INSERT INTO Projects (name, description, owner_id)
      VALUES (${name}, ${description}, ${req.user.userId})
      RETURNING *;
    `;
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tasks
app.get('/api/projects/:projectId/tasks',authenticate, async (req, res) => {
  try {
    const tasks = await sql`SELECT * FROM Tasks where project_id = ${req.params.projectId}`;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:projectId/tasks/create',authenticate, async (req, res) => {
  const { assigned_to, title, description, status, priority } = req.body;
  try {
    const [task] = await sql`
      INSERT INTO Tasks (project_id, title, description, status, priority)
      VALUES (${req.params.projectId}, ${assigned_to}, ${title}, ${description}, ${status}, ${priority})
      RETURNING *;
    `;
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comments
app.get('/api/tasks/:taskId/comments',authenticate, async (req, res) => {
  try {
    const comments = await sql`SELECT * FROM Comments WHERE task_id = ${req.params.taskId}`;
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/:taskId/comments/create',authenticate, async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const [comment] = await sql`
      INSERT INTO Comments (task_id, user_id, content)
      VALUES (${req.params.taskId}, ${user_id}, ${content})
      RETURNING *;
    `;
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Server Start ---
app.listen(PORT,async () => {
  await initTables();  
  console.log(`Server running on port ${PORT}`);
});

