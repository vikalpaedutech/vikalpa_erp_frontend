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
      question: "Mark the attendance of students from classes 9 and 10, where Sailesh and Aryan from class 10 are absent, and Modit Kundu and Aaditya Kumar Sharma from class 9 are absent.",
      // link: "http://localhost:3000/mb-attendance",
      link: "http://localhost:3000/user-dashboard",
      field: "studentAttendanceCount",
      label: "Click here to mark student attendance.",
    },
    {
      id: "03",
      question:
        "Update marks of students from classes 9 and 10, where Sailesh and Aryan from class 10 were absent in test, and Modit Kundu and Aaditya Kumar Sharma from class 09 were absent in test. (use random numbers between 10–20 for training).",
      link: "http://localhost:3000/user-dashboard",
      field: "uploadMarksCount",
      label: "Click here to upload marks.",
    },
    {
      id: "04",
      question: `Please update the disciplinary records of the following students based on their recent behavior:

For Class 10:
Sailesh – reported late to class.

Nandini – absent for an entire week.

For Class 9:
1. Khushi – caught using a mobile phone during class hours.

2. Modit Kundu – engaged in talking during class.

3. Aaditya Kumar Sharma – displayed disrespectful behavior and left the class without the teacher’s permission.
      `,
      link: "http://localhost:3000/user-dashboard",
      field: "disciplinary",
      label: "Click here to update disciplinary status.",
    },
    {
      id: "05",
      question: `Please update the Classwork Copy-Checking records for the following students as per their respective subjects:

For Class 10:
1. Sailesh: English – Complete, Hindi – Incomplete, Maths – Unavailable.

2. Nandini: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.

For Class 9:
1. Khushi: Caught using a mobile phone during class hours.

2. Modit Kundu: English – Complete, Hindi – Incomplete, Maths – Unavailable.

3. Aaditya Kumar Sharma: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.`,
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
      question: "Upload the attendance pdf that was downloaded in question 6.",
      link: "http://localhost:3000/user-dashboard",
      field: "uploadAttendancePdfFormat",
      label: "Click here to upload attendance PDF.",
    },
    {
      id: "08",
      question: `Please raise five school-related concerns on the ERP system for the following situations:

For class 10:
1. The school was unexpectedly closed today due to a sudden event; raise a concern in the ERP to record this.

2. A half-day was announced due to a specific event; raise a concern in the ERP regarding this.

For class 9:
1. Classes were interrupted due to a poor internet connection; raise a concern in the ERP about this issue.

2. Optional classes are not being conducted in your school; raise a concern in the ERP regarding this matter.

3. Question papers of students have not been checked; raise a concern in the ERP to report this issue.`,
      link: "http://localhost:3000/user-dashboard",
      field: "schoolConcern",
      label: "Click here to raise school concern.",
    },
    {
      id: "09",
      question: `Raise 5 Student-related concerns on the ERP for the following situations:

For class 10:      
1. The MB App is not working properly, and students are unable to log in or access their dashboards. Raise a concern on ERP regarding this issue.

2. A student’s details need to be added to the ERP, but the record is not yet available in the system. Raise a concern on ERP to add the student.

For class 9:
1. A new student has joined the school, and their admission details need to be updated in the ERP. Raise a concern regarding this new admission.

2. A student’s SLC (School Leaving Certificate) has been released, and the record needs to be removed from the ERP. Raise a concern to update the system accordingly.

3. A student’s examination center has changed, but the ERP still shows the old center. Raise a concern regarding this center change.`,
      link: "http://localhost:3000/user-dashboard",
      field: "studentRelatedConncern",
      label: "Click here to raise student concern.",
    },
    {
      id: "10",
      question: `Raise the Tech-related concerns on ERP for following classes and equipment:

For class 9:
1. The smart classroom screen is not functioning properly in Class 9; raise a concern on ERP regarding the screen issue.

2. The inverter is not working, causing frequent power interruptions during lessons in Class 9; raise a concern on ERP about this problem.

3. The microphone in Class 9 is not operational, making it difficult for teacher to hear the students clearly; raise a concern on ERP to resolve this issue.

4. The internet connection in Class 9 is very poor, disrupting online classes; raise a concern on ERP regarding this connectivity issue.

For class 10:
1. The camera in Class 10’s smart classroom is not working, preventing video sessions and monitoring; raise a concern about this issue on ERP.

2. The Mini PC used for teaching in Class 10 is not starting or frequently crashes; raise a concern on ERP to report this malfunction.

3. There is a power supply issue in Class 10 due to electricity fluctuations; raise a concern on ERP to get this resolved.`,
      link: "http://localhost:3000/user-dashboard",
      field: "techConcern",
      label: "Click here to raise tech concern.",
    },

     {
      id: "11",
      question: `Make the absentee calling to the students of class 9th and 10th who were absent in the class.`,
      link: "http://localhost:3000/user-dashboard",
      field: "absenteeCalling",
      label: "Click here to make absentee callings.",
    },

     {
      id: "12",
      question: `Please close the previously raised school-related concerns on the ERP system

Each concern should be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:

For Class 10:

1. The school was unexpectedly closed today due to a sudden event – Resolved.

2. A half-day was announced due to a specific event – Resolved.

For Class 9:

1. Classes were interrupted due to a poor internet connection – Still Not Resolved.

2. Optional classes are not being conducted in your school – Still Not Resolved.

3. Question papers of students have not been checked – Resolved.

Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
      link: "http://localhost:3000/user-dashboard",
      field: "absenteeCalling",
      label: "Click here to make absentee callings.",
    },




     {
      id: "13",
      question: `Please close the previously raised student-related concerns on the ERP system.

Each concern should now be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:

For Class 10:

1. The MB App was not working properly, and students were unable to log in or access their dashboards – Resolved.

2. A student’s details needed to be added to the ERP, but the record was not available – Still Not Resolved.

For Class 9:

1. A new student had joined the school, and their admission details needed to be updated in the ERP – Resolved.

2. A student’s SLC (School Leaving Certificate) had been released, and the record needed to be removed from the ERP – Still Not Resolved.

3. A student’s examination center had changed, but the ERP still showed the old center – Resolved.

Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
      link: "http://localhost:3000/user-dashboard",
      field: "absenteeCalling",
      label: "Click here to make absentee callings.",
    },


    {
      id: "14",

      question: `Please close the previously raised Tech-related concerns on the ERP system.

Each concern should now be closed with the appropriate status — either Resolved or Still Not Resolved — as mentioned below:

For Class 9:

1. The smart classroom screen was not functioning properly – Resolved.

2. The inverter was not working, causing frequent power interruptions – Still Not Resolved.

3. The microphone in Class 9 was not operational, making it difficult for the teacher to hear the students – Resolved.

4. The internet connection in Class 9 was very poor, disrupting online classes – Still Not Resolved.

For Class 10:

1. The camera in Class 10’s smart classroom was not working, preventing video sessions and monitoring – Resolved.

2. The Mini PC used for teaching in Class 10 was frequently crashing or not starting – Still Not Resolved.

3. The power supply issue in Class 10 due to electricity fluctuations – Resolved.

Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,

      link: "http://localhost:3000/user-dashboard",
      field: "absenteeCalling",
      label: "Click here to make absentee callings.",
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
                 <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
                    {task.id}:{task.question}
                  </pre>
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
