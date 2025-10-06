// //This shows the test questions to users.


// import React, {useContext, useEffect, useState} from "react";
// import { Container, Card } from "react-bootstrap";
// import { GetErpTestByUnqUserObjectId } from "../../service/ErpTest.services";
// import { UserContext } from "../contextAPIs/User.context";
// export const ERPtest = () => {

//     const { userData } = useContext(UserContext);

//     //Hooks
//     const [erpTestData, setErpTestData] = useState([]);
  
//   const fetchErptestObject = async () =>{

//     const reqBody = {
//       unqUserObjectId: userData._id
//     }

//     const response = await GetErpTestByUnqUserObjectId(reqBody)

//     setErpTestData(response.data)

//     console.log(response.data)

//   }

//   useEffect(()=>{

//     fetchErptestObject();
//   }, [])


//   const tasks = [
//     {
//       id: "01",
//       question: "Mark your self-attendance.",
//       link: "http://localhost:3000/",
//       answer: "Task completed.",
//       label: "Click here to mark self-attendance."
//     },
//     {
//       id: "02",
//       question: "Record attendance by marking 10 students as present.",
//       link: "http://localhost:3000",
//       answer: "Task completed.",
//       label: "Click here to mark student attendance."
//     },
//     {
//       id: "03",
//       question: "Upload marks for 10 students (use random numbers between 10–20 for training).",
//       link: "Hyperlink for dashboard",
//       answer: "Task successfully completed.",
//       label: "Click here to upload marks."
//     },
//     {
//       id: "04",
//       question: "Update the disciplinary status of one student.",
//       link: null,
//       answer: "Task successfully completed.",
//        label: "Click here to update disciplinary status."
//     },
//     {
//       id: "05",
//       question: "Update the copy-checking status of one student.",
//       link: "Hyperlink for dashboard",
//       answer: "Task successfully completed.",
//       label: "Click here to update copy-checking status."
//     },
//     {
//       id: "06",
//       question: "Download the attendance PDF.",
//       link: "Hyperlink for dashboard",
//       answer: "Task completed.",
//       label: "Click here to download attendance PDF."
//     },
//     {
//       id: "07",
//       question: "Upload the downloaded attendance PDF.",
//       link: "Hyperlink for dashboard",
//       answer: "Task completed.",
//       label: "Click here to upload attendance PDF."
//     },
//     {
//       id: "08",
//       question: "Raise one school-related concern.",
//       link: "Hyperlink for dashboard",
//       answer: "Task completed.",
//       label: "Click here to raise school concern."
//     },
//     {
//       id: "09",
//       question: "Raise one student-related concern.",
//       link: "Hyperlink for dashboard",
//       answer: "Task completed.",
//       label: "Click here to raise student concern."
//     },
//     {
//       id: "10",
//       question: "Raise one tech-related concern.",
//       link: "Hyperlink for dashboard",
//       answer: "Task completed.",
//       label:"Click here to raise tech concern."
//     },
//   ];

//   return (
//     <Container className="my-4">
//       <h2 className="text-center mb-4">ERP Training</h2>
//       {tasks.map((task) => (
//         <Card key={task.id} className="mb-3 shadow-sm">
//           <Card.Body>
//             <Card.Title>
//               {task.id}: {task.question}
//             </Card.Title>
//             {task.link && (
//               <p>
//                 <a href={task.link} target="_blank" rel="noopener noreferrer">
//                   {task.label}
//                 </a>
//               </p>
//             )}
//             <Card.Text>
//               <strong>Answer:</strong> {task.answer}
//             </Card.Text>
//           </Card.Body>
//         </Card>
//       ))}
//     </Container>
//   );
// };








// //This shows the test questions to users.

// import React, { useContext, useEffect, useState } from "react";
// import { Container, Card } from "react-bootstrap";
// import { GetErpTestByUnqUserObjectId } from "../../service/ErpTest.services";
// import { UserContext } from "../contextAPIs/User.context";

// export const ERPtest = () => {
//   const { userData } = useContext(UserContext);

//   //Hooks
//   const [erpTestData, setErpTestData] = useState([]);

//   const fetchErptestObject = async () => {
//     const reqBody = {
//       unqUserObjectId: userData._id,
//     };

//     const response = await GetErpTestByUnqUserObjectId(reqBody);

//     setErpTestData(response.data);

//     console.log(response.data);
//   };

//   useEffect(() => {
//     fetchErptestObject();
//   }, []);

