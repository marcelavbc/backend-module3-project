const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        default: 'No named recipe'
    },
    readyInMinutes: {
        type: Number,
        default: 0
    },
    servings: {
        type: Number,
        default: 0
    },
    extendedIngredients: [
        {
            name: String,
            amount: Number,
            unit: String
        }],

    imagePath: {
        type: String,
        default: 'https://cdn0.iconfinder.com/data/icons/christmas-2379/60/dish__food__hot__meal__hotel-512.png'
    },
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
    readyInMinutes: Number,
    servings: Number,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },

}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;