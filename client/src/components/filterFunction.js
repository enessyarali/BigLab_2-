import dayjs from 'dayjs';

function filterFilms(films, criterion) {
    if (criterion === 'All') {
        return (films);
    }
    else if (criterion === 'Favorite') {
        return (films.filter(film => film.favorite === true));
    }
    else if (criterion === 'Best Rated') {
        return (films.filter(film => film.rating === 5));
    }
    else if (criterion === 'Seen Last Month') {
        const today_date = dayjs();
        return (films.filter(film => {
            return (today_date.diff(film.watchdate, 'day') <= 30) && (film.watchdate !== undefined)
        }));
    }
    else if (criterion === 'Unseen') {
        return (films.filter(film => film.watchdate === undefined));
    }
}

export {filterFilms};