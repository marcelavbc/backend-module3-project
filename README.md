# Module 3 App Project

# Developer: 
Marcela Vilas Boas Charchar

# Link to App: 
XXXXX

## Description

Search recipes according to available ingredients
 
## User Stories

- **sign up** - As a user I want to sign up and create my account.

- **login** - As a user I want to be able to log in and access my account. 

- **logout** - As a user I want to be able to log out and keep my data safe.

- **profile** - As a user I want to see and edit my profile information

- **search** - As a user I want to be able to add the ingredients I have to find the perfect recipe to cook. 

- **recipes** - As a user I want to select a recipe from a list and see all the information about it. I want to save this recipe to my own recipe book, if I wish. 

## ROUTES:
## HOMEPAGE
| Method | URL | Description      |
| ------ | ----| ---------------- |
| GET    | /   | renders homepage |

## LOGIN
| Method | URL    | Description             |
| ------ | -------| ----------------------- |
| GET    | /login | redirects to login form |
| POST   | /login | redirects to login form |


## CREATE ACCOUNT
| Method | URL    | Description              |
| ------ | -------| ------------------------ |
| GET    | /login | redirects to signup form |
| POST   | /login | redirects to signup form |


## LOGOUT
| Method | URL     | Description             |
| ------ | ------- | ------------------------|
| POST   | /logout | redirects to login page |


### PROFILE 
| Method | URL      | Description                                     |
| ------ | -------- | ------------------------------------------------|
| GET    | /profile | redirects to profile user page                  |
| PUT    | /profile | redirects to profile page with the data changed |


## Models
### User model: 
  username: String,
  password: String,
  email: String,
  googleID: String,
  avatar: {
    type: String,
    default: ""
  },