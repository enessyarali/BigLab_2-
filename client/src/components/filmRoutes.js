import {Container, Row, Col, Alert} from 'react-bootstrap';
import {Outlet} from 'react-router-dom';
import {useEffect} from 'react';
import SideBar from './sidebar';
import NavBar from './navbar';
import FilmList from './filmList';
import FilmForm from './filmForm';
import {LoginForm} from './authComponents';

function DefaultRoute() {
    return (
        <Container>
          <h1>Nothing here bruv</h1>
          <h2>bye</h2>
        </Container>
    );
}

function LoginRoute(props) {
  return (
    <>
      <Row>
        {props.msg && <Row>
          <Alert variant={props.msg.type} className={'myalert'} onClose={() => props.setMessage('')} dismissible>{props.msg.msg}</Alert>
        </Row>}
        <Col>
          <h1>Login</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm login={props.login} filter={props.filter} user={props.user}/>
        </Col>
      </Row>
    </>
  );
}

function FilmRoute(props) {
  useEffect(() => {
    props.setFilter(props.filter);
  }, [props, props.filter]);
    return (
        <>
          <Row>
            <NavBar user={props.user} logout={props.logout}/>
          </Row>
          <div className={'sidenav'}>
            <SideBar setFilter={props.setFilter} currFilter={props.filter}/>
          </div>
          <div className={'main'} id='content'>
            <div>
              <h2 className={'container1'}>Filter:</h2>
              <h4 className={'container1'}>&nbsp;{props.filter}</h4>
            </div>
            <FilmList films={props.films} delete={props.deleteFilm} user={props.user} msg={props.msg} setMessage={props.setMessage}
                        chRating={props.changeRating} toggleFav={props.toggleFavorite}/>
          </div>
        </>
    );
}

function FormRoute(props) {
    return (
      <Container className='App'>
        <Row>
          <Col>
            <h1>Enter Film data:</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <FilmForm key={props.editableFilm ? props.editableFilm.id : 0} film={props.editableFilm} 
            addFilm={(film) => {props.add(film)}}
            editFilm={(film) => {props.edit(film)}}
            filter={props.filter} user={props.user} msg={props.msg} setMessage={props.setMessage}/>
            </Col>
        </Row>
    </Container>
    );
}

function EditRoute() {
    return (
      <Container className='App'>
        <Row>
          <Col>
            <h1>Edit Film data:</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Outlet/>
          </Col>
        </Row>
    </Container>
    );
}

export {DefaultRoute, LoginRoute, FilmRoute, FormRoute, EditRoute};