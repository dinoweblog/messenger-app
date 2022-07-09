const mongoose = require("mongoose");

module.exports = () => {
  return mongoose.connect(process.env.MONGODB_URL);
};
