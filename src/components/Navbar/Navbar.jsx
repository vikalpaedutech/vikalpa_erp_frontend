import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { UserContext } from '../contextAPIs/User.context';

function NavbarComponent() {

      const navigate = useNavigate();
    
      const {userData, setUserData} = useContext(UserContext)
    
      const handleUserLogout = () => {
        setUserData([]); // ✅ Reset to empty array to match expected structure
        alert("Logged out");
        navigate("/user-signin");
      }
    
      //________________________________________________________________________________
    
    

  return (
    
    <Navbar style={{background:'#E6E6FA', height:'15vh'}}>
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
        <div>
            {/* <h1>Welcome, {userData[0].assignedDistricts?.[0]}</h1> */}
            <button onClick={handleUserLogout}>Logout</button>
          </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;