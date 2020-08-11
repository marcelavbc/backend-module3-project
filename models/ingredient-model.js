const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: String,
  image: {
    type: String,
    default: "https://cdn3.iconfinder.com/data/icons/food-155/100/Healthy_food_1-512.png"
  },
},
  {
    timestamps: true
  });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;