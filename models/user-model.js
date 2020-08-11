const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  googleID: String,
  avatar: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSix6dzoByR3w-9uUFcj3twVH9qsE1vNKaYzQ&usqp=CAU"
  },
},
  {
    timestamps: true
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
