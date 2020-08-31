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

### Auth Routes
## SIGN UP
| Method | URL       | Description              |
| ------ | ----------| ------------------------ |
| POST   | api/login | create a new account     |

## LOGIN
| Method | URL       | Description             |
| ------ | ----------| ----------------------- |
| POST   | api/login | login                   |

## LOGOUT
| Method | URL        | Description             |
| ------ | ---------- | ------------------------|
| POST   | api/logout | logout                  |

## LOGGEDIN
| Method | URL         | Description                    |
| -----  | ----------- | -------------------------------|
| GET    | api/logout  | check if the user is logged in |

### Profile Routes
| Method | URL                  |          Description                           |
| ------ | -------------------- | -----------------------------------------------|
| PUT    | /profile/updateavatar| changes avatar image                           |
| PUT    | /profile/edit        | changes user data                              |
| POST   | /profile/recipes     | create a new recipe in the profile             |
| GET    | /profile/recipes     | return all recipes from profile                |
| GET    | /profile/recipes/:id | redirects to recipe details page               |
| PUT    | /profile/recipes/:id | edit recipe details                            |
| DELETE | /profile/recipes/:id | delete a recipe                                |

### Users Routes
| Method | URL                          |          Description                           |
| ------ | ---------------------------- | -----------------------------------------------|
| GET    | /users                       | return all users                               |
| GET    | /users/:id/recipes           | return all recipes from user                   |
| GET    | /users/:id/recipes/recipe_id | return one recipe from user                    |

### Recipes Routes
| Method | URL        |          Description                           |
| ------ | ---------- | -----------------------------------------------|
| GET    | /recipes   | return all recipes by query                    |


## Models
### User model: 
  - username: String,
  - password: String,
  - email: String,
  - googleID: String,
  - quote: String,
  - avatar: {
    type: String,
    default: ""
  },