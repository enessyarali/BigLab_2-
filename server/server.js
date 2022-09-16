const express = require('express');
const dayjs = require('dayjs');
const bodyParser = require('body-parser'); // middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const morgan = require('morgan'); // for logging
const cors = require('cors');

const FilmLibDAO = require('./components/DAO');
const UserAuth = require('./components/userAuth');
const dbHandler = new FilmLibDAO('films.db');
const userAuth = new UserAuth(dbHandler.db);

const PORT = 3001;

const app = new express();

// Passport 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// Middlewares

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) { // req.body should contain .username and .password
    const user = await userAuth.getUserHashCheck(username, password); // wether user doesn't exist or just password is wrong, do not inform this
    // The function above MUST be a Promise
    if (!user) {
        return cb(null, false, 'Incorrect username and/or password.'); // return cb(err, user, info)
    } 
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) { // for storing in session storage (and cookie content)
    cb(null, {id: user.id, email: user.email, name: user.name});
  });
  
passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
});
  
const isLoggedIn = (req, res, next) => { // middle-ware for some methods
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}
  
app.use(session({
    secret: "es un secreto",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

// Develop here
app.post('/api/login', function (req, res, next) { // this is a middleware callback, no "actual" callback is specified in this express api
    passport.authenticate('local', (err, user, info) => { // this will execute the LocalStrategy defined above, with cb() referring to these parameters
        if (err) return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).send(info);
        }
          // success, perform the login
          /*
          Passport exposes a login() function on req that can be used to establish a login session.
          When the login operation completes, user will be assigned to req.use
          Note: passport.authenticate() middleware invokes req.login() automatically. This function is primarily 
          used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.
          - Taken from Passport documentation
          */ 
        req.login(user, (err) => { 
            if (err) return next(err);
            // req.user contains the authenticated user, we send all the user info back
            return res.status(201).json(req.user);
        });
    }) (req, res, next); // IIFE (Immediately Invoked Function Expression)
});

app.delete('/api/logout', isLoggedIn, (req, res) => {
    req.logout(() => {
        res.end();
    });
});

app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) return res.status(200).json(req.user);
    return res.status(401).json({error: 'Not authenticated'});
});

app.get('/api/hello', (req, res) => {
    let message = {
        message: 'Hello World!'
    }
    return res.status(200).json(message);
  });

