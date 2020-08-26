const express = require('express');
const usersRoutes = express.Router();

const User = require('../models/user-model');

usersRoutes.get('/users', (req, res, next) => {
    //retorna todos os usuários
})

usersRoutes.get('/users/:id/recipes', (req, res, next) => {
    //retorna todas as receitas de um usuário
})

usersRoutes.get('/users/:id/recipes/recipe_id', (req, res, next) => {
    //retorna receita específica de um usuário
})

module.exports = usersRoutes;
