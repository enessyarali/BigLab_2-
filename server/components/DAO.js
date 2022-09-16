const sqlite = require('sqlite3');
const DBHandler = require('./dbFunctions');

class FilmLibDAO {
    constructor(dbPath) {
        this.db = new sqlite.Database(dbPath, (err) => {
            if (err) console.log('Error connecting to database.');
            else (console.log("Connected to database."));
        });
        this.dbHandler = new DBHandler(this.db);
    }

    // Table management methods
    async newTableFilms() {
        await this.dbHandler.run("CREATE TABLE IF NOT EXISTS films(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name	TEXT NOT NULL, favorite INTEGER NOT NULL DEFAULT (0), watchdate	TEXT, rating INTEGER DEFAULT 0, user INTEGER NOT NULL, FOREIGN KEY(user) REFERENCES users(id))");
    }
    async newTableUsers() {
        await this.dbHandler.run("CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, email	TEXT NOT NULL, name	TEXT, hash TEXT NOT NULL, salt TEXT NOT NULL)");
    }
    async dropTableFilms() {
        await this.dbHandler.run("DROP TABLE IF EXISTS films");
    }
    async dropTableUsers() {
        await this.dbHandler.run("DROP TABLE IF EXISTS users");
    }

    // GET
    async getAllFilms(userID) {
        return await this.dbHandler.all("SELECT * FROM films WHERE user=?", [userID]);
    }
    async getFavoriteFilms(userID) {
        return await this.dbHandler.all("SELECT * FROM films WHERE favorite=1 AND user=?", [userID]);
    }
    async getBestRatedFilms(userID) {
        return await this.dbHandler.all("SELECT * FROM films WHERE rating=5 AND user=?", [userID]);
    }
    async getWatchedFilms(userID) {
        return await this.dbHandler.all("SELECT * FROM films WHERE watchdate IS NOT NULL AND user=?", [userID]);
    }
    async getUnseenFilms(userID) {
        return await this.dbHandler.all("SELECT * FROM films WHERE watchdate IS NULL AND user=?", [userID]);
    }
    async getFilmByID(ID) {
        return await this.dbHandler.get("SELECT * FROM films WHERE id=?", [ID]);
    }

    async getUserByEmail(email) {
        return await this.dbHandler.get("SELECT * FROM users WHERE email=?", [email]);
    }
    async getUserByID(ID) {
        return await this.dbHandler.get("SELECT * FROM users WHERE id=?", [ID]);
    }
    async getUsers() {
        return await this.dbHandler.all("SELECT * FROM users");
    }

    // POST
    async addFilm(film) {
        return await this.dbHandler.run("INSERT INTO films(name, favorite, watchdate, rating, user) VALUES(?, ?, ?, ?, ?)",
        [film.name, film.favorite, film.watchdate, film.rating, film.user]);
    }
    async addUser(user) {
        return await this.dbHandler.run("INSERT INTO users(email, name, hash, salt) VALUES(?, ?, ?, ?)", [user.email, user.name, user.hash, user.salt]);
    }

    // PUT
    async editFilm(film, ID) {
        await this.dbHandler.run("UPDATE films SET name=?, favorite=?, watchdate=?, rating=?, user=? WHERE id=?",
        [film.name, film.favorite, film.watchdate, film.rating, film.user, ID]);
    }
    async setFavorite(ID, fav) {
        await this.dbHandler.run("UPDATE films SET favorite=? WHERE id=?", [fav, ID]);
    }
    async setRating(ID, rating) {
        await this.dbHandler.run("UPDATE films SET rating=? WHERE id=?", [rating, ID]);
    }
    
    // DELETE
    async deleteFilm(ID) {
        await this.dbHandler.run("DELETE FROM films WHERE id=?", [ID]);
    }
}

module.exports = FilmLibDAO;