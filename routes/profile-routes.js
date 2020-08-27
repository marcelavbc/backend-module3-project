const express = require('express');
const profileRoutes = express.Router();
const User = require('../models/user-model');
const Recipe = require('../models/recipe-model')
const uploader = require('../configs/cloudinary-setup')

profileRoutes.put('/profile/updateavatar', uploader.single("avatar"), (req, res, next) => {
    //subir em claudicar e atualizar profile
    console.log('session in profile-routes', req.session)
    console.log('usuario logado:', req.session.currentUser)
    console.log('usuario logado 2:', req.user)


    const avatar = req.file.path;
    const id = req.user._id

    if (!req.file) {
        next(new Error('no file uploaded!'));
        return;
    }
    // res.json({ path: req.file.path })
    User.findByIdAndUpdate(id, { avatar })
        .then(response => res.json({ avatar: avatar }))
        .catch(err => res.json(err))
})



profileRoutes.put('/profile/edit', (req, res, next) => {

  const quote = req.body.quote
  //achar o usuário pelo id e modificar a imagem
  //se o usuario está logado, tem uma sessao 
  const id = req.user._id
  console.log("id:", id)
  User.findByIdAndUpdate(id, { quote })
    .then(response => res.json({ quote: quote }))
    .catch(err => res.json(err))
});


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