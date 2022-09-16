import {useState} from 'react';
import {Form, Button, Row} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import '../App.css';

function LoginForm(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = {username, password};
      props.login(credentials);
      navigate('/login');
  };

  return (
      <Form onSubmit={handleSubmit}>
          <Row className="mb-3 myform mx-auto" >
              <Form.Group controlId="username">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" value={username} 
                      onChange={ev => setUsername(ev.target.value)} required={true}/>
              </Form.Group>
          </Row>

          <Row className="mb-3 myform mx-auto" >
              <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={password} 
                      onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
              </Form.Group>
          </Row>
          

          <Button type="submit">Login</Button>
      </Form>
  )
};

function LogoutButton(props) {
  return (
    <Button className='myuserbuttons' variant="danger" disabled={props.user ? false : true} 
      onClick={async () => {await props.logout(); props.navigate('/login')}}>Logout</Button>
  )
}

export {LoginForm, LogoutButton};