const express = require('express');
const recipeRoutes = express.Router();
const mongoose = require('mongoose')
const uploader = require('../configs/cloudinary-setup')
const axios = require('axios')
const Recipe = require('../models/recipe-model')
const ApiSavedRecipe = require('../models/api-saved-recipes')



recipeRoutes.get('/recipes/all', (req, res, next) => {
    Recipe.find()
        .populate('owner')
        .then(recipes => {
            console.log('recipes', recipes)
            res.json(recipes)
        })
        .catch(err => {
            res.json(err)
        })
})


recipeRoutes.get('/recipes/:id', (req, res, next) => {
    // console.log(req.params.id)
    let recipeId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        axios({
            "method": "GET",
            "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": process.env.SPOONCULAR_KEY,
                "useQueryString": true
            }
        })
            .then((response) => {
                res.json(response.data)
            })
            .catch((error) => {
                console.log(error)
            })

    } else {
        Recipe.findById(req.params.id)
            .populate('owner')
            .then(recipe => {
                res.status(200).json(recipe)
            })
            .catch((error) => {
                console.log(error)
            })
    }

})

recipeRoutes.put('/recipe/:id', uploader.single("image"), (req, res, next) => {
    // console.log('req.body', req.body)
    const image = req.file ? req.file.path : ''
    const recipe = {
        owner: req.body.owner,
        title: req.body.title,
        servings: req.body.servings,
        readyInMinutes: req.body.readyInMinutes,
        extendedIngredients: req.body.extendedIngredients ? JSON.parse(req.body.extendedIngredients) : null,
        analyzedInstructions: req.body.analyzedInstructions ? JSON.parse(req.body.analyzedInstructions) : null,
        imagePath: image
    }
    Recipe.findByIdAndUpdate(req.params.id, { recipe })
        .then(() => {
            res.status(200).json(recipe)
        })
        .catch((error) => {
            console.log(error)
        })
})



module.exports = recipeRoutes;
