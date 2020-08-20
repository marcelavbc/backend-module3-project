const express = require('express');
const recipeRoutes = express.Router();
const mongoose = require('mongoose')
const uploader = require('../configs/cloudinary-setup')

const Recipe = require('../models/recipe-model')
const User = require('../models/user-model')

//POST A RECIPE
recipeRoutes.post('/recipes', (req, res, next) => {

    console.log('session', req.session)
    Recipe.create({
        title: req.body.title,
        readyInMinutes: req.body.readyInMinutes,
        servings: req.body.servings,
        extendedIngredients: req.body.extendedIngredients,
        // image: req.body.image, 
        analyzedInstructions: req.body.analyzedInstructions
    })
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            res.json(err)
        })
})

recipeRoutes.get('/recipes', (req, res, next) => {
    Recipe.find()
    .then(allRecipes => {
        res.json(allRecipes)
    })
    .catch(err => {
        res.json(err);
      });
})



module.exports = recipeRoutes;
