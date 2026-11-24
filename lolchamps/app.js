const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./data/db');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'hextech-super-secret-key-2026';

app.use(express.json());
app.use(express.static(__dirname, { index: 'index.html' }));

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    req.user = err ? null : user;
    next();
  });
}

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || username.trim().length < 3 || password.length < 4) {
    return res.status(400).json({ error: 'Username (min 3 chars) and password (min 4 chars) required.' });
  }

  try {
    const hashed = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const info = stmt.run(username.trim(), hashed);

    const user = { id: Number(info.lastInsertRowid), username: username.trim() };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username already taken.' });
    }
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: payload });
});

app.get('/api/champions', optionalAuth, (req, res) => {
  let rows;
  if (req.user) {
    rows = db.prepare(`
      SELECT champions.*, users.username AS owner_name
      FROM champions
      JOIN users ON champions.user_id = users.id
      WHERE champions.is_public = 1 OR champions.user_id = ?
      ORDER BY champions.id DESC
    `).all(req.user.id);
  } else {
    rows = db.prepare(`
      SELECT champions.*, users.username AS owner_name
      FROM champions
      JOIN users ON champions.user_id = users.id
      WHERE champions.is_public = 1
      ORDER BY champions.id DESC
    `).all();
  }
  res.json(rows);
});

app.post('/api/champions', requireAuth, (req, res) => {
  const { name, title, role, difficulty, image_url, description, is_public } = req.body;

  if (!name || !title || !role || !difficulty) {
    return res.status(400).json({ error: 'Name, title, role, and difficulty are required.' });
  }

  const stmt = db.prepare(`
    INSERT INTO champions (name, title, role, difficulty, image_url, description, is_public, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    name.trim(),
    title.trim(),
    role,
    difficulty,
    (image_url || '').trim(),
    (description || '').trim(),
    is_public ? 1 : 0,
    req.user.id
  );

  res.status(201).json({ id: Number(info.lastInsertRowid), message: 'Champion created!' });
});

app.put('/api/champions/:id', requireAuth, (req, res) => {
  const champion = db.prepare('SELECT * FROM champions WHERE id = ?').get(req.params.id);
  if (!champion) return res.status(404).json({ error: 'Champion not found.' });

  if (champion.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own champions.' });
  }

  const { name, title, role, difficulty, image_url, description, is_public } = req.body;

  if (!name || !title || !role || !difficulty) {
    return res.status(400).json({ error: 'Name, title, role, and difficulty are required.' });
  }

  db.prepare(`
    UPDATE champions
    SET name = ?, title = ?, role = ?, difficulty = ?, image_url = ?, description = ?, is_public = ?
    WHERE id = ?
  `).run(
    name.trim(),
    title.trim(),
    role,
    difficulty,
    (image_url || '').trim(),
    (description || '').trim(),
    is_public ? 1 : 0,
    req.params.id
  );

  res.json({ message: 'Champion updated!' });
});

app.delete('/api/champions/:id', requireAuth, (req, res) => {
  const champion = db.prepare('SELECT * FROM champions WHERE id = ?').get(req.params.id);
  if (!champion) return res.status(404).json({ error: 'Champion not found.' });

  if (champion.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own champions.' });
  }

  db.prepare('DELETE FROM champions WHERE id = ?').run(req.params.id);
  res.json({ message: 'Champion deleted!' });
});

app.listen(PORT, () => {
  console.log(`League Champion Manager running at http://localhost:${PORT}`);
});
