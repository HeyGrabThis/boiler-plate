const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
//몽고db연결
mongoose
  .connect(
    'mongodb+srv://qkqajrrhtj:dhzpdl6632@cluster0.4vycw4p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {}
  )
  .then(() => {
    console.log('mongoDB Connected!');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
