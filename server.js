const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; 

const generateId = () => `${Date.now()}`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading notes' });
    }
    res.json(JSON.parse(data));
  })
);

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ message: 'Note title and text are required' });
  }

  const newNote = { title, text, id: generateId() };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading notes' });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (writeErr) =>
      writeErr
        ? res.status(500).json({ message: 'Error writing note' })
        : res.json(newNote)
    );
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading notes' });
    }
    const notes = JSON.parse(data).filter((note) => note.id !== noteId);

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (writeErr) =>
      writeErr
        ? res.status(500).json({ message: 'Error deleting note' })
        : res.json({ message: 'Note deleted successfully' })
    );
  });
});

app.listen(PORT, () =>
  console.log(`Note Taker server is listening on port ${PORT}`)
);