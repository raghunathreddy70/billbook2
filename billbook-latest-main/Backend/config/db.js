const mongoose = require('mongoose');
require('dotenv').config()


mongoose
  .connect(process.env.DB_URL,  {
    
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB_Connected');
    
  })
  .catch((error) => {
    console.log('DB Connection failed', error);
  });

module.exports = mongoose;