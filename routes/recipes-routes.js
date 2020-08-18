const express = require('express');
const recipeRoutes = express.Router();
const mongoose = require('mongoose')


const Recipe = require('../models/recipe-model')

recipeRoutes.post('/add', (req, res, next) => {

    console.log('req', req)
    Recipe.create({
        title: req.body.title,
        readyInMinutes: req.body.readyInMinutes,
        owner: req.user._id,//user é criado por passport
        servings: req.body.servings,
        extendedIngredients: req.body.extendedIngredients, 
        image: req.body.image, 
        analyzedInstructions: req.body.analyzedInstructions
    })
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            res.json(err)
        })
})

module.exports = recipeRoutes;
