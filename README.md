# BigLab 2 - Class: 2022 [WA1-AJ/WA1-KZ]

## Team name: BEMO

Team members:
* s304812 BEATRICE PIRAS
* s304811 OMAR ANDRES ORMACHEA HERMOZA 
* s295805 MOTRASH MOHAMED KHALED HASSAN ALY
* s302845 ENES SEMIH YARALI

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://polito-wa1-aw1-2022.github.io/materials/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://polito-wa1-aw1-2022.github.io/materials/labs/GH-Classroom-BigLab-Instructions.pdf), covering BigLabs and exam sessions.

Once you cloned this repository, please write the group name and names of the members of the group in the above section.

In the `client` directory, do **NOT** create a new folder for the project, i.e., `client` should directly contain the `public` and `src` folders and the `package.json` files coming from BigLab1.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.
Remember that `npm install` should be executed inside the `client` and `server` folders (not in the `BigLab2` root directory).

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email | password | name |
|-------|----------|------|
| john.doe@polito.it | password | John |
| mario.rossi@polito.it | password | Mario |
| testuser@polito.it | password | Test |

## List of APIs offered by the server


* ### POST http://localhost:3000/api/login
 
     It estabilishes a login session for a user

     Returns status 201 on success - Returns status 401 on wrong login
     
* ### DELETE http://localhost:3000/api/logout
 
     It ends the session for a user
     
* ###  GET http://localhost:3000/api/sessions/current 
  
     It returns the session of authenticated user

     Returns status 200 on success (authenticated user) - Returns status 401 on not authenticated case

* ###  GET http://localhost:3000/api/films/user/:id 
  
     It returns the list of all films stored in the database for the user of the specified id

     Parameter to insert : id (user)
     
     Returns for example, a map of  
                 { id: film.id,
                   name: film.name,
                   favorite: film.favorite,
                   watchdate: film.watchdate,
                   rating: film.rating,
                   user: film.user } 

     Returns status 200 on success - Returns status 500 on database error


* ### GET http://localhost:3000/api/films/user/:id/favorite
 
     It returns the list of the favourite films stored in the database for the user of the specified id
     
     Parameter to insert : id (user)

     Returns for example, a map of  
                 { id: film.id,
                   name: film.name,
                   favorite: film.favorite,
                   watchdate: film.watchdate,
                   rating: film.rating,
                   user: film.user }

     Returns status 200 on success - Returns status 500 on database error


* ### GET http://localhost:3000/api/films/user/:id/bestrated
 
     It returns the list of the best rated films stored in the database for the user of the specified id
     
     Parameter to insert : id (user)

     Returns for example, a map of  
                 { id: film.id,
                   name: film.name,
                   favorite: film.favorite,
                   watchdate: film.watchdate,
                   rating: film.rating,
                   user: film.user }

     Returns status 200 on success - Returns status 500 on database error


* ### GET http://localhost:3000/api/films/user/:id/seenlastmonth
 
     It returns the list of all films seen in the last month that are stored in the database for the user of the specified id

     Parameter to insert : id (user)
 
     Returns for example, a map of  
                 { id: film.id,
                   name: film.name,
                   favorite: film.favorite,
                   watchdate: film.watchdate,
                   rating: film.rating,
                   user: film.user }

     Returns status 200 on success - Returns status 500 on database error


* ### GET http://localhost:3000/api/films/user/:id/unseen 
 
     It returns the list of all unseen films stored in the database for the user of the specified id

     Returns for example, a map of  
                 { id: film.id,
                   name: film.name,
                   favorite: film.favorite,
                   watchdate: film.watchdate,
                   rating: film.rating,
                   user: film.user }

     Returns status 200 on success - Returns status 500 on database error


* ### GET http://localhost:3000/api/films/:id
 
     It returns the film corresponding to the chosen id

     Parameter to insert : id

     Returns for example, an instance of the type: 
                 { id: film.id,
                   name: film.name,
                   favorite: film.favorite,
                   watchdate: film.watchdate,
                   rating: film.rating,
                   user: film.user }

     Returns status 202 on success - Returns status 500 on database error


* ### POST http://localhost:3000/api/films
 
     It inserts in the database a new film 

     Body to insert: all the necessary data to register the film: Name, Favorite, Watchdate, Rating, User

     Returns status 200 on success - Returns status 500 on database error - Returns status 422 on body/parameter errors


* ### PUT http://localhost:3000/api/films/:id

     It updates the data of a film in the database  

     Parameter to insert : id

     Body to insert:  all the necessary data to modify the film: Name, Favorite, Watchdate, Rating, User

     Returns status 200 on success - Returns status 500 on database error - Returns status 422 on body/parameter errors


* ### PUT http://localhost:3000/api/films/:id/favorite

     It updates the 'favorite' field in the selected film in the database to favorite  

     Parameter to insert : id

     Returns status 200 on success - Returns status 500 on database error
     
 * ### PUT http://localhost:3000/api/films/:id/unfavorite

     It updates the 'favorite' field in the selected film in the database to not favorite  

     Parameter to insert : id

     Returns status 200 on success - Returns status 500 on database error


* ### PUT http://localhost:3000/api/films/:id/:rating
 
     It updates the 'rating' field in the selected film in the database  

     Parameters to insert : id, rating

     Returns status 200 on success - Returns status 500 on database error

* ### DELETE http://localhost:3000/api/films/:id/
 
     It deletes the selected film from the database  

     Parameter to insert : id

     Returns status 200 on success - Returns status 500 on database error
