// // Footer.jsx
// import React, { useContext } from "react";
// import { Button, Container } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../components/contextAPIs/User.context";

// export const Footer = () => {
//   const { userData } = useContext(UserContext);
//   const navigate = useNavigate();

//   if (userData?.role !== "hkrn") return null; // 👈 Only show for 'hkrn' users

//   const handleGoToTest = () => {
//     navigate("/erp-test");
//   };

//   const handleSubmitTest = () => {
//     alert("submit");
//     navigate("/erp-test");
//   };

//   return (
//     <div
//       className="footer fixed-bottom bg-light shadow-sm"
      
//     >
//       <Container className="d-flex justify-content-center gap-3">
//         <Button variant="outline-primary" onClick={handleGoToTest}>
//           Go to Test
//         </Button>
//         <Button variant="primary" onClick={handleSubmitTest}>
//           Submit Test
//         </Button>
//       </Container>
//     </div>
//   );
// };


// // style={{
// //         borderTop: "1px solid rgba(0,0,0,0.1)",
// //         padding: "1px 0",
// //       }}




// Footer.jsx
import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contextAPIs/User.context";

export const Footer = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  if (userData?.role !== "hkrn") return null; // 👈 Only show for 'hkrn' users

  const handleGoToTest = () => {
    navigate("/erp-test");
  };

  const handleSubmitTest = () => {
    alert("submit");
    navigate("/erp-test");
  };

  return (
    <div
      className="footer fixed-bottom bg-light shadow-sm"
      
    >
      <Container className="d-flex justify-content-center gap-3">
        <Button variant="outline-primary" onClick={handleGoToTest}>
          Go to Test
        </Button>
        {/* <Button variant="primary" onClick={handleSubmitTest}>
          Submit Test
        </Button> */}
      </Container>
    </div>
  );
};


// style={{
//         borderTop: "1px solid rgba(0,0,0,0.1)",
//         padding: "1px 0",
//       }}