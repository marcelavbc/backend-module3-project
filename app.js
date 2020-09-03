require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');


const session = require('express-session');
const passport = require('passport');

require('./configs/passport');

const User = require('./models/user-model');
// const Recipe = require('./models/recipe-model')


mongoose
  .connect('mongodb://localhost/cook-backend', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use(session({
  secret: process.env.SESS_SECRET,
  resave: true,
  saveUninitialized: true, 
}));


// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback"
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // to see the structure of the data in received response:
//       console.log("Google account details:", profile);

//       User.findOne({ googleID: profile.id })
//         .then(user => {
//           if (user) {
//             done(null, user);
//             return;
//           }

//           User.create({ googleID: profile.id })
//             .then(newUser => {
//               done(null, newUser);
//             })
//             .catch(err => done(err)); // closes User.create()
//         })
//         .catch(err => done(err)); // closes User.findOne()
//     }
//   )
// );


app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Cook - Generated with IronGenerator';

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', ]
}));




const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');
const recipeRoutes = require('./routes/recipes-routes');
const profileRoutes = require('./routes/profile-routes')
const usersRoutes = require('./routes/users-routes')


app.use('/', index);
app.use('/api', authRoutes);
app.use('/api', recipeRoutes)
app.use('/api', profileRoutes)
app.use('/api', usersRoutes)







module.exports = app;
