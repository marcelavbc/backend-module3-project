const express = require('express');
const profileRoutes = express.Router();
const User = require('../models/user-model');
const Recipe = require('../models/recipe-model')
const uploader = require('../configs/cloudinary-setup')

profileRoutes.put('/profile/updateavatar', uploader.single("avatar"), (req, res, next) => {
    //subir em claudicar e atualizar profile
    console.log('session in profile-routes', req.session)
    console.log('usuario logado:', req.session.currentUser)
    const avatar = req.file.path;
    const id = req.user._id
    if (!req.file) {
        next(new Error('no file uploaded!'));
        return;
    }
    User.findByIdAndUpdate(id, { avatar })
        .then(() => res.json({ avatar: avatar }))
        .catch(err => res.json(err))
})


profileRoutes.put('/profile/editQuote', (req, res, next) => {
    const quote = req.body.quote
    const id = req.user._id
    console.log("id:", id)
    User.findByIdAndUpdate(id, { quote })
        .then(res => res.json({ quote: quote }))
        .catch(err => res.json(err))
});


profileRoutes.post('/profile/recipes', uploader.single("image"), (req, res, next) => {
    //cria uma nova receita para usuário logado
    console.log('req.body', req.body)
    console.log('req.file', req.file)

    const image = req.file ? req.file.path : ''
    console.log(image)
    const recipe = {
        title: req.body.title,
        owner: req.body.owner,
        title: req.body.title,
        extendedIngredients: JSON.parse(req.body.extendedIngredients),
        analyzedInstructions: JSON.parse(req.body.analyzedInstructions),
        imagePath: image
    }

    Recipe.create(recipe)
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            res.json(err)
        })
})

profileRoutes.get('/profile/recipes', (req, res, next) => {
    //retorna todas as receitas do usuário logado
    console.log('usuario logado:', req.session.currentUser._id)
    const userId = req.session.currentUser._id
    console.log(userId)
    Recipe.find({ owner: userId })
        .then(recipes => {
            res.json(recipes)
            console.log('recipes',recipes)
        })
        .catch(err => {
            res.json(err)
        })
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