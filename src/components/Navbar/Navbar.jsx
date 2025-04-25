import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { UserContext } from '../contextAPIs/User.context';
import { MdMenuOpen } from "react-icons/md";
import { SliderContext } from '../contextAPIs/SliderHook.context';

function NavbarComponent() {

  //context hooks
  const {sliderContext, setSliderContext} = useContext(SliderContext)
      const navigate = useNavigate();
    
      const {userData, setUserData} = useContext(UserContext)
    
      const handleUserLogout = () => {
        setUserData([]); // ✅ Reset to empty array to match expected structure
        alert("Logged out");
        navigate("/user-signin");
      }
    
      //________________________________________________________________________________
    
    //Logic for opening and closing slider
      const handleClose = () => setSliderContext(false);
      const handleShow = () => {
      
        setSliderContext(true);}
//____________________________________________________

  return (
    
    <Navbar style={{background:'#FFFAF0', height:'15vh', borderBottom:'solid'}}>
      <Container>

      
       
                   <Navbar.Brand className='navbar-brand' > <MdMenuOpen
                    onClick={handleShow}
                    style={{
                      cursor: "pointer",
                      width: "30px", // Change this to your preferred width
                      height: "30px", // Change this to your preferred height
                      cursor: "pointer",
                    }}
                  /></Navbar.Brand>
        {/* <Navbar.Brand href="#home">Navbar with text</Navbar.Brand> */}
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            
          </Navbar.Text>
        </Navbar.Collapse>
        <div style={{marginLeft:'75vw'}}>
            {/* <h1>Welcome, {userData[0].assignedDistricts?.[0]}</h1> */}
            {/* <button onClick={handleUserLogout}>Logout</button> */}
            <img onClick={handleUserLogout} style={{width:"50px", marginTop:'6vh'}} src='./logout.png'/>
          </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;