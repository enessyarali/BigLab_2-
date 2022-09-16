import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {useNavigate} from 'react-router-dom';
import {Container, ListGroup} from 'react-bootstrap'; 

function SideBar(props) {
    const navigate = useNavigate();
    return (       
      <Container>
        <ListGroup variant="flush" as="ul">
          <ListGroup.Item variant='primary' action active={props.currFilter === 'All'}
          onClick={() => {props.setFilter('All'); navigate('/')}}>All</ListGroup.Item>
          <ListGroup.Item variant='primary' action active={props.currFilter === 'Favorite'}
          onClick={() => {props.setFilter('Favorite'); navigate('/favorite')}}>Favorite</ListGroup.Item>
          <ListGroup.Item variant='primary' action active={props.currFilter === 'Best Rated'}
          onClick={() => {props.setFilter('Best Rated'); navigate('/bestrated')}}>Best Rated</ListGroup.Item>
          <ListGroup.Item variant='primary' action active={props.currFilter === 'Seen Last Month'}
          onClick={() => {props.setFilter('Seen Last Month'); navigate('/seenlastmonth')}}>Seen Last Month</ListGroup.Item>                
          <ListGroup.Item variant='primary' action active={props.currFilter === 'Unseen'}
          onClick={() => {props.setFilter('Unseen'); navigate('/unseen')}}>Unseen</ListGroup.Item>
        </ListGroup>
      </Container>
    );
}

export default SideBar;