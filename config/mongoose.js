const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://@cluster0.ytjus.mongodb.net/<dbname>?retryWrites=true&w=majority')
mongoose.connect(`mongodb://localhost/jwttest`);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongoDB'));

db.once('open', () => {
  console.log('Connected TO DB :MONGODB ');
});

module.exports = db;
