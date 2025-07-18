// // This is AttendanceSession1.jsx.

// // This component marks the attendance of class 8th for MB

// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb  } from 'react-bootstrap';

// import { getAllAttendance, updateAttendanceBySrnAndDate } from "../../service/AttendanceMB.services.js";
// import { DistrictBlockSchoolById, ClassOfStudent  } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";

// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../contextAPIs/DependentDropdowns.contextAPI";
// import { UserContext } from "../contextAPIs/User.context.js";
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

// import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services.js";

// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"

// const AttendanceMB = ({assignedDistricts, assignedBlocks, assignedSchools}) => {

//     //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
//     const {userData, setUserData} = useContext(UserContext)
//     const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
//     const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
//     const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
//     //______________________________________________________________________________________________

//     //ClassContext API
//     const {classContext, setClassContext} = useContext(ClassContext);

//     //_____________________________________________________

//     const [attendanceData, setAttendanceData] = useState([]);
//     const [error, setError] = useState(null);

//     //Hooks for managing query params for fetching attendance data.
//     const [studentSrn, setStudentSrn] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [fatherName, setFatherName] = useState("");
//     const [date, setDate] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [classofStudent, setClassOfStudent] = useState("");
//     const [batch, setBatch] = useState("");
//     const [status, setStatus] = useState("");

//     const [studentCount, setStudentCount] = useState([]);

//     // Track attendance state individually for each student using an object.
//     const [attendanceState, setAttendanceState] = useState({});

//     //Student Related Counts
//     const fetchStudentRelatedCounts = async () => {
//         const payload = {
//             schoolIds: userData[0].schoolIds,
//             classFilters: userData[0].classId,
//             date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format
//         };

//         try {
//             const response = await studentAndAttendanceAndAbsenteeCallingCount(
//                 payload
//             );
//             console.log(response.data);
//             setStudentCount(response.data);
//         } catch (error) {
//             console.log("Error fetching student count");
//         }
//     };

//     useEffect(() => {
//         fetchStudentRelatedCounts();
//     }, []);

//     //Below useEffect handles date thing
//     useEffect(()=>{
//         setDate(new Date().toISOString().split("T")[0])
//     }, [])

//     // Define query parameters for loading data on frontend
//     const queryParams = {
//         studentSrn:"",
//         firstName:"",
//         fatherName:"",
//         date: date,
//         startDate: date,
//         endDate: endDate || "",
//         schoolId:Object(schoolContext[0]).value || userData[0].assignedSchools,
//         classofStudent:classContext.value || ['9', '10'],
//         batch:"",
//         status:['Absent', 'Present'],
//     };
//     console.log(Object(districtContext[0]).value)

//     const fetchAttendance = async () => {
//         console.log(userData[0].assignedDistricts)
//         console.log(date)
//         console.log(queryParams)

//         if (true) {
//             try {
//                 const response = await getAllAttendance(queryParams);
//                 setAttendanceData(response.data); 
//                 console.log("I am inside attendance mb")
//                 console.log(response.data)

//                 const initialAttendanceState = {};
//                 response.data.forEach((attendance) => {
//                     initialAttendanceState[attendance.studentSrn] = attendance.isAttendanceMarked;
//                 });
//                 setAttendanceState(initialAttendanceState);
//             } catch (error) {
//                 console.log("Error fetching attendance data");
//                 setAttendanceData([])
//             }
//         } else (console.log("Please select all filters"))
//     };

//     useEffect(() => {
//         fetchAttendance();
//     }, [districtContext, blockContext, schoolContext, date, endDate, classContext]);

//     useEffect(()=> {
//         setBlockContext([])
//         setSchoolContext([])
//         setSchoolContext({})
//         setAttendanceData([])
//     }, [districtContext])

//     useEffect(()=> {
//         setAttendanceData([])
//     }, [ classContext])

//     useEffect(()=> {
//         setSchoolContext([])
//     }, [blockContext])

//     // Function to handle attendance update (marking attendance)
//     const handleAttendanceUpdate = async (studentSrn, isMarked) => {
//         const queryParamsForAttendance = {
//             studentSrn: studentSrn,
//             date: date, 
//         };

//         console.log(isMarked)
//         console.log(`Student SRN: ${studentSrn}, Currently Marked: ${isMarked ? 'Present' : 'Absent'}`);

