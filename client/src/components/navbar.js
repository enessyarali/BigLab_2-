import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import {Navbar, Container, Col} from 'react-bootstrap'; 
import {LogoutButton} from './authComponents';
import {useNavigate} from 'react-router-dom';

function NavBar(props) {
    const navigate = useNavigate();
    return (
        <Navbar bg="primary" variant="dark" fixed='top'> 
          <Container fluid> 
              <Col><NavbarTitle/></Col>
              <Col><LogoutButton className='myuserbuttons' user={props.user} logout={props.logout} navigate={navigate}/></Col>
              <Col align = 'right'><NavbarUIcon  filter={props.filter} navigate={navigate} user={props.user}/></Col>
          </Container>
        </Navbar>
    );
}

function NavbarTitle() {
    return (
        <Navbar.Brand href='#home'><NavbarFIcon/>Film Library</Navbar.Brand>
    );
}

function NavbarFIcon() {
    return (
        <button className={'smybtn'}><i className={"bi bi-collection-play"}></i></button>
    );
}

function NavbarUIcon(props) {
    return (
        <button onClick={() => {props.navigate('/login')}} 
            className='uicon' size='lg'><i className={"bi bi-person-circle"}></i></button>
    );
}
export default NavBar;