const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
// const uploadCloud = require('../configs/cloudinary-setup');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const ensureLogin = require('connect-ensure-login')
const uploader = require('../configs/cloudinary-setup')
// require the user model !!!!
const User = require('../models/user-model');

//SIGNUP POST
authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const avatar = req.body.avatar;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (regex.test(password)) {
  //   res.status(400).json({ message: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }
  if (password.length < 7) {
    res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: "Username check went bad." });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'Username taken. Choose another one.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      username: username,
      password: hashPass,
      email: email,
      avatar: avatar
    });

    aNewUser.save(err => {
      if (err) {
        res.status(400).json({ message: 'Saving user to database went wrong.' });
        return;
      }
      // Automatically log in user after sign up
      // .login() here is actually predefined passport method
      req.login(aNewUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Login after signup went bad.' });
          return;
        }
        // Send the user's information to the frontend
        res.status(200).json(aNewUser);
      });
    });
  });
});

//LOGIN
authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong authenticating user' });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Session save went bad.' });
        return;
      }
      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
      // console.log(req.user)
    });
  })(req, res, next);
});

// authRoutes.get("/auth/google", passport.authenticate("google", {
//   scope: [
//     "https://www.googleapis.com/auth/userinfo.profile",
//     "https://www.googleapis.com/auth/userinfo.email"
//   ]
// }));
// authRoutes.get("/auth/google/callback", passport.authenticate("google", {
//   successRedirect: "/profile",
//   failureRedirect: "/login"
// }));

//LOGOUT
authRoutes.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

//LOGGEDIN
authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

//UPLOAD
authRoutes.post('/upload', uploader.single("avatar"), (req, res, next) => {
  console.log("upload listo")
  console.log("File: ", req.file)
  if (!req.file) {
    next(new Error('no file uploaded!'));
    return;
  }
  res.json({ path: req.file.path })
})



// PUT	/auth/edit
authRoutes.put('/edit', (req, res, next) => {
  // const username = req.body.username;
  // const password = req.body.password;
  // const campus = req.body.campus;
  // const course = req.body.course;
  const avatar = req.body.avatar;

  //achar o usuário pelo id e modificar a imagem
  //se o usuario está logado, tem uma sessao 
  const id = req.user._id
  console.log("id:", id)
  User.findByIdAndUpdate(id, {avatar})
  .then(response => res.json({message: "image updated with success"}))
  .catch(err => res.json(err))
  

});

module.exports = authRoutes;