//         if(isMarked === true) {
//             console.log('marked absent')

//             const isAttendanceMarked = {isAttendanceMarked: false}

//             try {
//                 setAttendanceState((prevState) => ({
//                     ...prevState,
//                     [studentSrn]: !isMarked,
//                 }));

//                 const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked);
//                 fetchStudentRelatedCounts(); // ✅ refresh counts after update

//             } catch (error) {
//                 console.error("Error updating attendance", error.message);
//             }

//         } else {
//             console.log('marked present')

//             const isAttendanceMarked = {isAttendanceMarked: true}

//             try {
//                 setAttendanceState((prevState) => ({
//                     ...prevState,
//                     [studentSrn]: !isMarked,
//                 }));

//                 const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked);
//                 fetchStudentRelatedCounts(); // ✅ refresh counts after update

//             } catch (error) {
//                 console.error("Error updating attendance", error.message);
//             }
//         }
//     };

//     attendanceData.sort((a, b)=>a.studentDetails.firstName.localeCompare(b.studentDetails.firstName))

//     return (
//         <Container fluid className="prevent-overflow">
//             <Form>
//                 <div >
//                     <div className="MBAttendance-filter-div" >
//                         <div className="MBAttendance-filter-div-child-1"   >
//                             <Form.Group controlId="date">
//                                 <label>Date</label>
//                                 <Form.Control
//                                     type="date"
//                                     name="date"
//                                     value={date}
//                                     onChange={(e) => setDate(e.target.value)}
//                                 />
//                             </Form.Group>
//                         </div>

//                         <div>
//                             <SchoolDropDowns />
//                         </div>
//                     </div>
//                 </div>

//                 <Row>
//                     <Col>
//                         <ClassOfStudent />
//                     </Col>
//                 </Row>
//             </Form>

//             <hr />

//             <h1>Student Attendance</h1>

//             {/* Classwise Count Display */}
//             {studentCount?.length > 0 && (
//                 <div className="mb-3">
//                     {["9", "10"].map((classNum) => {
//                         const classData = studentCount[0]?.classes?.find(
//                             (cls) => cls.classofStudent === classNum
//                         );
//                         return (
//                             classData && (
//                                 <p key={classNum}>
//                                     <strong>Class {classNum}:</strong> Total: {classData.totalStudents}, Present: {classData.present}, Absent: {classData.absent}
//                                 </p>
//                             )
//                         );
//                     })}
//                 </div>
//             )}

//             {error && <Alert variant="danger">{error}</Alert>}
//             <Row>
//                 <Table
//                     bordered
//                     hover
//                     responsive
//                     className="mt-4 text-center align-middle"
//                 >
//                     <thead>
//                         <tr>
//                             <th>#</th>
//                             <th>SRN</th>
//                             <th>Student</th>
//                             <th>Attendance</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {attendanceData.length > 0 ? (
//                             attendanceData.map((attendance, index) => (
//                                 <tr key={attendance._id}>
//                                     <td>{index+1}</td>
//                                     <td>{attendance.studentSrn}</td>
//                                     <td>{attendance.studentDetails.firstName}</td>
//                                     <td>
//                                         <div className="toggle-container">
//                                             <div
//                                                 className={`toggle-button ${
//                                                     attendanceState[attendance.studentSrn] ? "on" : "off"
//                                                 }`}
//                                                 onClick={() =>
//                                                     handleAttendanceUpdate(
//                                                         attendance.studentSrn,
//                                                         attendanceState[attendance.studentSrn]
//                                                     )
//                                                 }
//                                             >
//                                                 <div
//                                                     className={`circle ${
//                                                         attendanceState[attendance.studentSrn]
//                                                         ? "move-right"
//                                                         : "move-left"
//                                                     }`}
//                                                 ></div>
//                                                 <span
//                                                     className={`toggle-text ${
//                                                         attendanceState[attendance.studentSrn]
//                                                         ? "on-text"
//                                                         : "off-text"
//                                                     }`}
//                                                 >
//                                                     {attendanceState[attendance.studentSrn]
//                                                         ? "Present"
//                                                         : "Absent"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="9">No attendance records found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </Table>
//             </Row>
//         </Container>
//     );
// };

// export default AttendanceMB;

















