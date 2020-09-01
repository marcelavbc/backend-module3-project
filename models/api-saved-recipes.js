const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    recipeId: String,
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});

const ApiSavedRecipe = mongoose.model('ApiSavedRecipe', schema);
module.exports = ApiSavedRecipe;