import React, { useState, useEffect, useRef  } from "react";
import { Accordion, Offcanvas, Button, Overlay, ButtonGroup , Dropdown , DropdownButton  } from "react-bootstrap";

export const TemplateLanding = () => {
  const [show, setShow] = useState(true);

    //For overlay
  const [showOverLay, setShowOverLay] = useState(false);
  const target = useRef(null);
  //________________________________

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setShow(!isMobile); // Show sidebar by default on desktop, hide on mobile
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize); // Listen to window resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Header */}
      <header className="admin-header">
        <Button
          className="slider-toggle-btn"
          variant="primary"
          onClick={handleShow}
        >
          Open Menu
        </Button>
        <h1>Admin Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Left Sidebar */}
        <Offcanvas
          show={show}
          onHide={handleClose}
          backdrop={false}
          scroll={true}
          placement="start"
          className="admin-slider"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Navigation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h2>Hello Admin</h2>
            <hr />
            {/* <>
      {['Primary'].map(
        (variant) => (
          <DropdownButton
            as={ButtonGroup}
            key={variant}
            id={`dropdown-variants-${variant}`}
            variant={variant.toLowerCase()}
            title={variant}
          >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3" active>
              Active Item
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>
        ),
      )}
    </> */}
            <DropdownButton className="slider-dropdown-1" title="User">
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item> */}

              <Dropdown.Item eventKey="1">Add Users</Dropdown.Item>
              <Dropdown.Item eventKey="2">Edit/Remove</Dropdown.Item>
              {/* <Dropdown.Item eventKey="3" active>
                Active Item
              </Dropdown.Item> */}
              {/* <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
            </DropdownButton>
<hr/>

<DropdownButton className="slider-dropdown-1" title="Human Resources">
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item> */}

              <Dropdown.Item eventKey="1">Employee</Dropdown.Item>
              <Dropdown.Item eventKey="2">Add Employee</Dropdown.Item>
              <Dropdown.Item eventKey="3">Edit/Remove Employee</Dropdown.Item>
              <Dropdown.Item eventKey="3">Leaves</Dropdown.Item>
              {/* <Dropdown.Item eventKey="3" active>
                Active Item
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
            </DropdownButton>

            <hr/>

<DropdownButton className="slider-dropdown-1" title="Accounts">
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item> */}

              <Dropdown.Item eventKey="1">Expenses</Dropdown.Item>
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
              <Dropdown.Item eventKey="3" active>
                Active Item
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
            </DropdownButton>



<hr/>

<DropdownButton className="slider-dropdown-1" title="Academics">
              {/* <Dropdown.Item eventKey="2">Another action</Dropdown.Item> */}

              <Dropdown.Item eventKey="1">Add Students</Dropdown.Item>
              <Dropdown.Item eventKey="2">Edit/Remove Students</Dropdown.Item>
              <Dropdown.Item eventKey="3">Attendance</Dropdown.Item>
              <Dropdown.Item eventKey="4">Marks</Dropdown.Item>
              <Dropdown.Item eventKey="4">Exam Control</Dropdown.Item>
              {/* <Dropdown.Item eventKey="3" active>
                Active Item
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item> */}
            </DropdownButton>






          </Offcanvas.Body>
        </Offcanvas>

        <main className={`admin-main ${show ? "sidebar-open" : ""}`}>
  
  <div className="admin-content">
    <h2>Welcome to Admin Panel</h2>
    <p>Use the menu to navigate through different sections.</p>
  </div>
  
</main>
      </main>

      {/* Footer */}
      <footer className="admin-footer">
        <p>&copy; 2025 Admin Portal. All rights reserved.</p>
      </footer>
    </>
  );
};
