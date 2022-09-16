import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {Row, Col, Button, Alert} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

function FilmList (props) {
    const filteredFilms = props.films;
    const filmElements = filteredFilms.map(film => {
      let statusClass = 'list-group-item';
      switch(film.status) {
        case 'added':
          statusClass = 'list-group-item list-group-item-success';
          break;
        case 'edited':
          statusClass = 'list-group-item list-group-item-info';
          break;
        case 'deleted':
          statusClass = 'list-group-item list-group-item-danger';
          break;
        default:
          break;
      }
      return (<li className={statusClass} key={film.id}>
        <OneFilmRow key={film.id} film={film} delete={props.delete} chRating={props.chRating} 
        toggleFav={props.toggleFav} edit={props.edit}/></li>
      )
    }); // Is this a side-effect?

    return (
      <Col>
        {props.msg && <Row>
          <Alert variant={props.msg.type} className={'myalert'} onClose={() => props.setMessage('')} dismissible>{props.msg.msg}</Alert>
        </Row> }
        <ul className={'list-group list-group-flush'}>{filmElements}</ul>
          <Link to='/add'>
            <Button variant='primary'><i className={'bi bi-plus'}></i></Button>
          </Link> 
      </Col>
      );
}

function OneFilmRow(props){
  return (
    <Row>
      <Col md={4}><FilmNameActions film={props.film} delete={props.delete} edit={props.edit}/></Col>
      <Col md='auto' align='right'><FilmFav film={props.film} toggleFav={props.toggleFav}/></Col>
      <Col md={4} align='right'><h6 className='filmtext'>{props.film.watchdate ? 
        props.film.watchdate.format('MMMM DD, YYYY') : ''}</h6></Col>
      <Col align ='right'><FilmRating film={props.film} chRating={props.chRating}/></Col>
    </Row>
  );
}

function FilmNameActions(props){
  return (
      <Row>
        <Col md={1} align='left'><TrashButton film={props.film} delete={props.delete}/></Col>
        <Col md={1} align='left'><EditButton film={props.film} edit={props.edit}/></Col>
        <Col md='auto' align ='left'>
          <h6 className={props.film.favorite ? 'filmtext red' : 'filmtext'}>{props.film.name}</h6>
        </Col>
      </Row>
  );
}

function TrashButton(props) {
  return (
    <button className={'bi bi-trash myaction remove'} onClick={() => props.delete(props.film.id)}/>
  );
}

function EditButton(props) {
  const navigate = useNavigate();
  return (
    <button className={"bi bi-pencil-square myaction edit"} 
    onClick={() => {navigate(`/edit/${props.film.id}`)}}/>
  );
}

function FilmFav(props){
  return (
    <Row>
      <Col><input className={'inpt'} type="checkbox" checked={props.film.favorite}
        onChange={() => props.toggleFav(props.film.id)}/></Col>
      <Col md={1}><h6 className='filmtext'>Favorite</h6></Col>
    </Row>
  );
}

function FilmRating(props){
  const starEmpty = "bi bi-star mystar";
  const starFill = "bi bi-star-fill mystar";
  return (
    <div className='myrow'>
      <button className={props.film.rating < 5 ? starEmpty : starFill} 
      onClick={() => props.chRating(props.film.id, 5)}/>
      <button className={props.film.rating < 4 ? starEmpty : starFill} 
      onClick={() => props.chRating(props.film.id, 4)}/>
      <button className={props.film.rating < 3 ? starEmpty : starFill} 
      onClick={() => props.chRating(props.film.id, 3)}/>
      <button className={props.film.rating < 2 ? starEmpty : starFill} 
      onClick={() => props.chRating(props.film.id, 2)}/>
      <button className={props.film.rating < 1 ? starEmpty : starFill} 
      onClick={() => props.chRating(props.film.id, 1)}/>
    </div>
    );
}

export default FilmList;