//   const tasks = [
//     {
//       id: "01",
//       question: "Mark your self-attendance.",
//       link: "http://localhost:3000/",
//       field: "selfAttendance",
//       label: "Click here to mark self-attendance.",
//     },
//     {
//       id: "02",
//       question: "Record attendance by marking 10 students as present.",
//       link: "http://localhost:3000",
//       field: "studentAttendanceCount",
//       label: "Click here to mark student attendance.",
//     },
//     {
//       id: "03",
//       question:
//         "Upload marks for 10 students (use random numbers between 10–20 for training).",
//       link: "Hyperlink for dashboard",
//       field: "uploadMarksCount",
//       label: "Click here to upload marks.",
//     },
//     {
//       id: "04",
//       question: "Update the disciplinary status of one student.",
//       link: null,
//       field: "disciplinary",
//       label: "Click here to update disciplinary status.",
//     },
//     {
//       id: "05",
//       question: "Update the copy-checking status of one student.",
//       link: "Hyperlink for dashboard",
//       field: "copyChecking",
//       label: "Click here to update copy-checking status.",
//     },
//     {
//       id: "06",
//       question: "Download the attendance PDF.",
//       link: "Hyperlink for dashboard",
//       field: "downloadAttendancePdfFormat",
//       label: "Click here to download attendance PDF.",
//     },
//     {
//       id: "07",
//       question: "Upload the downloaded attendance PDF.",
//       link: "Hyperlink for dashboard",
//       field: "uploadAttendancePdfFormat",
//       label: "Click here to upload attendance PDF.",
//     },
//     {
//       id: "08",
//       question: "Raise one school-related concern.",
//       link: "Hyperlink for dashboard",
//       field: "schoolConcern",
//       label: "Click here to raise school concern.",
//     },
//     {
//       id: "09",
//       question: "Raise one student-related concern.",
//       link: "Hyperlink for dashboard",
//       field: "studentRelatedConncern",
//       label: "Click here to raise student concern.",
//     },
//     {
//       id: "10",
//       question: "Raise one tech-related concern.",
//       link: "Hyperlink for dashboard",
//       field: "techConcern",
//       label: "Click here to raise tech concern.",
//     },
//   ];

//   const renderTaskStatus = (task) => {
//     if (!erpTestData.length) {
//       return (
//         <span style={{ color: "gray", fontWeight: "bold" }}>
//           Task-completion: Loading...
//         </span>
//       );
//     }

//     const data = erpTestData[0];
//     const value = data[task.field];

//     let completed = false;

//     if (typeof value === "boolean") {
//       completed = value === true;
//     } else if (typeof value === "number") {
//       completed = value >= 10;
//     }

//     if (completed) {
//       return (
//         <span style={{ color: "green", fontWeight: "bold" }}>
//           ✅ Task-completion: Successfully completed
//         </span>
//       );
//     } else {
//       return (
//         <span style={{ color: "red", fontWeight: "bold" }}>
//           ❌ Task-completion: Not attempted
//         </span>
//       );
//     }
//   };

//   const isTaskCompleted = (task) => {
//     if (!erpTestData.length) return false;
//     const data = erpTestData[0];
//     const value = data[task.field];
//     if (typeof value === "boolean") return value === true;
//     if (typeof value === "number") return value >= 10;
//     return false;
//   };

//   return (
//     <Container className="my-4">
//       <h2 className="text-center mb-4">ERP Training</h2>
//       {tasks.map((task) => {
//         const completed = isTaskCompleted(task);
//         return (
//           <Card key={task.id} className="mb-3 shadow-sm">
//             <Card.Body>
//               <Card.Title>
//                 {task.id}: {task.question}
//               </Card.Title>
//               {task.link && (
//                 <p>
//                   <a
//                     href={completed ? undefined : task.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       pointerEvents: completed ? "none" : "auto",
//                       opacity: completed ? 0.6 : 1,
//                       textDecoration: completed ? "none" : "underline",
//                       color: completed ? "gray" : "#0d6efd",
//                       cursor: completed ? "not-allowed" : "pointer",
//                     }}
//                   >
//                     {task.label}
//                   </a>
//                 </p>
//               )}
//               <Card.Text>{renderTaskStatus(task)}</Card.Text>
//             </Card.Body>
//           </Card>
//         );
//       })}
//     </Container>
//   );
// };







//This shows the test questions to users.

import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { GetErpTestByUnqUserObjectId } from "../../service/ErpTest.services";
import { UserContext } from "../contextAPIs/User.context";

