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
    default: "https://i0.pngocean.com/files/944/713/232/%D0%9F%D0%B8%D0%B2%D0%BEfactory-beer-restaurant-computer-icons-cook-chef-icon.jpg"
  },
},
  {
    timestamps: true
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
