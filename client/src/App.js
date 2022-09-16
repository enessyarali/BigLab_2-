import './App.css';
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useState, useEffect, useCallback} from 'react';
import {Container} from 'react-bootstrap';
import FilmForm from './components/filmForm';
import {DefaultRoute, LoginRoute, FilmRoute, FormRoute, EditRoute} from './components/filmRoutes';

import reactAPI from './reactAPI'

function App() {
  const [films, setFilms] = useState([]); 
  const [filter, setFilter] = useState('All');
  const [user, setUser] = useState(0);
  const [message, setMessage] = useState('');

  const getFilteredFilms = useCallback(async (userID) => { // useCallback to avoid infinite loop in useEffect
    let filteredFilms = undefined;
    switch (filter) {
      case 'All':
        filteredFilms = await reactAPI.getAllFilms(userID);
        break;
      case 'Favorite':
        filteredFilms = await reactAPI.getFavoriteFilms(userID);
        break;
      case 'Best Rated':
        filteredFilms = await reactAPI.getBestRatedFilms(userID);
        break;
      case 'Seen Last Month':
        filteredFilms = await reactAPI.getSeenLastMonthFilms(userID);
        break;
      case 'Unseen':
        filteredFilms = await reactAPI.getUnseenFilms(userID);
        break;
      default:
        filteredFilms = undefined;
    }
    setFilms(filteredFilms);

  }, [filter]);

  useEffect(() => { // useEffect gets executed twice even with empty array as dependency, 
                    // Update: this happens because we're in React development mode
    const filterFilms = async () => {
      if (user) {
        await getFilteredFilms(user);
      } 
    }; 
    filterFilms();
  }, [filter, getFilteredFilms, user]);

  const handleLogin = async (credentials) => {
    try {
      const user = await reactAPI.logIn(credentials);
      setUser(user.id);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    } 
    catch(err) {
      console.log(err);
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await reactAPI.logOut();
    setUser(0);
    setFilms([]);
    setMessage('');
  };

  const chooseFilter = (fltr) => setFilter(fltr);

  const deleteFilm = async (filmID) => {
    setFilms(films => films.map(film => {
      if (film.id !== filmID) {
        return film;
      }
      else return {id: film.id, name: film.name, favorite: film.favorite,
        watchdate: film.watchdate, rating: film.rating, user: film.user, status: 'deleted'};
    }));

    await reactAPI.deleteFilm(filmID);
    await getFilteredFilms(user);
  }

  const addFilm = async (newFilm) => {
    if (user) {
      newFilm.status = 'added';
      newFilm.id = 0; // Doing this so that React doesn't give the warning of non-unique key on <li> when updating the local state.
                      // When the getFilteredFilms() method is called, the correct id will be set.
      setFilms(oldFilms => [...oldFilms, newFilm]); // first update the local state

      await reactAPI.addFilm(newFilm);
      await getFilteredFilms(user);
    }
  };

  const editFilm = async (editedFilm) => {
    setFilms(oldFilms => {
      return oldFilms.map(film => {
        if (editedFilm.id === film.id) {
          return {id: editedFilm.id, name: editedFilm.name, favorite: editedFilm.favorite,
                  watchdate: editedFilm.watchdate, rating: editedFilm.rating, user: editedFilm.user, status: 'edited'};
        }
        else return film;
      });
    });

    await reactAPI.editFilm(editedFilm);
    await getFilteredFilms(user);

  }

  const changeRating = async (modifiedFilmID, newRating) => {
    let modify = true;
    setFilms((oldFilms) => {
      return oldFilms.map((elem) => {
        if (modifiedFilmID === elem.id) {
          if (elem.rating === newRating) {
            modify = false;
            return elem;
          }
          return {id: elem.id, name: elem.name, favorite: elem.favorite, 
                  watchdate: elem.watchdate, rating: newRating, user: elem.user, status: 'edited'};
        } else return elem;
      });
    });

    if (modify) {
      await reactAPI.changeRating(modifiedFilmID, newRating);
      await getFilteredFilms(user);
    }
  };

  const toggleFavorite = async (modifiedFilmID) => {
    let favorite = true; // if favorite is true, reactAPI will send URL .../favorite, otherwise .../unfavorite
    setFilms((oldFilms) => {
      const films = oldFilms.map((elem) => {
        if (modifiedFilmID === elem.id) {
          if (elem.favorite) {
            favorite = false; // toggle to false on the db
          }
          return {id: elem.id, name: modifiedFilmID, favorite: (elem.favorite ? false : true), 
                  watchdate: elem.watchdate, rating: elem.rating, user: elem.user, status: 'edited'};
        } else return elem;
      });
      return films;
    });

    await reactAPI.toggleFavorite(modifiedFilmID, favorite);
    await getFilteredFilms(user);
  }

  return (
    <Container className="App" fluid>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={user ? <Navigate replace to='/' /> : <LoginRoute login={handleLogin} filter={filter} msg={message}
                                                                                setMessage={setMessage} user={user}/>}/>                                    
          <Route path='/' element={<FilmRoute films={films} filter={'All'} deleteFilm={deleteFilm}
                                              changeRating={changeRating} toggleFavorite={toggleFavorite}
                                              setFilter={chooseFilter} user={user} msg={message} setMessage={setMessage} logout={handleLogout}/>}/>
          <Route path='/favorite' element={<FilmRoute films={films} filter={'Favorite'} deleteFilm={deleteFilm}
                                              changeRating={changeRating} toggleFavorite={toggleFavorite}
                                              setFilter={chooseFilter} user={user} msg={message} setMessage={setMessage} logout={handleLogout}/>}/>
          <Route path='/bestrated' element={<FilmRoute films={films} filter={'Best Rated'} deleteFilm={deleteFilm}
                                              changeRating={changeRating} toggleFavorite={toggleFavorite}
                                              setFilter={chooseFilter} user={user} msg={message} setMessage={setMessage} logout={handleLogout}/>}/>  
          <Route path='/seenlastmonth' element={<FilmRoute films={films} filter={'Seen Last Month'} deleteFilm={deleteFilm}
                                              changeRating={changeRating} toggleFavorite={toggleFavorite}
                                              setFilter={chooseFilter} user={user} msg={message} setMessage={setMessage} logout={handleLogout}/>}/>
          <Route path='/unseen' element={<FilmRoute films={films} filter={'Unseen'} deleteFilm={deleteFilm}
                                              changeRating={changeRating} toggleFavorite={toggleFavorite}
                                              setFilter={chooseFilter} user={user} msg={message} setMessage={setMessage} logout={handleLogout}/>}/>                                                                                                          
          <Route path='*' element={<DefaultRoute/>}/>
          <Route path='/add' element={<FormRoute add={addFilm} filter={filter} user={user} msg={message} setMessage={setMessage}/>}/>
          <Route path='/edit' element={<EditRoute edit={editFilm}/>}>
            <Route index element={<h2>Please, specify the Film ID</h2>}/> 
            <Route path=':filmID' element={
              <FilmForm editFilm={editFilm} films={films} filter={filter}/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
