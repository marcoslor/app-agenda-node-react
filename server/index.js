const express = require("express");
const sqlite = require("sqlite3");
const path = require("path");
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 8000;

const app = express();
const db = new sqlite.Database(path.resolve(__dirname, "database.db"));

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());

//create table 'contatos' if not exists
db.run(`CREATE TABLE IF NOT EXISTS contatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT,
  telefone TEXT,
  imagem_url TEXT)`
);

app.get('/api/contatos', (req, res) => {
  db.all('SELECT * FROM contatos', (err, rows) => {
    res.json(rows);
  })
})

app.post('/api/contatos', (req, res) => {
  const { nome, email, telefone, imagem_url } = req.body;
  console.log(nome, email, telefone, imagem_url);

  db.run(`INSERT INTO contatos (nome, email, telefone, imagem_url) VALUES (?, ?, ?, ?)`, [nome, email, telefone, imagem_url], (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  })
})

app.put('/api/contatos/:id', (req, res) => {
  db.run(`UPDATE contatos SET nome = ?, email = ?, telefone = ?, imagem_url = ? WHERE id = ?`,
    [req.body.nome, req.body.email, req.body.telefone, req.body.imagem_url, req.params.id, ], (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    })
})

app.delete('/api/contatos/:id', (req, res) => {
  db.run(`DELETE FROM contatos WHERE id = ?`, [req.params.id], (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});