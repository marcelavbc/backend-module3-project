const express = require('express');
const profileRoutes = express.Router();
const User = require('../models/user-model');
const Recipe = require('../models/recipe-model')
const InternalSavedRecipe = require('../models/internal-saved-recipes')
const ApiSavedRecipe = require('../models/api-saved-recipes')
const axios = require('axios')
const uploader = require('../configs/cloudinary-setup')

profileRoutes.put('/profile/updateavatar', uploader.single("avatar"), (req, res, next) => {
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
    // console.log("id:", id)
    User.findByIdAndUpdate(id, { quote })
        .then(() => res.json({ quote: quote }))
        .catch(err => res.json(err))
});


profileRoutes.post('/profile/recipes', uploader.single("image"), (req, res, next) => {
    const image = req.file ? req.file.path : null
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
    const userId = req.session.currentUser._id
    if (req.isAuthenticated()) {
        Recipe.findById(req.body.recipeId)
            .then(recipe => {
                if (recipe) {
                    InternalSavedRecipe.create({
                        user: userId,
                        recipe: req.body.recipeId,
                    })
                        .then(savedRecipe => {
                            res.status(200).json(savedRecipe)
                        })
                } else {
                    ApiSavedRecipe.create({
                        user: userId,
                        recipe: req.bodyrecipeId,
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
    // console.log('get savedRecipes')
    if (req.isAuthenticated()) {
        //buscar as receitas internas 
        InternalSavedRecipe.find({ user: userId })
            .populate('recipe')
            .populate('user')
            .then(internalRecipesList => {
                console.log('mostre internalRecipesList ', internalRecipesList)
                //buscar as receitas externas
                const finalResponse = [...internalRecipesList] //deve ter os resultado das duas buscas
                ApiSavedRecipe.find({ user: userId })
                    .then(apiRecipesList => {
                        //misturar e devolver a resposta
                        console.log('mostre Api RecipesList ', apiRecipesList)

                        const idsList = []
                        apiRecipesList.forEach(ele => {
                            // console.log('datos', ele)
                            idsList.push(ele.recipeId)
                        })
                        // console.log('idsList ', idsList)
                        if (idsList.length) {
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
                                    // console.log('response.data: ', response.data)
                                    const formatedApiRecipeList = apiRecipesList.map(ele => {

                                        const data = response.data.find(recipe => recipe.id == ele.recipeId)
                                        if (data) {
                                            return {
                                                _id: ele._id,
                                                title: data.title,
                                                readyInMinutes: data.readyInMinutes,
                                                servings: data.servings,
                                                extendedIngredients: data.extendedIngredients,
                                                analyzedInstructions: data.analyzedInstructions,
                                                image: data.image,
                                                recipeId: data.id
                                            }
                                        }
                                        return ele
                                    })
                                    // console.log('ApiRecipeList', apiRecipesList)

                                    // console.log('formatedApiRecipeList', formatedApiRecipeList)
                                    res.status(200).json(finalResponse.concat(formatedApiRecipeList))
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        } else {
                            res.status(200).json(finalResponse)
                        }
                    })
            })
    } else {
        res.status(401).json({ message: 'Unauthorized.' });

    }
})

profileRoutes.delete('/profile/savedInternalRecipes/:_id', (req, res, next) => {
    // console.log('savedRecipes delete called')
    if (req.isAuthenticated()) {
        InternalSavedRecipe.findByIdAndRemove(req.params._id)
            .then(deletedRecipe => {
                res.status(200).json(deletedRecipe)
            })
            .catch((error) => {
                console.log(error)
            })
    }
})

profileRoutes.delete('/profile/recipe/:_id', (req, res, next) => {
    // console.log('my recipe delete called')
    if (req.isAuthenticated()) {
        Recipe.findByIdAndRemove(req.params._id)
            .then(deletedRecipe => {
                InternalSavedRecipe.deleteMany({ recipe: req.params._id })
                    .then(() => {
                        res.status(200).json(deletedRecipe)
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }
})

profileRoutes.delete('/profile/savedApiRecipes/:_id', (req, res, next) => {
    if (req.isAuthenticated()) {
        ApiSavedRecipe.findByIdAndRemove(req.params._id)
            .then(deletedRecipe => {
                res.status(200).json(deletedRecipe)
            })
            .catch((error) => {
                console.log(error)
            })
    }
})



module.exports = profileRoutes