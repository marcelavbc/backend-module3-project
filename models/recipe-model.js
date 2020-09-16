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
            name: {
                type: String,
                default: 'No ingredients'
            },
            amount: {
                type: Number,
                default: 0
            },
            unit: {
                type: String, 
                default: '-'
            }
        }],

    imagePath: {
        type: String,
        default: 'https://cdn0.iconfinder.com/data/icons/christmas-2379/60/dish__food__hot__meal__hotel-512.png'
    },
    analyzedInstructions: [
        {
            steps: [
                {
                    number: {
                        type: Number,
                        default: 0
                    },
                    step: {
                        type: String, 
                        default: '-'
                    }
                }
            ]
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