// //New attendance MB code with excel execution

// // This is AttendanceSession1.jsx.

// // This component marks the attendance of class 8th for MB

// // importing packages.
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Button } from 'react-bootstrap';

// import { getAllAttendance, updateAttendanceBySrnAndDate } from "../../service/AttendanceMB.services.js";
// import { DistrictBlockSchoolById, ClassOfStudent  } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";

// //importing context api (District Block School Context API)
// import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../contextAPIs/DependentDropdowns.contextAPI";
// import { UserContext } from "../contextAPIs/User.context.js";
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

// import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services.js";
// import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"
// import { utils, writeFile } from 'xlsx';

// const AttendanceMB = ({assignedDistricts, assignedBlocks, assignedSchools}) => {

//     //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
//     const {userData, setUserData} = useContext(UserContext)
//     const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
//     const {blockContext, setBlockContext } = useContext(BlockContext); // Use context
//     const {schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context
//     //______________________________________________________________________________________________

//     //ClassContext API
//     const {classContext, setClassContext} = useContext(ClassContext);

//     //_____________________________________________________

//     const [attendanceData, setAttendanceData] = useState([]);
//     const [error, setError] = useState(null);

//     //Hooks for managing query params for fetching attendance data.
//     const [studentSrn, setStudentSrn] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [fatherName, setFatherName] = useState("");
//     const [date, setDate] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [classofStudent, setClassOfStudent] = useState("");
//     const [batch, setBatch] = useState("");
//     const [status, setStatus] = useState("");

//     const [studentCount, setStudentCount] = useState([]);

//     // Track attendance state individually for each student using an object.
//     const [attendanceState, setAttendanceState] = useState({});

//     //Student Related Counts
//     const fetchStudentRelatedCounts = async () => {
//         const payload = {
//             schoolIds: userData[0].schoolIds,
//             classFilters: userData[0].classId,
//             date: new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00", // same format
//         };

//         try {
//             const response = await studentAndAttendanceAndAbsenteeCallingCount(
//                 payload
//             );
//             console.log(response.data);
//             setStudentCount(response.data);
//         } catch (error) {
//             console.log("Error fetching student count");
//         }
//     };

//     useEffect(() => {
//         fetchStudentRelatedCounts();
//     }, []);

//     //Below useEffect handles date thing
//     useEffect(()=>{
//         setDate(new Date().toISOString().split("T")[0])
//     }, [])

//     // Define query parameters for loading data on frontend
//     const queryParams = {
//         studentSrn:"",
//         firstName:"",
//         fatherName:"",
//         date: date,
//         startDate: date,
//         endDate: endDate || "",
//         schoolId:Object(schoolContext[0]).value || userData[0].assignedSchools,
//         classofStudent:classContext.value || ['9', '10'],
//         batch:"",
//         status:['Absent', 'Present'],
//     };
//     console.log(Object(districtContext[0]).value)

//     const fetchAttendance = async () => {
//         console.log(userData[0].assignedDistricts)
//         console.log(date)
//         console.log(queryParams)

//         if (true) {
//             try {
//                 const response = await getAllAttendance(queryParams);
//                 setAttendanceData(response.data); 
//                 console.log("I am inside attendance mb")
//                 console.log(response.data)

//                 const initialAttendanceState = {};
//                 response.data.forEach((attendance) => {
//                     initialAttendanceState[attendance.studentSrn] = attendance.isAttendanceMarked;
//                 });
//                 setAttendanceState(initialAttendanceState);
//             } catch (error) {
//                 console.log("Error fetching attendance data");
//                 setAttendanceData([])
//             }
//         } else (console.log("Please select all filters"))
//     };

//     useEffect(() => {
//         fetchAttendance();
//     }, [districtContext, blockContext, schoolContext, date, endDate, classContext]);

//     useEffect(()=> {
//         setBlockContext([])
//         setSchoolContext([])
//         setSchoolContext({})
//         setAttendanceData([])
//     }, [districtContext])

//     useEffect(()=> {
//         setAttendanceData([])
//     }, [ classContext])

//     useEffect(()=> {
//         setSchoolContext([])
//     }, [blockContext])

//     // Function to handle attendance update (marking attendance)
//     const handleAttendanceUpdate = async (studentSrn, isMarked) => {
//         const queryParamsForAttendance = {
//             studentSrn: studentSrn,
//             date: date, 
//         };

