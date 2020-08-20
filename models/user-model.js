const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  googleID: String,
  quote: {
    type: String,
    default: "Ask not what you can do for your country. Ask what’s for lunch."
  },
  avatar: {
    type: String,
    default: "https://www.creativefabrica.com/wp-content/uploads/2019/05/Chef-icon-by-hellopixelzstudio.jpg"
  },
},
  {
    timestamps: true
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
