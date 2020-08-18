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
    image: String,
    analyzedInstructions: [
        {
            steps: [
                {
                    number: Number,
                    step: String
                }
            ]
        }
    ],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;