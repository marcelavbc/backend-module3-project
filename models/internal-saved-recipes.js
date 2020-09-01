const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});

const InternalSavedRecipe = mongoose.model('InternalSavedRecipe', schema);
module.exports = InternalSavedRecipe;