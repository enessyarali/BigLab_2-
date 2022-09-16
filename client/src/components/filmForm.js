import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import dayjs from 'dayjs';
import {useNavigate, useParams} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useState} from 'react';

function FilmForm(props) {
    const navigate = useNavigate();
    const {filmID} = useParams();

    const editableFilm = (props.films ? props.films.find(film => film.id === parseInt(filmID)) : undefined);

    const [name, setName] = useState(editableFilm ? editableFilm.name : '');
    const [favorite, setFavorite] = useState(editableFilm ? editableFilm.favorite : false);
    const [watchdate, setWatchdate] = useState(editableFilm ? (editableFilm.watchdate === undefined ? dayjs() : editableFilm.watchdate) : dayjs());
    const [rating, setRating] = useState(editableFilm ? editableFilm.rating : 0);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (editableFilm === undefined) {
            const newFilm = {name: name, favorite: favorite, watchdate: dayjs(watchdate), rating: rating, user: props.user};
            if (!props.user) props.setMessage({msg: 'Login First!', type: 'danger'});
            if (newFilm.watchdate.isValid()) {
                props.addFilm(newFilm);
            } else {
                newFilm.watchdate = undefined;
                props.addFilm(newFilm);
            }
        }
        else {
            const editedFilm = {id: editableFilm.id, name: name, favorite: favorite, 
                watchdate: dayjs(watchdate), rating: rating, user: editableFilm.user};
            if (editedFilm.watchdate.isValid()) {
                props.editFilm(editedFilm);
            } else {
                editedFilm.watchdate = undefined;
                props.editFilm(editedFilm);
            }
        }

        navigateToPreviousRoute(props.filter, navigate);
    }

    return (
      <Form onSubmit={handleSubmit}>
        <Row className='mb-3'>
            <Form.Group as={Col}>
                <Form.Label className='mylabel'>Name</Form.Label>
                <Form.Control size='sm' type='text' required={true} value={name}
                    onChange={event => setName(event.target.value)}/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label className='mylabel'>Watch date</Form.Label>
                <Form.Control size='sm' type='date' value={watchdate.format('YYYY-MM-DD')} 
                onChange={event => setWatchdate(dayjs(event.target.value))}/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label className='mylabel'>Rating</Form.Label>
                <Form.Control size='sm' type='number' value={rating} min={0} max={5}
                onChange={event => setRating(parseInt(event.target.value))}/>
            </Form.Group>
        </Row>
        <Form.Group className='mb-3'>
            <Form.Label className='mylabel'>Favorite?</Form.Label>
            <Form.Check size='sm' className="formlabel mylabel favlabel" type="checkbox" checked={favorite}
                onChange={() => setFavorite(val => val ? false : true)}/>
        </Form.Group>
        
        <Button variant='success' type='submit'>Save&nbsp;<i className={'bi bi-upload'}/></Button>&nbsp;
        <Button variant='danger' onClick={() => navigateToPreviousRoute(props.filter, navigate)}>Cancel</Button>
      </Form>
      
    );
}

function navigateToPreviousRoute(filter, navigate) {
    if (filter === 'All') navigate('/');
    else if (filter === 'Favorite') navigate('/favorite');
    else if (filter === 'Best Rated') navigate('/bestrated');
    else if (filter === 'Seen Last Month') navigate('/seenlastmonth');
    else if (filter === 'Unseen') navigate('/unseen');
}

export default FilmForm;