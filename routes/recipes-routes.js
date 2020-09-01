const express = require('express');
const recipeRoutes = express.Router();
const mongoose = require('mongoose')
const uploader = require('../configs/cloudinary-setup')

const Recipe = require('../models/recipe-model')
const User = require('../models/user-model')


recipeRoutes.get('/recipes/all', (req, res, next) => {
    Recipe.find()
        .populate('owner')
        .then(recipes => {
            console.log(recipes)
            res.json(recipes)
        })
        .catch(err => {
            res.json(err)
        })
})

recipeRoutes.get('/recipes/:id', (req, res, next) => {
    console.log(req.params.id)
    Recipe.findById(req.params.id)
        .then(recipe => {
            console.log('user', recipe)
            res.json(recipe)
        })
        .catch(err => {
            res.json(err)
        })
})





module.exports = recipeRoutes;
