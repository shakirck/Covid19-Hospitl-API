const express = require('express');
const app = express();
const PORT = 5000;

//connecting to db
const db = require('./config/mongoose');

//for parsing incoming requests
app.use(express.urlencoded());

//routes
app.use('/',require('./routes'));



//start server
app.listen(PORT,function(){console.log(`SERVER IS RUNNING IN PORT ${PORT}`)});