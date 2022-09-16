'use strict';
const dayjs = require('dayjs');

/**
 * Constructor function for new Film objects
 * @param {number} id ID of the film (e.g., 1), given by the DB
 * @param {string} name Film name (e.g., 'El Rey Leon')
 * @param {boolean} favorite Favorite? (true / false)
 * @param {string} watchdate Date when the film was watched (optional), in a format parseable by dayjs()
 * @param {number} rating Rating given by some user
 * @param {number} user User (whom the film was added by)
 */
function Film (id, name, favorite, watchdate, rating, user) {
    this.id = id
    this.name = name;
    this.favorite = favorite;
    this.watchdate = watchdate ? dayjs(watchdate) : undefined;
    this.rating = rating ? rating : 0;
    this.user = user;
}
module.exports = Film;