//         console.log(isMarked)
//         console.log(`Student SRN: ${studentSrn}, Currently Marked: ${isMarked ? 'Present' : 'Absent'}`);

//         if(isMarked === true) {
//             console.log('marked absent')

//             const isAttendanceMarked = {isAttendanceMarked: false}

//             try {
//                 setAttendanceState((prevState) => ({
//                     ...prevState,
//                     [studentSrn]: !isMarked,
//                 }));

//                 const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked);
//                 fetchStudentRelatedCounts(); // ✅ refresh counts after update

//             } catch (error) {
//                 console.error("Error updating attendance", error.message);
//             }

//         } else {
//             console.log('marked present')

//             const isAttendanceMarked = {isAttendanceMarked: true}

//             try {
//                 setAttendanceState((prevState) => ({
//                     ...prevState,
//                     [studentSrn]: !isMarked,
//                 }));

//                 const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked);
//                 fetchStudentRelatedCounts(); // ✅ refresh counts after update

//             } catch (error) {
//                 console.error("Error updating attendance", error.message);
//             }
//         }
//     };

//     attendanceData.sort((a, b)=>a.studentDetails.firstName.localeCompare(b.studentDetails.firstName))

//     const handleDownloadCsv = () => {
//         const dataToExport = attendanceData.map((record, index) => {
//             const schoolMeta = DistrictBlockSchool.find(s => s.schoolId === record.studentDetails.schoolId);
//             return {
//                 "S.NO": index + 1,
//                 "SRN": record.studentSrn,
//                 "Name": record.studentDetails.firstName,
//                 "Father": record.studentDetails.fatherName,
//                 "District": schoolMeta?.districtName || record.studentDetails.districtId,
//                 "Block": schoolMeta?.blockName || record.studentDetails.blockId,
//                 "Center": schoolMeta?.schoolName || record.studentDetails.schoolId,
//                 "Attendance": record.status
//             }
//         });

//         const worksheet = utils.json_to_sheet(dataToExport);
//         const workbook = utils.book_new();
//         utils.book_append_sheet(workbook, worksheet, "Attendance");
//         writeFile(workbook, `Attendance_${date}.xlsx`);
//     }

//     return (
//         <Container fluid className="prevent-overflow">
//             <Form>
//                 <div >
//                     <div className="MBAttendance-filter-div" >
//                         <div className="MBAttendance-filter-div-child-1"   >
//                             <Form.Group controlId="date">
//                                 <label>Date</label>
//                                 <Form.Control
//                                     type="date"
//                                     name="date"
//                                     value={date}
//                                     onChange={(e) => setDate(e.target.value)}
//                                 />
//                             </Form.Group>
//                         </div>

//                         <div>
//                             <SchoolDropDowns />
//                         </div>
//                     </div>
//                 </div>

//                 <Row>
//                     <Col>
//                         <ClassOfStudent />
//                     </Col>
//                 </Row>
//             </Form>

//             <hr />

//             <h1>Student Attendance</h1>

//             <Button variant="success" className="mb-3" onClick={handleDownloadCsv}>
//                 Download CSV
//             </Button>

//             {/* Classwise Count Display */}
//             {studentCount?.length > 0 && (
//                 <div className="mb-3">
//                     {["9", "10"].map((classNum) => {
//                         const classData = studentCount[0]?.classes?.find(
//                             (cls) => cls.classofStudent === classNum
//                         );
//                         return (
//                             classData && (
//                                 <p key={classNum}>
//                                     <strong>Class {classNum}:</strong> Total: {classData.totalStudents}, Present: {classData.present}, Absent: {classData.absent}
//                                 </p>
//                             )
//                         );
//                     })}
//                 </div>
//             )}

