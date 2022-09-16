import Film from './Film';

const expressServerURL = 'http://localhost:3001';

const logIn = async (credentials) => {
    const response = await fetch(`${expressServerURL}/api/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(credentials)
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const logOut = async () => {
    const response = await fetch(`${expressServerURL}/api/logout`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) return null;
}

const getAllFilms = async (userID) => {
    return getFilmsByFilter('', userID);
};

const getFavoriteFilms = async (userID) => {
    return getFilmsByFilter('/favorite', userID);
};

const getBestRatedFilms = async (userID) => {
    return getFilmsByFilter('/bestrated', userID);
};

const getSeenLastMonthFilms = async (userID) => {
    return getFilmsByFilter('/seenlastmonth', userID);
};

const getUnseenFilms = async (userID) => {
    return getFilmsByFilter('/unseen', userID);
};

async function getFilmsByFilter(filter, userID) {
    const response = await fetch(`${expressServerURL}/api/films/user/${userID}${filter}`, {
        method: 'GET',
        credentials: 'include'
    });
    const filmsJSON = await response.json();
    if (response.ok) {
        return filmsJSON.map(film => new Film(film.id, film.name, (film.favorite === 1 ? true : false), 
            (film.watchdate !== null ? film.watchdate : undefined), film.rating, film.user));
    }
    else throw filmsJSON;
};

const addFilm = async (film) => {
    const response = await fetch(`${expressServerURL}/api/films`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({name: film.name, favorite: (film.favorite ? 1 : 0), 
            watchdate: (film.watchdate ? film.watchdate.format('YYYY-MM-DD') : null), rating: film.rating, user: film.user/*film.user*/}) // hard-coded user 1
    });
    if (response.ok) {
        return response.body.lastID;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
};

const editFilm = async (film) => {
    const response = await fetch(`${expressServerURL}/api/films/${film.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({name: film.name, favorite: (film.favorite ? 1 : 0), 
            watchdate: (film.watchdate ? film.watchdate.format('YYYY-MM-DD') : null), rating: film.rating, user: film.user})
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
};

const deleteFilm = async (ID) => {
    const response = await fetch(`${expressServerURL}/api/films/${ID}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
};

const changeRating = async (ID, newRating) => {
    const response = await fetch(`${expressServerURL}/api/films/${ID}/${newRating}`, {
        method: 'PUT',
        credentials: 'include'
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
};

const toggleFavorite = async (ID, favorite) => {
    const response = await fetch(`${expressServerURL}/api/films/${ID}/${favorite ? '' : 'un'}favorite`, {
        method: 'PUT',
        credentials: 'include'
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
};

const reactAPI = {logIn, logOut, getAllFilms, getFavoriteFilms, getBestRatedFilms, getSeenLastMonthFilms, getUnseenFilms, addFilm, editFilm, deleteFilm, changeRating, toggleFavorite};
export default reactAPI;