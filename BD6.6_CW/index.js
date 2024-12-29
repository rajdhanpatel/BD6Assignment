const cors = require('cors');
const express = require('express');
const app = express();
const { getAllEmployees, getEmployeeById } = require('./controllers');
app.use(cors());
app.use(express.json());
app.get('/employees', async (req, res) => {
  const employees = await getAllEmployees();
  res.json({ employees });
});

app.get('/employee/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const employee = await getEmployeeById(id);
  res.json({ employee });
});

module.exports = { app };