//             {error && <Alert variant="danger">{error}</Alert>}
//             <Row>
//                 <Table
//                     bordered
//                     hover
//                     responsive
//                     className="mt-4 text-center align-middle"
//                 >
//                     <thead>
//                         <tr>
//                             <th>#</th>
//                             <th>SRN</th>
//                             <th>Student</th>
//                             <th>Attendance</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {attendanceData.length > 0 ? (
//                             attendanceData.map((attendance, index) => (
//                                 <tr key={attendance._id}>
//                                     <td>{index+1}</td>
//                                     <td>{attendance.studentSrn}</td>
//                                     <td>{attendance.studentDetails.firstName}</td>
//                                     <td>
//                                         <div className="toggle-container">
//                                             <div
//                                                 className={`toggle-button ${
//                                                     attendanceState[attendance.studentSrn] ? "on" : "off"
//                                                 }`}
//                                                 onClick={() =>
//                                                     handleAttendanceUpdate(
//                                                         attendance.studentSrn,
//                                                         attendanceState[attendance.studentSrn]
//                                                     )
//                                                 }
//                                             >
//                                                 <div
//                                                     className={`circle ${
//                                                         attendanceState[attendance.studentSrn]
//                                                         ? "move-right"
//                                                         : "move-left"
//                                                     }`}
//                                                 ></div>
//                                                 <span
//                                                     className={`toggle-text ${
//                                                         attendanceState[attendance.studentSrn]
//                                                         ? "on-text"
//                                                         : "off-text"
//                                                     }`}
//                                                 >
//                                                     {attendanceState[attendance.studentSrn]
//                                                         ? "Present"
//                                                         : "Absent"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="9">No attendance records found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </Table>
//             </Row>
//         </Container>
//     );
// };

// export default AttendanceMB;

















//New attendance MB code with excel execution

// This is AttendanceSession1.jsx.

// This component marks the attendance of class 8th for MB

// importing packages.
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Button } from 'react-bootstrap';

import { getAllAttendance, updateAttendanceBySrnAndDate } from "../../service/AttendanceMB.services.js";
import { DistrictBlockSchoolById, ClassOfStudent  } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";

//importing context api (District Block School Context API)
import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../contextAPIs/DependentDropdowns.contextAPI";
import { UserContext } from "../contextAPIs/User.context.js";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

import { studentAndAttendanceAndAbsenteeCallingCount } from "../../service/dashboardServices/dashboardCounts.services.js";
import DistrictBlockSchool from "../CentersOrSchools/DistrictBlockSchool.json"
import { utils, writeFile } from 'xlsx';
import jsPDF from "jspdf";
import "jspdf-autotable";

