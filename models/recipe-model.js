const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: String,
    readyInMinutes: Number,
    servings: Number,
    extendedIngredients: [
        {
            name: String,
            amount: Number,
            unit: String
        }],
    image: {
        type: String,
        default: 'https://cdn0.iconfinder.com/data/icons/christmas-2379/60/dish__food__hot__meal__hotel-512.png'
    },
    imagePath: {
        type: String,
        default: 'https://cdn0.iconfinder.com/data/icons/christmas-2379/60/dish__food__hot__meal__hotel-512.png'
    },
    analyzedInstructions: [
        {
            number: Number,
            step: String
        }
    ],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },

}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;