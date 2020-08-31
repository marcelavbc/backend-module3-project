const express = require('express');
const recipeRoutes = express.Router();
const mongoose = require('mongoose')
const uploader = require('../configs/cloudinary-setup')

const Recipe = require('../models/recipe-model')
const User = require('../models/user-model')






module.exports = recipeRoutes;
