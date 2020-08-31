const express = require('express');
const usersRoutes = express.Router();

const User = require('../models/user-model');

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
        console.log('user', user)
        res.json(user)
    })
    .catch(err => {
        res.json(err)
    })
})

usersRoutes.get('/users/:id/recipes/recipe_id', (req, res, next) => {
    //retorna receita específica de um usuário
})

module.exports = usersRoutes;
