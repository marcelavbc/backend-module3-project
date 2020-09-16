const express = require('express');
const usersRoutes = express.Router();

const User = require('../models/user-model');
const Recipe = require('../models/recipe-model')
usersRoutes.get('/users', (req, res, next) => {
    //retorna todos os usuários
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.json(err)
        })
})


usersRoutes.get('/users/:id', (req, res, next) => {
    //retorna o profile de um usuario
    console.log(req.params.id)
    User.findById(req.params.id)
        .then(user => {
            const finalResult = [];
            finalResult.push(user)
            console.log('the user: ', finalResult)
            Recipe.find({ owner: req.params.id })
                .then(recipesFromUser => {
                    recipesFromUser.forEach(ele => {
                        // console.log('recipe: ', ele)
                        finalResult.push(ele)
                    })
                    res.json(finalResult)
                    // console.log('the final result:', finalResult)
                })
        })
        .catch(err => {
            res.json(err)
        })
})


module.exports = usersRoutes;