app.get('/api/films/user/:id', isLoggedIn, async (req, res) => {
    try {
        let films = await dbHandler.getAllFilms(req.params.id);
        films.map((film) => {
            return {
                id: film.id,
                name: film.name,
                favorite: film.favorite,
                watchdate: film.watchdate,
                rating: film.rating,
                user: film.user
            };
        });
        return res.status(200).json(films);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.get('/api/films/user/:id/favorite', isLoggedIn, async (req, res) => {
    try {
        let films = await dbHandler.getFavoriteFilms(req.params.id);
        films.map((film) => {
            return {
                id: film.id,
                name: film.name,
                favorite: film.favorite,
                watchdate: film.watchdate,
                rating: film.rating,
                user: film.user
            };
        });
        return res.status(200).json(films);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.get('/api/films/user/:id/bestrated', isLoggedIn, async (req, res) => {
    try {
        let films = await dbHandler.getBestRatedFilms(req.params.id);
        films.map((film) => {
            return {
                id: film.id,
                name: film.name,
                favorite: film.favorite,
                watchdate: film.watchdate,
                rating: film.rating,
                user: film.user
            };
        });
        return res.status(200).json(films);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.get('/api/films/user/:id/seenlastmonth', isLoggedIn, async (req, res) => {
    try {
        let watchedFilms = await dbHandler.getWatchedFilms(req.params.id);
        let todayDate = dayjs('2022-06-03'); // Assumed for testing
        console.log('Today date: ' + todayDate.format('MMMM DD, YYYY'));
        recentFilms = watchedFilms.filter((film) => todayDate.diff(dayjs(film.watchdate), 'day') <= 30);
        recentFilms.map((film) => {
            return {
                id: film.id,
                name: film.name,
                favorite: film.favorite,
                watchdate: film.watchdate,
                rating: film.rating,
                user: film.user
            };
        });
        return res.status(200).json(recentFilms);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.get('/api/films/user/:id/unseen', isLoggedIn, async (req, res) => {
    try {
        let films = await dbHandler.getUnseenFilms(req.params.id);
        films.map((film) => {
            return {
                id: film.id,
                name: film.name,
                favorite: film.favorite,
                watchdate: film.watchdate,
                rating: film.rating,
                user: film.user
            };
        });
        return res.status(200).json(films);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.get('/api/films/:id', isLoggedIn, async (req, res) => {
    const ID = req.params.id;
    try {
        let film = await dbHandler.getFilmByID(ID);
        if (film === undefined) {
            return res.status(404).json({error: 'Not Found'});
        }
        film = {
            id: film.id,
            name: film.name,
            favorite: film.favorite,
            watchdate: film.watchdate,
            rating: film.rating,
            user: film.user
        };
        return res.status(202).json(film);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.post('/api/films', 
[
    isLoggedIn,
    check('name').exists().withMessage('Missing name'),
    check('name').isString().withMessage('Name is not a string'),
    check('favorite').exists().withMessage('Missing favorite'),
    check('favorite').isInt().withMessage('Favorite is not an int'),
    check('watchdate').exists().withMessage('Missing watchdate'),
    check('watchdate').matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|([1-2]\d)|3[0-1])$/).optional({nullable: true}).withMessage('Wrong date (or format)'),
    check('rating').exists().withMessage('Missing rating'),
    check('rating').isInt().withMessage('Rating is not an integer'),
    check('user').exists().withMessage('Missing user'),
    check('user').isInt().withMessage('User is not an int')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({error: errors.array()});
    }
    try {
        const lastID = await dbHandler.addFilm(req.body);
        res.status(200).json({lastID: lastID.id});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.put('/api/films/:id', [
    check('id').isInt().withMessage('req.params.id is not an int'),
    check('name').exists().withMessage('Missing name'),
    check('name').isString().withMessage('Name is not a string'),
    check('favorite').exists().withMessage('Missing favorite'),
    check('favorite').isInt().withMessage('Favorite is not an int'),
    check('watchdate').exists().withMessage('Missing watchdate'),
    check('watchdate').matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|([1-2]\d)|3[0-1])$/).optional({nullable: true}).withMessage('Wrong date (or format)'),
    check('rating').exists().withMessage('Missing rating'),
    check('rating').isInt().withMessage('Rating is not an integer'),
    check('user').exists().withMessage('Missing user'),
    check('user').isInt().withMessage('User is not an int')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({error: errors.array()});
    }
    const ID = req.params.id;
    const film = {
        name: req.body.name,
        favorite: req.body.favorite,
        watchdate: req.body.watchdate,
        rating: req.body.rating,
        user: req.body.user
    };
    try {
        await dbHandler.editFilm(film, ID);
        return res.status(200).json({message: 'OK'});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.put('/api/films/:id/favorite', async (req, res) => {
    const ID = req.params.id;
    try {
        await dbHandler.setFavorite(ID, 1);
        return res.status(200).json({message: 'OK'});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
    
});

app.put('/api/films/:id/unfavorite', async (req, res) => {
    const ID = req.params.id;
    try {
        await dbHandler.setFavorite(ID, 0);
        return res.status(200).json({message: 'OK'});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.put('/api/films/:id/:rating', async (req, res) => {
    const ID = req.params.id;
    rating = req.params.rating;
    try {
        await dbHandler.setRating(ID, rating);
        return res.status(200).json({message: 'OK'});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'});
    }
});

app.delete('/api/films/:id', async (req, res) => {
    const ID = req.params.id;
    try {
        await dbHandler.deleteFilm(ID);
        return res.status(200).json({message: 'OK'});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'DB error'})
    }
});

// Activate the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
