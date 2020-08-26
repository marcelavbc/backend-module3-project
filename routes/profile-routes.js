const express = require('express');
const profileRoutes = express.Router();
const User = require('../models/user-model');
const uploader = require('../configs/cloudinary-setup')

profileRoutes.put('/profile/edit', uploader.single("avatar"), (req, res, next) => {
    //subir em claudicar e atualizar profile
    const avatar = req.body.avatar;
    const quote = req.body.quote
    const id = req.user._id

    User.findByIdAndUpdate(id, { avatar, quote })
        .then(response => res.json({ message: "data updated with success" }))
        .catch(err => res.json(err))
})

profileRoutes.get('/profile/recipes', (req, res, next) => {
    //retorna todas as receitas do usuário logado
})

profileRoutes.post('/profile/recipes', (req, res, next) => {
    //cria uma nova receita para usuário logado
})

profileRoutes.get('/profile/recipes/:id', (req, res, next) => {
    //retorna detalhes de uma receita do usuário logado
})

profileRoutes.put('/profile/recipes/:id', (req, res, next) => {
    //modifica detalhes de uma receita do usuário logado
})

profileRoutes.delete('/profile/recipes/:id', (req, res, next) => {
    //modifica detalhes de uma receita do usuário logado
})

module.exports = profileRoutes