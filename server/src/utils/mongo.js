const mongoose = require('mongoose');

async function connectDatabase() {
  await mongoose.connect('mongodb://localhost:27017/nodeNasa')
                .then(() => console.log("Connected"))
                .catch((err) => console.log(err));
};

module.exports = connectDatabase;
