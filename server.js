require('dotenv').config();
const express = require('express');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res)=> {
  res.send({message: "Server test running"})
});

app.listen(PORT, ()=>{
  console.log(`SERVER running on port ${PORT}`);
  
})