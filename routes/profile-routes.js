const express = require('express');
const profileRoutes = express.Router();
const User = require('../models/user-model');
const Recipe = require('../models/recipe-model')
const InternalSavedRecipe = require('../models/internal-saved-recipes')
const ApiSavedRecipe = require('../models/api-saved-recipes')
const axios = require('axios')
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
        .then(() => res.json({ quote: quote }))
        .catch(err => res.json(err))
});


profileRoutes.post('/profile/recipes', uploader.single("image"), (req, res, next) => {
    //cria uma nova receita para usuário logado
    console.log('req.body', req.body)
    console.log('req.file', req.file)
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
    console.log('session in profile-routes', req.session)
    console.log('usuario logado:', req.session.currentUser._id)
    const userId = req.session.currentUser._id
    console.log(userId)
    Recipe.find({ owner: userId })
        .populate('owner')
        .then(recipes => {
            res.json(recipes)
        })
        .catch(err => {
            res.json(err)
        })
})

profileRoutes.post('/profile/savedRecipes', (req, res, next) => {
    //favoritar uma receita, interna ou externa
    //1. validar se o usuario está logado
    const userId = req.session.currentUser._id
    if (req.isAuthenticated()) {
        //1. buscar o id internamente. Se não exite, buscar na API
        Recipe.findById(req.body.recipeId)
            .then(recipe => {
                if (recipe) {
                    InternalSavedRecipe.create({
                        user: userId,
                        recipe: req.body.recipeId
                    })
                        .then(savedRecipe => {
                            res.status(200).json(savedRecipe)
                        })
                } else {
                    // verificar se existe na api - toDo
                    //salvar en api-saved-recipe
                    ApiSavedRecipe.create({
                        user: userId,
                        recipeId: req.body.recipeId
                    })
                        .then(savedRecipe => {
                            res.status(200).json(savedRecipe)
                        })
                }
            })
            .catch(err => {
                ApiSavedRecipe.create({
                    user: userId,
                    recipeId: req.body.recipeId
                })
                    .then(savedRecipe => {
                        res.status(200).json(savedRecipe)
                    })
            })
    } else {
        res.status(401).json({ message: 'Unauthorized.' });
    }
})

profileRoutes.get('/profile/savedRecipes', (req, res, next) => {
    const userId = req.session.currentUser._id
    if (req.isAuthenticated()) {
        //buscar as receitas internas 
        InternalSavedRecipe.find({ user: userId })
            .populate('recipe')
            .then(internalRecipesList => {
                //buscar as receitas externas
                const finalResponse = [...internalRecipesList] //deve ter os resultado das duas buscas
                ApiSavedRecipe.find({ user: userId })
                    .then(apiRecipesList => {
                        //misturar e devolver a resposta
                        const idsList = []
                        apiRecipesList.forEach(ele => {
                            idsList.push(ele.recipeId)
                        })
                        axios({
                            "method": "GET",
                            "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk",
                            "headers": {
                                "content-type": "application/octet-stream",
                                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                                "x-rapidapi-key": process.env.SPOONCULAR_KEY,
                                "useQueryString": true
                            }, "params": {
                                "ids": idsList.toString()
                            }
                        })
                            .then((response) => {
                                // console.log('resposta da Api', response.data)
                                //misturamos tudo e enviamos a finalResponse
                                response.data.forEach(apiRecipe => {
                                    finalResponse.push({
                                        _id: apiRecipe.id,
                                        title: apiRecipe.title,
                                        readyInMinutes: apiRecipe.readyInMinutes,
                                        servings: apiRecipe.servings,
                                        extendedIngredients: apiRecipe.extendedIngredients,
                                        analyzedInstructions: apiRecipe.analyzedInstructions,
                                        image: apiRecipe.image
                                    })
                                })
                                res.status(200).json(finalResponse)
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
            })
    } else {
        res.status(401).json({ message: 'Unauthorized.' });

    }
})





module.exports = profileRoutes