const AttendanceMB = ({assignedDistricts, assignedBlocks, assignedSchools}) => {

    //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
    const {userData, setUserData} = useContext(UserContext)
    const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
    const {blockContext, setBlockContext } = useContext(BlockContext); // Use context
    const {schoolContext, setSchoolContext } = useContext(SchoolContext); // Use context
    //______________________________________________________________________________________________

    //ClassContext API
    const {classContext, setClassContext} = useContext(ClassContext);

    //_____________________________________________________

    const [attendanceData, setAttendanceData] = useState([]);
    const [error, setError] = useState(null);

    //Hooks for managing query params for fetching attendance data.
    const [studentSrn, setStudentSrn] = useState("");
    const [firstName, setFirstName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [date, setDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [classofStudent, setClassOfStudent] = useState("");
    const [batch, setBatch] = useState("");
    const [status, setStatus] = useState("");

    const [studentCount, setStudentCount] = useState([]);

    // Track attendance state individually for each student using an object.
    const [attendanceState, setAttendanceState] = useState({});

    
//   const [startDate, setStartDate] = useState(() => {
//       return new Date().toISOString().split("T")[0];
//     });
//     const [endDate, setEndDate] = useState(() => {
//       return new Date().toISOString().split("T")[0];
//     });


    //Student Related Counts

          
    const fetchStudentRelatedCounts = async () => {
        

    // let date = new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00"
       

    const payload = {
        schoolIds: userData[0].schoolIds,
        classFilters: userData[0].classId,
           
        startDate: date || new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00",
        endDate: date || new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00"
            
        };

        try {
            const response = await studentAndAttendanceAndAbsenteeCallingCount(
                payload
            );
            console.log(response.data);
            setStudentCount(response.data);
        } catch (error) {
            console.log("Error fetching student count");
        }
    };

    useEffect(() => {
        fetchStudentRelatedCounts();
    }, [date]);

    //Below useEffect handles date thing
    useEffect(()=>{
        setDate(new Date().toISOString().split("T")[0])
    }, [])

    // Define query parameters for loading data on frontend
    const queryParams = {
        studentSrn:"",
        firstName:"",
        fatherName:"",
        date: date,
        startDate: date,
        endDate: endDate || "",
        schoolId:Object(schoolContext[0]).value || userData[0].assignedSchools,
        classofStudent:classContext.value || ['9', '10'],
        batch:"",
        status:['Absent', 'Present'],
    };
    console.log(Object(districtContext[0]).value)

    const fetchAttendance = async () => {
        console.log(userData[0].assignedDistricts)
        console.log(date)
        console.log(queryParams)

        if (true) {
            try {
                const response = await getAllAttendance(queryParams);
                setAttendanceData(response.data); 
                console.log("I am inside attendance mb")
                console.log(response.data)

                const initialAttendanceState = {};
                response.data.forEach((attendance) => {
                    initialAttendanceState[attendance.studentSrn] = attendance.isAttendanceMarked;
                });
                setAttendanceState(initialAttendanceState);
            } catch (error) {
                console.log("Error fetching attendance data");
                setAttendanceData([])
            }
        } else (console.log("Please select all filters"))
    };

    useEffect(() => {
        fetchAttendance();
    }, [districtContext, blockContext, schoolContext, date, endDate, classContext]);

    useEffect(()=> {
        setBlockContext([])
        setSchoolContext([])
        setSchoolContext({})
        setAttendanceData([])
    }, [districtContext])

    useEffect(()=> {
        setAttendanceData([])
    }, [ classContext])

    useEffect(()=> {
        setSchoolContext([])
    }, [blockContext])

    // Function to handle attendance update (marking attendance)
    const handleAttendanceUpdate = async (studentSrn, isMarked) => {
        const queryParamsForAttendance = {
            studentSrn: studentSrn,
            date: date, 
        };

        console.log(isMarked)
        console.log(`Student SRN: ${studentSrn}, Currently Marked: ${isMarked ? 'Present' : 'Absent'}`);

        if(isMarked === true) {
            console.log('marked absent')

            const isAttendanceMarked = {isAttendanceMarked: false}

            try {
                setAttendanceState((prevState) => ({
                    ...prevState,
                    [studentSrn]: !isMarked,
                }));

                const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked);
                fetchStudentRelatedCounts(); // ✅ refresh counts after update

            } catch (error) {
                console.error("Error updating attendance", error.message);
            }

        } else {
            console.log('marked present')

            const isAttendanceMarked = {isAttendanceMarked: true}

            try {
                setAttendanceState((prevState) => ({
                    ...prevState,
                    [studentSrn]: !isMarked,
                }));

                const response = await updateAttendanceBySrnAndDate(queryParamsForAttendance, isAttendanceMarked);
                fetchStudentRelatedCounts(); // ✅ refresh counts after update

            } catch (error) {
                console.error("Error updating attendance", error.message);
            }
        }
    };

    attendanceData.sort((a, b)=>a.studentDetails.firstName.localeCompare(b.studentDetails.firstName))

    const handleDownloadCsv = () => {
        const dataToExport = attendanceData.map((record, index) => {
            const schoolMeta = DistrictBlockSchool.find(s => s.schoolId === record.studentDetails.schoolId);
            return {
                "S.NO": index + 1,
                "SRN": record.studentSrn,
                "Name": record.studentDetails.firstName,
                "Father": record.studentDetails.fatherName,
                "District": schoolMeta?.districtName || record.studentDetails.districtId,
                "Block": schoolMeta?.blockName || record.studentDetails.blockId,
                "Center": schoolMeta?.schoolName || record.studentDetails.schoolId,
                "Attendance": record.status
            }
        });

        const worksheet = utils.json_to_sheet(dataToExport);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Attendance");
        writeFile(workbook, `Attendance_${date}.xlsx`);
    }

    const handleDownloadPdf = () => {


    const doc = new jsPDF();



    const title = `Attendance_Class_${classContext.value || 'All'}_${date}`;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFillColor(255, 229, 180);
    doc.rect(10, 10, 190, 10, 'F');
    doc.text(title, 105, 17, { align: 'center' });


    // Sort attendanceData by School Name, then District Name.

    const sortedData = [...attendanceData].sort((a, b) => {
    const schoolA = DistrictBlockSchool.find(s => s.schoolId === a.studentDetails.schoolId)?.schoolName || a.studentDetails.schoolId;
    const schoolB = DistrictBlockSchool.find(s => s.schoolId === b.studentDetails.schoolId)?.schoolName || b.studentDetails.schoolId;
    const districtA = DistrictBlockSchool.find(s => s.schoolId === a.studentDetails.schoolId)?.districtName || a.studentDetails.districtId;
    const districtB = DistrictBlockSchool.find(s => s.schoolId === b.studentDetails.schoolId)?.districtName || b.studentDetails.districtId;

    if (districtA !== districtB) return districtA.localeCompare(districtB);
    return schoolA.localeCompare(schoolB);
});
    const dataToExport = sortedData.map((record, index) => {
        const schoolMeta = DistrictBlockSchool.find(s => s.schoolId === record.studentDetails.schoolId);
        return [
            index + 1,
            record.studentSrn,
            record.studentDetails.firstName,
            record.studentDetails.fatherName,
            schoolMeta?.districtName || record.studentDetails.districtId,
            schoolMeta?.blockName || record.studentDetails.blockId,
            schoolMeta?.schoolName || record.studentDetails.schoolId,
            record.status
        ];
    });

    doc.autoTable({
        head: [["S.No", "SRN", "Name", "Father Name", "District Name", "Block Name", "School Name", "Attendance"]],
        body: dataToExport,
        startY: 25,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [173, 216, 230] },
    });

    doc.save(`${title}.pdf`);
}


    const showButtons = ["admin", "Project Coordinator", "Community Incharge", "Community Manager"].includes(userData[0]?.role);

    return (
        <Container fluid className="prevent-overflow">
            <Form>
                <div >
                    <div className="MBAttendance-filter-div" >
                        <div className="MBAttendance-filter-div-child-1"   >
                            <Form.Group controlId="date">
                                <label>Date</label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </Form.Group>
                        </div>

                        <div>
                            <SchoolDropDowns />
                        </div>
                    </div>
                </div>

                <Row>
                    <Col>
                        <ClassOfStudent />
                    </Col>
                </Row>
            </Form>

            <hr />

            <h1>Student Attendance</h1>

            {showButtons && (
                <>
                    <Button variant="success" className="mb-3 me-2" onClick={handleDownloadCsv}>
                        Download CSV
                    </Button>
                    <Button variant="primary" className="mb-3" onClick={handleDownloadPdf}>
                        Download PDF
                    </Button>
                </>
            )}

            {/* Classwise Count Display */}
            {studentCount?.length > 0 && (
                <div className="mb-3">
                    {["9", "10"].map((classNum) => {
                        const classData = studentCount[0]?.classes?.find(
                            (cls) => cls.classofStudent === classNum
                        );
                        return (
                            classData && (
                                <p key={classNum}>
                                    <strong>Class {classNum}:</strong> Total: {classData.totalStudents}, Present: {classData.present}, Absent: {classData.absent}
                                </p>
                            )
                        );
                    })}
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                <Table
                    bordered
                    hover
                    responsive
                    className="mt-4 text-center align-middle"
                >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>SRN</th>
                            <th>Student</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.length > 0 ? (
                            attendanceData.map((attendance, index) => (
                                <tr key={attendance._id}>
                                    <td>{index+1}</td>
                                    <td>{attendance.studentSrn}</td>
                                    <td>{attendance.studentDetails.firstName}</td>
                                    <td>
                                        <div className="toggle-container">
                                            <div
                                                className={`toggle-button ${
                                                    attendanceState[attendance.studentSrn] ? "on" : "off"
                                                }`}
                                                onClick={() =>
                                                    handleAttendanceUpdate(
                                                        attendance.studentSrn,
                                                        attendanceState[attendance.studentSrn]
                                                    )
                                                }
                                            >
                                                <div
                                                    className={`circle ${
                                                        attendanceState[attendance.studentSrn]
                                                        ? "move-right"
                                                        : "move-left"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={`toggle-text ${
                                                        attendanceState[attendance.studentSrn]
                                                        ? "on-text"
                                                        : "off-text"
                                                    }`}
                                                >
                                                    {attendanceState[attendance.studentSrn]
                                                        ? "Present"
                                                        : "Absent"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No attendance records found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
};

export default AttendanceMB;