export const ERPtest = () => {
  const { userData } = useContext(UserContext);

  //Hooks
  const [erpTestData, setErpTestData] = useState([]);

  const fetchErptestObject = async () => {
    const reqBody = {
      unqUserObjectId: userData._id,
    };

    const response = await GetErpTestByUnqUserObjectId(reqBody);

    setErpTestData(response.data);

    console.log(response.data);
  };

  useEffect(() => {
    fetchErptestObject();
  }, []);

  const tasks = [
    {
      id: "01",
      question: "Mark your self-attendance.",
      link: "http://localhost:3000/",
      field: "selfAttendance",
      label: "Click here to mark self-attendance.",
    },
    {
      id: "02",
      question: "Record attendance by marking 10 students as present.",
      // link: "http://localhost:3000/mb-attendance",
      link: "http://localhost:3000/user-dashboard",
      field: "studentAttendanceCount",
      label: "Click here to mark student attendance.",
    },
    {
      id: "03",
      question:
        "Upload marks for 10 students (use random numbers between 10–20 for training).",
      link: "http://localhost:3000/user-dashboard",
      field: "uploadMarksCount",
      label: "Click here to upload marks.",
    },
    {
      id: "04",
      question: "Update the disciplinary status of one student.",
      link: "http://localhost:3000/user-dashboard",
      field: "disciplinary",
      label: "Click here to update disciplinary status.",
    },
    {
      id: "05",
      question: "Update the copy-checking status of one student.",
      link: "http://localhost:3000/user-dashboard",
      field: "copyChecking",
      label: "Click here to update copy-checking status.",
    },
    {
      id: "06",
      question: "Download the attendance PDF.",
      link: "http://localhost:3000/user-dashboard",
      field: "downloadAttendancePdfFormat",
      label: "Click here to download attendance PDF.",
    },
    {
      id: "07",
      question: "Upload the downloaded attendance PDF.",
      link: "http://localhost:3000/user-dashboard",
      field: "uploadAttendancePdfFormat",
      label: "Click here to upload attendance PDF.",
    },
    {
      id: "08",
      question: "Raise one school-related concern.",
      link: "http://localhost:3000/user-dashboard",
      field: "schoolConcern",
      label: "Click here to raise school concern.",
    },
    {
      id: "09",
      question: "Raise one student-related concern.",
      link: "http://localhost:3000/user-dashboard",
      field: "studentRelatedConncern",
      label: "Click here to raise student concern.",
    },
    {
      id: "10",
      question: "Raise one tech-related concern.",
      link: "http://localhost:3000/user-dashboard",
      field: "techConcern",
      label: "Click here to raise tech concern.",
    },
  ];

  const isTaskCompleted = (task) => {
    if (!erpTestData.length) return false;
    const data = erpTestData[0];
    const value = data[task.field];
    if (typeof value === "boolean") return value === true;
    if (typeof value === "number") return value >= 10;
    return false;
  };

  const renderTaskStatus = (task) => {
    if (!erpTestData.length) {
      return (
        <span style={{ color: "gray", fontWeight: "bold" }}>
          Answer: Loading...
        </span>
      );
    }

    const data = erpTestData[0];
    const value = data[task.field];

    let completed = false;

    if (typeof value === "boolean") {
      completed = value === true;
    } else if (typeof value === "number") {
      completed = value >= 10;
    }

    if (completed) {
      return (
        <div>
          <span style={{ color: "green", fontWeight: "bold" }}>
            ✅ Answer: Successfully Completed
          </span>
          <br />
          <span style={{ color: "green", fontWeight: "bold" }}>Score: 1</span>
        </div>
      );
    } else {
      return (
        <div>
          <span style={{ color: "red", fontWeight: "bold" }}>
            Answer: Not Attempted
          </span>
          <br />
          <span style={{ color: "gray", fontWeight: "bold" }}>Score: 0</span>
        </div>
      );
    }
  };

  const totalQuestions = tasks.length;
  const totalAnswered = tasks.filter((t) => isTaskCompleted(t)).length;

  return (
    <Container className="my-4">
      <h2 className="text-center mb-2">ERP Training</h2>
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "600",
          fontSize: "1.1rem",
          color: "#333",
        }}
      >
        Total Questions: {totalQuestions} |{" "}
        <span style={{ color: "green" }}>Total Answered: {totalAnswered}</span>
      </div>
      {tasks.map((task) => {
        const completed = isTaskCompleted(task);
        return (
          <Card
            key={task.id}
            className="mb-3 shadow-sm"
            style={{
              borderLeft: completed ? "6px solid green" : "6px solid #ccc",
              transition: "0.3s",
            }}
          >
            <Card.Body>
              <Card.Title style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                {task.id}: {task.question}
              </Card.Title>
              {task.link && (
                <p style={{ marginBottom: "8px" }}>
                  <a
                    href={completed ? undefined : task.link}
                    
                    rel="noopener noreferrer"
                    style={{
                      pointerEvents: completed ? "none" : "auto",
                      opacity: completed ? 0.6 : 1,
                      textDecoration: completed ? "none" : "underline",
                      color: completed ? "gray" : "#0d6efd",
                      cursor: completed ? "not-allowed" : "pointer",
                      fontWeight: "500",
                    }}
                  >
                    {task.label}
                  </a>
                </p>
              )}
              <Card.Text>{renderTaskStatus(task)}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
};
