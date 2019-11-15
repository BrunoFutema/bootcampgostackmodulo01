const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /teste/1
// Request params = { "name": "Bruno", "email": "bruno@rocketseat.com.br" }

const users = ['Diego', 'Cláudio', 'Victor', 'Bruno'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index',checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index',checkUserInArray, (req, res) => {
  const { index } = req.params;
  
  users.splice(index, 1);

  return res.json({ error: 'Usuário excluído com sucesso!' });
})

server.listen(3000);