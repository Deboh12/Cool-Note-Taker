const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

  newNote.id = Math.random().toString(36).substr(2, 9);

  notes.push(newNote);

  fs.writeFileSync('db.json', JSON.stringify(notes));

  res.json(newNote);
});

// Bonus: DELETE Route
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

  notes = notes.filter((note) => note.id !== noteId);

  fs.writeFileSync('db.json', JSON.stringify(notes));

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});