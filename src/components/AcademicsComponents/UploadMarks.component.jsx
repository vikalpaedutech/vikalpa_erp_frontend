// import React, { useState, useEffect, useContext } from "react";
// import { Container, Row, Col, Table, Form } from "react-bootstrap";
// import {
//   getAllMarksUsinQueryParams,
//   updateMarksBySrnAndExamId,
// } from "../../service/Marks.services.js";

// import {
//   DistrictBlockSchoolById,
//   ClassOfStudent,
// } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";
// //importing context api (District Block School Context API)
// import {
//   DistrictBlockSchoolContext,
//   BlockContext,
//   SchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";

// import { UserContext } from "../../components/contextAPIs/User.context.js";
// import Select from "react-select"
// import { GetTests } from '../../service/ExamAndTestController';
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

// import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";
// import { studentMarksGamification } from "../../service/Gamification.services.js";
// import { uploadMarks } from "../../service/ErpTest.services.js";

// //ERP Test route back 
// import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";


// export const UploadMarks = () => {
//   //using userContext
//   const { userData, setUserData } = useContext(UserContext);
//   //___________________________________________________

  
//       //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
      
//        const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
//        const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
//        const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
//     //______________________________________________________________________________________________

//     //using ClassContext api

//     const {classContext, setClassContext} = useContext(ClassContext)

//     //______________________________________________________
  
  
// const [firstName, setFirstName] = useState('')
//   const [marksData, setMarksData] = useState([]);



// //Fetchin examId data
// const [getTest, setGetTest] =useState([])
// const [examId, setExamId] = useState("")
 
//  const fetchTest = async () =>{

//   let reqBody;

//   if(  Array.isArray(userData?.userAccess?.classId) &&
//   userData.userAccess.classId.length === 2 &&
//   ["9", "10"].every(id => userData.userAccess.classId.includes(id))){
//     reqBody = {
//      classofStudent: classContext.value || ['9', '10']
//     }
//   } else {
//      reqBody = {
//      classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10']
//     }
//   }
// console.log(reqBody)
//         try {
//             const response = await GetTests(reqBody);
//             console.log(response.data.data);
//             setGetTest(response.data.data)

            
//         } catch (error) {
//             console.log("Error fetching test data", error.message)
//         }
//     }

//     useEffect(()=> {
//         fetchTest()

//     }, [classContext.value])

// //--------------------------------------
// const regions = userData?.userAccess?.region || [];
// const allSchoolIds = regions.flatMap(region =>
//   region.blockIds.flatMap(block =>
//     block.schoolIds.map(school => school.schoolId)
//   )
// );

// const allDistrictIds = regions.flatMap(region => 
//   region.districtId
// )

// console.log(allDistrictIds)

// //--------------------------------------------




//   //Below query params filters the data and show it on frontend from backend
//   const queryParams = {
//     studentSrn: "",
//     firstName: firstName,
//     fatherName: "",
//     // districtId: Object(districtContext[0]).value || "",
//     // blockId: Object(blockContext[0]).value || "",
//     schoolId: Object(schoolContext[0]).value || allSchoolIds,
//     classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10'],
//     examId: examId.value || "",
//     marksObtained: "",
//     recordedBy: "",
//     remark: "",
//     marksUpdatedOn: "",
//   };
// useEffect(() => {
//   const fetchMarksData = async () => {
  
 
//       console.log(getTest)


//         console.log("i am class of student ", classContext.value)
//         try {
//             const response = await getAllMarksUsinQueryParams(queryParams);
//             setMarksData(response.data);
//             console.log(response.data);
//           } catch (error) {
//             console.log("Error fetching marks data", error.message);
//             setMarksData([])
//           }
   
   
//   };

  
   
//     fetchMarksData();
//   }, [districtContext, blockContext, schoolContext, classContext, examId, firstName]);

//   //Clearing drop down values if user selects different value.

//   useEffect(() => {
//     setBlockContext([]);
//     setSchoolContext([])
//     setClassContext("")
//     setMarksData([])
    
//   }, [districtContext, ])

//   const handleMarksChange = async (e, student) => {
//     console.log(student)
//     const inputValue = e.target.value;
//     const cleanedInput = inputValue.trim();
//     const schoolId = student.schoolId;
//     const classofStudent = student.classofStudent;

//     // Allow only valid inputs
//     const isAbsent = /^absent$/i.test(cleanedInput);
//     const isA = /^a$/i.test(cleanedInput);
//     const isValidNumber = /^(\d{1,3})(\.\d{1,2})?$/.test(cleanedInput);

//     if (!isAbsent && !isA && !isValidNumber && cleanedInput !== "") {
//       // Invalid input: ignore
//       return;
//     }

//     // Avoid unnecessary updates
//     if (student.marksObtained?.toString() === cleanedInput) {
//       return;
//     }

//     try {
//       const payload = {
//         studentSrn: student.studentSrn,
//         examId: student.examId,
//         schoolId: schoolId,
//         userId: userData?.userId,
//         classofStudent: classofStudent,
//         marksObtained: cleanedInput,
//         recordedBy: userData?.[0]?.userId ?? "Admin", // or dynamically from user
//         marksUpdatedOn: new Date().toISOString(),
//       };

//       await updateMarksBySrnAndExamId({}, payload);

//       //Gamification marks

//       if (userData.role === "CC" || userData.role === "Admin"){
//          const gamificationReqBody = {
//         unqUserObjectId:userData?._id,
//         schoolId:schoolId,
//         classOfCenter:classofStudent,
//         userId: userData?.userId,
//         examId: student.examId,
//       }

//       const marksGamificationResponse = await studentMarksGamification(gamificationReqBody)

//       }
     
//       //ERP Test

//       if (userData.role === "hkrn"){

//         const erpTestReqBody = {
//           unqUserObjectId:userData?._id,
//         schoolId:schoolId,
//         classOfCenter:classofStudent,
//         userId: userData?.userId,
//         examId: student.examId,
//         }

//         const erpTestResponse = await uploadMarks (erpTestReqBody)


        
//       //function for routing back to test page after succesfully completting the task
        
//        ErpTestPageRouteBack(userData, {keyStatus: 'Marks'})

//       }


//       // Update local state for immediate UI feedback
//       setMarksData((prevData) =>
//         prevData.map((item) =>
//           item._id === student._id
//             ? { ...item, marksObtained: cleanedInput }
//             : item
//         )
//       );
//     } catch (error) {
//       console.error("Error updating marks:", error.message);
//     }
//   };

//   //Passing props to DistrictBlockSchoolById component for filtering for logged in users.
//   const assignedDistricts = allDistrictIds;
//   console.log("i am user distrit", assignedDistricts);

//   //____________________________________________________________________________


//   //Sorting the marks data  
// marksData.sort((a, b)=>a.firstName.localeCompare(b.firstName))

//   return (
//     <Row className="justify-content-center">
//       <Col xs={12}>
//         <Container fluid className="prevent-overflow">
//           {/* <h1>Apply Filter</h1> */}

//           {/* <DistrictBlockSchoolById assignedDistricts={assignedDistricts} /> */}
//           <SchoolDropdown />

//           <Form>
//             <Form.Group
//               className="mb-3"
//               controlId="exampleForm.ControlTextarea1"
//             >
//               <Form.Label>Test Id</Form.Label>
//               <Select
//                 options={
//                   getTest.length > 0
//                     ? getTest.map((eachTest) => {
//                         return {
//                           value: eachTest.examId,
//                           label: eachTest.examId,
//                         };
//                       })
//                     : null
//                 }
//                 value={examId}
//                 onChange={setExamId}
//               />
//             </Form.Group>
//           </Form>

//           <ClassOfStudent />

//           <Form>
//             <Form.Group
//               as={Row}
//               className="mb-3"
//               controlId="formPlaintextPassword"
//             >
//               <Form.Label column sm="2">
//                 Filter Student Name
//               </Form.Label>
//               <Col sm="10">
//                 <Form.Control
//                   type="text"
//                   placeholder="text"
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />
//               </Col>
//             </Form.Group>
//           </Form>

//           <hr></hr>
//           <h2>Upload Marks</h2>

//           {marksData.length > 0 ? (
//             <Table responsive bordered cellPadding="10" cellSpacing="0">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>SRN</th>
//                   {/*               
//               <th>Father's Name</th> */}
//                   <th>Name</th>
//                   {/* <th>District ID</th>
//               <th>Block ID</th>
//               <th>School ID</th> */}
//                   {/* <th>Class</th> */}
//                   {/* <th>Exam ID</th> */}
//                   {/* <th>Marks Obtained</th> */}
//                   {/* <th>Recorded By</th> */}
//                   {/* <th>Remark</th> */}
//                   {/* <th>Marks Updated On</th> */}
//                   <th>Marks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {marksData.map((student, index) => (
//                   <tr key={student._id}>
//                     <td>{index + 1}</td>
//                     <td>{student.studentSrn}</td>

//                     {/* <td>{student.fatherName}</td> */}
//                     <td>{student.firstName}</td>
//                     {/* <td>{student.districtId}</td>
//                 <td>{student.blockId}</td>
//                 <td>{student.schoolId}</td> */}
//                     {/* <td>{student.classofStudent}</td>
//                 <td>{student.examId}</td>
//                 <td>{student.marksObtained ?? "N/A"}</td>
//                 <td>{student.recordedBy || "N/A"}</td>
//                 <td>{student.remark || "N/A"}</td> */}
//                     {/* <td>
//                   {student.marksUpdatedOn
//                     ? new Date(student.marksUpdatedOn).toLocaleString()
//                     : "N/A"}
//                 </td> */}
//                     <td>
//                       <input
//                       style={{width:'4rem'}}
//                         type="text"
//                         placeholder=""
//                         defaultValue={student.marksObtained ?? ""}
//                         onChange={(e) => handleMarksChange(e, student)}
//                         disabled={!examId?.value} // <<< DISABLES INPUT IF TEST ID NOT SELECTED
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>Please filter your data and start updating marks.</p>
//           )}
//         </Container>
//       </Col>
//     </Row>
//   );
// };








// import React, { useState, useEffect, useContext, useRef } from "react";
// import { Container, Row, Col, Table, Form, Button, ProgressBar, Alert } from "react-bootstrap";
// import {
//   getAllMarksUsinQueryParams,
//   updateMarksBySrnAndExamId,
//   uploadTestFileService,
// } from "../../service/Marks.services.js";

// import {
//   DistrictBlockSchoolById,
//   ClassOfStudent,
// } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";
// //importing context api (District Block School Context API)
// import {
//   DistrictBlockSchoolContext,
//   BlockContext,
//   SchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";

// import { UserContext } from "../../components/contextAPIs/User.context.js";
// import Select from "react-select"
// import { GetTests } from '../../service/ExamAndTestController';
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

// import { DistrictDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";
// import { studentMarksGamification } from "../../service/Gamification.services.js";
// import { uploadMarks } from "../../service/ErpTest.services.js";

// //ERP Test route back 
// import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";


// export const UploadMarks = () => {
//   //using userContext
//   const { userData, setUserData } = useContext(UserContext);
//   //___________________________________________________

  
//       //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
      
//        const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
//        const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
//        const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
//     //______________________________________________________________________________________________

//     //using ClassContext api

//     const {classContext, setClassContext} = useContext(ClassContext)

//     //______________________________________________________
  
  
// const [firstName, setFirstName] = useState('')
//   const [marksData, setMarksData] = useState([]);
//   const [uploadingFiles, setUploadingFiles] = useState({});
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [uploadErrors, setUploadErrors] = useState({});
//   const fileInputRefs = useRef({});



// //Fetchin examId data
// const [getTest, setGetTest] =useState([])
// const [examId, setExamId] = useState("")
 
//  const fetchTest = async () =>{

//   let reqBody;

//   if(  Array.isArray(userData?.userAccess?.classId) &&
//   userData.userAccess.classId.length === 2 &&
//   ["9", "10"].every(id => userData.userAccess.classId.includes(id))){
//     reqBody = {
//      classofStudent: classContext.value || ['9', '10']
//     }
//   } else {
//      reqBody = {
//      classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10']
//     }
//   }
// console.log(reqBody)
//         try {
//             const response = await GetTests(reqBody);
//             console.log(response.data.data);
//             setGetTest(response.data.data)

            
//         } catch (error) {
//             console.log("Error fetching test data", error.message)
//         }
//     }

//     useEffect(()=> {
//         fetchTest()

//     }, [classContext.value])

// //--------------------------------------
// const regions = userData?.userAccess?.region || [];
// const allSchoolIds = regions.flatMap(region =>
//   region.blockIds.flatMap(block =>
//     block.schoolIds.map(school => school.schoolId)
//   )
// );

// const allDistrictIds = regions.flatMap(region => 
//   region.districtId
// )

// console.log(allDistrictIds)

// //--------------------------------------------




//   //Below query params filters the data and show it on frontend from backend
//   const queryParams = {
//     studentSrn: "",
//     firstName: firstName,
//     fatherName: "",
//     // districtId: Object(districtContext[0]).value || "",
//     // blockId: Object(blockContext[0]).value || "",
//     schoolId: Object(schoolContext[0])?.value || allSchoolIds,
//     classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10'],
//     examId: examId.value || "",
//     marksObtained: "",
//     recordedBy: "",
//     remark: "",
//     marksUpdatedOn: "",
//   };
// useEffect(() => {
//   const fetchMarksData = async () => {
  
 
//       console.log(getTest)


//         console.log("i am class of student ", classContext.value)
//         try {
//             const response = await getAllMarksUsinQueryParams(queryParams);
//             setMarksData(response.data);
//             console.log(response.data);
//           } catch (error) {
//             console.log("Error fetching marks data", error.message);
//             setMarksData([])
//           }
   
   
//   };

  
   
//     fetchMarksData();
//   }, [districtContext, blockContext, schoolContext, classContext, examId, firstName]);

//   //Clearing drop down values if user selects different value.

//   useEffect(() => {
//     setBlockContext([]);
//     setSchoolContext([])
//     setClassContext("")
//     setMarksData([])
    
//   }, [districtContext, ])

//   const handleMarksChange = async (e, student) => {
//     console.log(student)
//     const inputValue = e.target.value;
//     const cleanedInput = inputValue.trim();
//     const schoolId = student.schoolId;
//     const classofStudent = student.classofStudent;

//     // Allow only valid inputs
//     const isAbsent = /^absent$/i.test(cleanedInput);
//     const isA = /^a$/i.test(cleanedInput);
//     const isValidNumber = /^(\d{1,3})(\.\d{1,2})?$/.test(cleanedInput);

//     if (!isAbsent && !isA && !isValidNumber && cleanedInput !== "") {
//       // Invalid input: ignore
//       return;
//     }

//     // Avoid unnecessary updates
//     if (student.marksObtained?.toString() === cleanedInput) {
//       return;
//     }

//     try {
//       const payload = {
//         studentSrn: student.studentSrn,
//         examId: student.examId,
//         schoolId: schoolId,
//         userId: userData?.userId,
//         classofStudent: classofStudent,
//         marksObtained: cleanedInput,
//         recordedBy: userData?.[0]?.userId ?? "Admin", // or dynamically from user
//         marksUpdatedOn: new Date().toISOString(),
//       };

//       await updateMarksBySrnAndExamId({}, payload);

//       //Gamification marks

//       if (userData.role === "CC" || userData.role === "Admin"){
//          const gamificationReqBody = {
//         unqUserObjectId:userData?._id,
//         schoolId:schoolId,
//         classOfCenter:classofStudent,
//         userId: userData?.userId,
//         examId: student.examId,
//       }

//       const marksGamificationResponse = await studentMarksGamification(gamificationReqBody)

//       }
     
//       //ERP Test

//       if (userData.role === "hkrn"){

//         const erpTestReqBody = {
//           unqUserObjectId:userData?._id,
//         schoolId:schoolId,
//         classOfCenter:classofStudent,
//         userId: userData?.userId,
//         examId: student.examId,
//         }

//         const erpTestResponse = await uploadMarks (erpTestReqBody)


        
//       //function for routing back to test page after succesfully completting the task
        
//        ErpTestPageRouteBack(userData, {keyStatus: 'Marks'})

//       }


//       // Update local state for immediate UI feedback
//       setMarksData((prevData) =>
//         prevData.map((item) =>
//           item._id === student._id
//             ? { ...item, marksObtained: cleanedInput }
//             : item
//         )
//       );
//     } catch (error) {
//       console.error("Error updating marks:", error.message);
//     }
//   };

//   const handleFileUpload = async (e, student) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file size (10MB max)
//     if (file.size > 10 * 1024 * 1024) {
//       setUploadErrors(prev => ({
//         ...prev,
//         [student._id]: "File size exceeds 10MB limit"
//       }));
//       return;
//     }

//     // Validate file type
//     const allowedTypes = [
//       'application/pdf',
//       'image/jpeg',
//       'image/png',
//       'image/gif',
//       'image/bmp',
//       'image/webp'
//     ];
    
//     if (!allowedTypes.includes(file.type)) {
//       setUploadErrors(prev => ({
//         ...prev,
//         [student._id]: "Only PDF and image files are allowed"
//       }));
//       return;
//     }

//     setUploadingFiles(prev => ({ ...prev, [student._id]: true }));
//     setUploadErrors(prev => ({ ...prev, [student._id]: null }));

//     const formData = new FormData();
//     formData.append('testFile', file);
//     formData.append('studentSrn', student.studentSrn);
//     formData.append('examId', student.examId);

//     try {
//       const response = await uploadTestFileService(formData);
      
//       // Update local state with file URL
//       setMarksData((prevData) =>
//         prevData.map((item) =>
//           item._id === student._id
//             ? { ...item, testFileUrl: response.data.testFileUrl }
//             : item
//         )
//       );
      
//       // Also update marks record with file URL
//       const payload = {
//         studentSrn: student.studentSrn,
//         examId: student.examId,
//         schoolId: student.schoolId,
//         userId: userData?.userId,
//         classofStudent: student.classofStudent,
//         testFileUrl: response.data.testFileUrl,
//         recordedBy: userData?.[0]?.userId ?? "Admin",
//         marksUpdatedOn: new Date().toISOString(),
//       };
      
//       await updateMarksBySrnAndExamId({}, payload);
      
//     } catch (error) {
//       setUploadErrors(prev => ({
//         ...prev,
//         [student._id]: error.response?.data?.message || "Error uploading file"
//       }));
//     } finally {
//       setUploadingFiles(prev => ({ ...prev, [student._id]: false }));
//     }
//   };

//   const openFile = (url) => {
//     if (url) {
//       window.open(url, '_blank');
//     }
//   };

//   //Passing props to DistrictBlockSchoolById component for filtering for logged in users.
//   const assignedDistricts = allDistrictIds;
//   console.log("i am user distrit", assignedDistricts);

//   //____________________________________________________________________________


//   //Sorting the marks data  
// marksData.sort((a, b)=>a.firstName.localeCompare(b.firstName))

//   return (
//     <Row className="justify-content-center">
//       <Col xs={12}>
//         <Container fluid className="prevent-overflow">
//           {/* <h1>Apply Filter</h1> */}

//           {/* <DistrictBlockSchoolById assignedDistricts={assignedDistricts} /> */}
//           <DistrictBlockSchoolById assignedDistricts={assignedDistricts} />

//           <Form>
//             <Form.Group
//               className="mb-3"
//               controlId="exampleForm.ControlTextarea1"
//             >
//               <Form.Label>Test Id</Form.Label>
//               <Select
//                 options={
//                   getTest.length > 0
//                     ? getTest.map((eachTest) => {
//                         return {
//                           value: eachTest.examId,
//                           label: eachTest.examId,
//                         };
//                       })
//                     : null
//                 }
//                 value={examId}
//                 onChange={setExamId}
//               />
//             </Form.Group>
//           </Form>

//           <ClassOfStudent />

//           <Form>
//             <Form.Group
//               as={Row}
//               className="mb-3"
//               controlId="formPlaintextPassword"
//             >
//               <Form.Label column sm="2">
//                 Filter Student Name
//               </Form.Label>
//               <Col sm="10">
//                 <Form.Control
//                   type="text"
//                   placeholder="text"
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />
//               </Col>
//             </Form.Group>
//           </Form>

//           <hr></hr>
//           <h2>Upload Marks</h2>

//           {marksData.length > 0 ? (
//             <Table responsive bordered cellPadding="10" cellSpacing="0">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>SRN</th>
//                   <th>Name</th>
//                   <th>Marks</th>
//                   <th>Test File</th>
//                   <th>Upload File</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {marksData.map((student, index) => (
//                   <tr key={student._id}>
//                     <td>{index + 1}</td>
//                     <td>{student.studentSrn}</td>
//                     <td>{student.firstName}</td>
//                     <td>
//                       <input
//                       style={{width:'4rem'}}
//                         type="text"
//                         placeholder=""
//                         defaultValue={student.marksObtained ?? ""}
//                         onChange={(e) => handleMarksChange(e, student)}
//                         disabled={!examId?.value} // <<< DISABLES INPUT IF TEST ID NOT SELECTED
//                       />
//                     </td>
//                     <td>
//                       {student.testFileUrl ? (
//                         <Button 
//                           variant="link" 
//                           onClick={() => openFile(student.testFileUrl)}
//                           size="sm"
//                         >
//                           View File
//                         </Button>
//                       ) : (
//                         <span className="text-muted">No file</span>
//                       )}
//                     </td>
//                     <td>
//                       <div>
//                         <input
//                           type="file"
//                           ref={el => fileInputRefs.current[student._id] = el}
//                           onChange={(e) => handleFileUpload(e, student)}
//                           accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
//                           style={{ display: 'none' }}
//                           disabled={uploadingFiles[student._id]}
//                         />
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           onClick={() => fileInputRefs.current[student._id]?.click()}
//                           disabled={uploadingFiles[student._id] || !examId?.value}
//                         >
//                           {uploadingFiles[student._id] ? 'Uploading...' : 'Choose File'}
//                         </Button>
//                         {uploadingFiles[student._id] && (
//                           <ProgressBar 
//                             animated 
//                             now={uploadProgress[student._id] || 50} 
//                             className="mt-1" 
//                             style={{ width: '100px' }}
//                           />
//                         )}
//                         {uploadErrors[student._id] && (
//                           <Alert variant="danger" className="mt-1 p-1" style={{ fontSize: '0.8rem' }}>
//                             {uploadErrors[student._id]}
//                           </Alert>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>Please filter your data and start updating marks.</p>
//           )}
//         </Container>
//       </Col>
//     </Row>
//   );
// };






// import React, { useState, useEffect, useContext, useRef } from "react";
// import { Container, Row, Col, Table, Form, Button, ProgressBar, Alert } from "react-bootstrap";
// import {
//   getAllMarksUsinQueryParams,
//   updateMarksBySrnAndExamId,
//   uploadTestFileService,
// } from "../../service/Marks.services.js";

// import {
//   DistrictBlockSchoolById,
//   ClassOfStudent,
// } from "../DependentDropDowns/DistrictBlockSchool.component.jsx";
// //importing context api (District Block School Context API)
// import {
//   DistrictBlockSchoolContext,
//   BlockContext,
//   SchoolContext,
//   ClassContext,
// } from "../contextAPIs/DependentDropdowns.contextAPI";

// import { UserContext } from "../../components/contextAPIs/User.context.js";
// import Select from "react-select"
// import { GetTests } from '../../service/ExamAndTestController';
// import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

// import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";
// import { studentMarksGamification } from "../../service/Gamification.services.js";
// import { uploadMarks } from "../../service/ErpTest.services.js";

// //ERP Test route back 
// import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";


// export const UploadMarks = () => {
//   //using userContext
//   const { userData, setUserData } = useContext(UserContext);
//   //___________________________________________________

  
//       //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
      
//        const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
//        const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
//        const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
//     //______________________________________________________________________________________________

//     //using ClassContext api

//     const {classContext, setClassContext} = useContext(ClassContext)

//     //______________________________________________________
  
  
// const [firstName, setFirstName] = useState('')
//   const [marksData, setMarksData] = useState([]);
//   // File upload states
//   const [uploadingFiles, setUploadingFiles] = useState({});
//   const [uploadErrors, setUploadErrors] = useState({});
//   const fileInputRefs = useRef({});



// //Fetchin examId data
// const [getTest, setGetTest] =useState([])
// const [examId, setExamId] = useState("")
 
//  const fetchTest = async () =>{

//   let reqBody;

//   if(  Array.isArray(userData?.userAccess?.classId) &&
//   userData.userAccess.classId.length === 2 &&
//   ["9", "10"].every(id => userData.userAccess.classId.includes(id))){
//     reqBody = {
//      classofStudent: classContext.value || ['9', '10']
//     }
//   } else {
//      reqBody = {
//      classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10']
//     }
//   }
// console.log(reqBody)
//         try {
//             const response = await GetTests(reqBody);
//             console.log(response.data.data);
//             setGetTest(response.data.data)

            
//         } catch (error) {
//             console.log("Error fetching test data", error.message)
//         }
//     }

//     useEffect(()=> {
//         fetchTest()

//     }, [classContext.value])

// //--------------------------------------
// const regions = userData?.userAccess?.region || [];
// const allSchoolIds = regions.flatMap(region =>
//   region.blockIds.flatMap(block =>
//     block.schoolIds.map(school => school.schoolId)
//   )
// );

// const allDistrictIds = regions.flatMap(region => 
//   region.districtId
// )

// console.log(allDistrictIds)

// //--------------------------------------------




//   //Below query params filters the data and show it on frontend from backend
//   const queryParams = {
//     studentSrn: "",
//     firstName: firstName,
//     fatherName: "",
//     // districtId: Object(districtContext[0]).value || "",
//     // blockId: Object(blockContext[0]).value || "",
//     schoolId: Object(schoolContext[0]).value || allSchoolIds,
//     classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10'],
//     examId: examId.value || "",
//     marksObtained: "",
//     recordedBy: "",
//     remark: "",
//     marksUpdatedOn: "",
//   };
// useEffect(() => {
//   const fetchMarksData = async () => {
  
 
//       console.log(getTest)


//         console.log("i am class of student ", classContext.value)
//         try {
//             const response = await getAllMarksUsinQueryParams(queryParams);
//             setMarksData(response.data);
//             console.log(response.data);
//           } catch (error) {
//             console.log("Error fetching marks data", error.message);
//             setMarksData([])
//           }
   
   
//   };

  
   
//     fetchMarksData();
//   }, [districtContext, blockContext, schoolContext, classContext, examId, firstName]);

//   //Clearing drop down values if user selects different value.

//   useEffect(() => {
//     setBlockContext([]);
//     setSchoolContext([])
//     setClassContext("")
//     setMarksData([])
    
//   }, [districtContext, ])

//   const handleMarksChange = async (e, student) => {
//     console.log(student)
//     const inputValue = e.target.value;
//     const cleanedInput = inputValue.trim();
//     const schoolId = student.schoolId;
//     const classofStudent = student.classofStudent;

//     // Allow only valid inputs
//     const isAbsent = /^absent$/i.test(cleanedInput);
//     const isA = /^a$/i.test(cleanedInput);
//     const isValidNumber = /^(\d{1,3})(\.\d{1,2})?$/.test(cleanedInput);

//     if (!isAbsent && !isA && !isValidNumber && cleanedInput !== "") {
//       // Invalid input: ignore
//       return;
//     }

//     // Avoid unnecessary updates
//     if (student.marksObtained?.toString() === cleanedInput) {
//       return;
//     }

//     try {
//       const payload = {
//         studentSrn: student.studentSrn,
//         examId: student.examId,
//         schoolId: schoolId,
//         userId: userData?.userId,
//         classofStudent: classofStudent,
//         marksObtained: cleanedInput,
//         recordedBy: userData?.[0]?.userId ?? "Admin", // or dynamically from user
//         marksUpdatedOn: new Date().toISOString(),
//         testFileUrl: student.testFileUrl || undefined, // Include file URL if exists
//       };

//       await updateMarksBySrnAndExamId({}, payload);

//       //Gamification marks

//       if (userData.role === "CC" || userData.role === "Admin"){
//          const gamificationReqBody = {
//         unqUserObjectId:userData?._id,
//         schoolId:schoolId,
//         classOfCenter:classofStudent,
//         userId: userData?.userId,
//         examId: student.examId,
//       }

//       const marksGamificationResponse = await studentMarksGamification(gamificationReqBody)

//       }
     
//       //ERP Test

//       if (userData.role === "hkrn"){

//         const erpTestReqBody = {
//           unqUserObjectId:userData?._id,
//         schoolId:schoolId,
//         classOfCenter:classofStudent,
//         userId: userData?.userId,
//         examId: student.examId,
//         }

//         const erpTestResponse = await uploadMarks (erpTestReqBody)


        
//       //function for routing back to test page after succesfully completting the task
        
//        ErpTestPageRouteBack(userData, {keyStatus: 'Marks'})

//       }


//       // Update local state for immediate UI feedback
//       setMarksData((prevData) =>
//         prevData.map((item) =>
//           item._id === student._id
//             ? { ...item, marksObtained: cleanedInput }
//             : item
//         )
//       );
//     } catch (error) {
//       console.error("Error updating marks:", error.message);
//     }
//   };

//   // File upload handler
//   const handleFileUpload = async (e, student) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     console.log("File selected for upload:", file.name, file.type, file.size);

//     // Validate file size (10MB max)
//     if (file.size > 10 * 1024 * 1024) {
//       setUploadErrors(prev => ({
//         ...prev,
//         [student._id]: "File size exceeds 10MB limit"
//       }));
//       return;
//     }

//     // Validate file type
//     const allowedTypes = [
//       'application/pdf',
//       'image/jpeg',
//       'image/png',
//       'image/gif',
//       'image/bmp',
//       'image/webp'
//     ];
    
//     if (!allowedTypes.includes(file.type)) {
//       setUploadErrors(prev => ({
//         ...prev,
//         [student._id]: "Only PDF and image files are allowed"
//       }));
//       return;
//     }

//     setUploadingFiles(prev => ({ ...prev, [student._id]: true }));
//     setUploadErrors(prev => ({ ...prev, [student._id]: null }));

//     const formData = new FormData();
//     formData.append('testFile', file);
//     formData.append('studentSrn', student.studentSrn);
//     formData.append('examId', student.examId);

//     try {
//       console.log("Uploading file to backend...");
//       const response = await uploadTestFileService(formData);
//       console.log("File upload response:", response);
      
//       // Update local state with file URL
//       setMarksData((prevData) =>
//         prevData.map((item) =>
//           item._id === student._id
//             ? { ...item, testFileUrl: response.testFileUrl }
//             : item
//         )
//       );
      
//       // Update marks record with file URL
//       const payload = {
//         studentSrn: student.studentSrn,
//         examId: student.examId,
//         schoolId: student.schoolId,
//         userId: userData?.userId,
//         classofStudent: student.classofStudent,
//         testFileUrl: response.testFileUrl,
//         recordedBy: userData?.[0]?.userId ?? "Admin",
//         marksUpdatedOn: new Date().toISOString(),
//       };
      
//       console.log("Updating marks with file URL:", payload);
//       await updateMarksBySrnAndExamId({}, payload);
      
//       alert("✅ File uploaded successfully!");
      
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       const errorMessage = error.response?.data?.message || error.message || "Error uploading file";
//       setUploadErrors(prev => ({
//         ...prev,
//         [student._id]: errorMessage
//       }));
//     } finally {
//       setUploadingFiles(prev => ({ ...prev, [student._id]: false }));
//     }
//   };

//   const openFile = (url) => {
//     if (url) {
//       window.open(url, '_blank');
//     } else {
//       alert("No file available");
//     }
//   };

//   //Passing props to DistrictBlockSchoolById component for filtering for logged in users.
//   const assignedDistricts = allDistrictIds;
//   console.log("i am user distrit", assignedDistricts);

//   //____________________________________________________________________________


//   //Sorting the marks data  
// marksData.sort((a, b)=>a.firstName.localeCompare(b.firstName))

//   return (
//     <Row className="justify-content-center">
//       <Col xs={12}>
//         <Container fluid className="prevent-overflow">
//           {/* <h1>Apply Filter</h1> */}

//           {/* <DistrictBlockSchoolById assignedDistricts={assignedDistricts} /> */}
//           <SchoolDropdown />

//           <Form>
//             <Form.Group
//               className="mb-3"
//               controlId="exampleForm.ControlTextarea1"
//             >
//               <Form.Label>Test Id</Form.Label>
//               <Select
//                 options={
//                   getTest.length > 0
//                     ? getTest.map((eachTest) => {
//                         return {
//                           value: eachTest.examId,
//                           label: eachTest.examId,
//                         };
//                       })
//                     : null
//                 }
//                 value={examId}
//                 onChange={setExamId}
//               />
//             </Form.Group>
//           </Form>

//           <ClassOfStudent />

//           <Form>
//             <Form.Group
//               as={Row}
//               className="mb-3"
//               controlId="formPlaintextPassword"
//             >
//               <Form.Label column sm="2">
//                 Filter Student Name
//               </Form.Label>
//               <Col sm="10">
//                 <Form.Control
//                   type="text"
//                   placeholder="text"
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />
//               </Col>
//             </Form.Group>
//           </Form>

//           <hr></hr>
//           <h2>Upload Marks</h2>

//           {marksData.length > 0 ? (
//             <Table responsive bordered cellPadding="10" cellSpacing="0">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>SRN</th>
//                   <th>Name</th>
//                   <th>Marks</th>
//                   <th>Test File</th>
//                   <th>Upload File</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {marksData.map((student, index) => (
//                   <tr key={student._id}>
//                     <td>{index + 1}</td>
//                     <td>{student.studentSrn}</td>
//                     <td>{student.firstName}</td>
//                     <td>
//                       <input
//                       style={{width:'4rem'}}
//                         type="text"
//                         placeholder=""
//                         defaultValue={student.marksObtained ?? ""}
//                         onChange={(e) => handleMarksChange(e, student)}
//                         disabled={!examId?.value} // <<< DISABLES INPUT IF TEST ID NOT SELECTED
//                       />
//                     </td>
//                     <td>
//                       {student.fileUrl ? (
//                         <Button 
//                           variant="link" 
//                           onClick={() => openFile(student.testFileUrl)}
//                           size="sm"
//                         >
//                           View File
//                         </Button>
//                       ) : (
//                         <span className="text-muted">No file</span>
//                       )}
//                     </td>
//                     <td>
//                       <div>
//                         <input
//                           type="file"
//                           ref={el => fileInputRefs.current[student._id] = el}
//                           onChange={(e) => handleFileUpload(e, student)}
//                           accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
//                           style={{ display: 'none' }}
//                           disabled={uploadingFiles[student._id] || !examId?.value}
//                         />
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           onClick={() => fileInputRefs.current[student._id]?.click()}
//                           disabled={uploadingFiles[student._id] || !examId?.value}
//                         >
//                           {uploadingFiles[student._id] ? 'Uploading...' : 'Choose File'}
//                         </Button>
//                         {uploadingFiles[student._id] && (
//                           <ProgressBar 
//                             animated 
//                             now={50} 
//                             className="mt-1" 
//                             style={{ width: '100px' }}
//                           />
//                         )}
//                         {uploadErrors[student._id] && (
//                           <Alert variant="danger" className="mt-1 p-1" style={{ fontSize: '0.8rem' }}>
//                             {uploadErrors[student._id]}
//                           </Alert>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>Please filter your data and start updating marks.</p>
//           )}
//         </Container>
//       </Col>
//     </Row>
//   );
// };










import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Row, Col, Table, Form, Button, ProgressBar, Alert } from "react-bootstrap";
import {
  getAllMarksUsinQueryParams,
  updateMarksBySrnAndExamId,
  uploadTestFileService,
} from "../../service/Marks.services.js";

import {
  DistrictBlockSchoolById,
  ClassOfStudent,
} from "../DependentDropDowns/DistrictBlockSchool.component.jsx";
//importing context api (District Block School Context API)
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";

import { UserContext } from "../../components/contextAPIs/User.context.js";
import Select from "react-select"
import { GetTests } from '../../service/ExamAndTestController';
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns.jsx";

import { DistrictDropdown, SchoolDropdown, DistrictSchoolDropdown } from "../../components/DependentDropDowns/DistrictBlockSchoolVersion2.component.jsx";
import { studentMarksGamification } from "../../service/Gamification.services.js";
import { uploadMarks } from "../../service/ErpTest.services.js";

//ERP Test route back 
import { ErpTestPageRouteBack } from "../ErpTest/erpTestRoutingBackToTestPage.jsx";


export const UploadMarks = () => {
  //using userContext
  const { userData, setUserData } = useContext(UserContext);
  //___________________________________________________

  
      //Accessing context DistrictBlockSchool Context api. These are being used to filter attendance data dynamically
      
       const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext); // Use context
       const {blockContext, setBlockContext} = useContext(BlockContext); // Use context
       const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context
    //______________________________________________________________________________________________

    //using ClassContext api

    const {classContext, setClassContext} = useContext(ClassContext)

    //______________________________________________________
  
  
const [firstName, setFirstName] = useState('')
  const [marksData, setMarksData] = useState([]);
  // File upload states
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const fileInputRefs = useRef({});



//Fetchin examId data
const [getTest, setGetTest] =useState([])
const [examId, setExamId] = useState("")
 
 const fetchTest = async () =>{

  let reqBody;

  if(  Array.isArray(userData?.userAccess?.classId) &&
  userData.userAccess.classId.length === 2 &&
  ["9", "10"].every(id => userData.userAccess.classId.includes(id))){
    reqBody = {
     classofStudent: classContext.value || ['9', '10']
    }
  } else {
     reqBody = {
     classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10']
    }
  }
console.log(reqBody)
        try {
            const response = await GetTests(reqBody);
            console.log(response.data.data);
            setGetTest(response.data.data)

            
        } catch (error) {
            console.log("Error fetching test data", error.message)
        }
    }

    useEffect(()=> {
        fetchTest()

    }, [classContext.value])

//--------------------------------------
const regions = userData?.userAccess?.region || [];
const allSchoolIds = regions.flatMap(region =>
  region.blockIds.flatMap(block =>
    block.schoolIds.map(school => school.schoolId)
  )
);

const allDistrictIds = regions.flatMap(region => 
  region.districtId
)

console.log(allDistrictIds)

//--------------------------------------------




  //Below query params filters the data and show it on frontend from backend
  const queryParams = {
    studentSrn: "",
    firstName: firstName,
    fatherName: "",
    // districtId: Object(districtContext[0]).value || "",
    // blockId: Object(blockContext[0]).value || "",
    schoolId: Object(schoolContext[0]).value || allSchoolIds,
    classofStudent: userData?.userAccess?.classId, //classContext.value || ['9', '10'],
    examId: examId.value || "",
    marksObtained: "",
    recordedBy: "",
    remark: "",
    marksUpdatedOn: "",
  };
useEffect(() => {
  const fetchMarksData = async () => {
  
 
      console.log(getTest)


        console.log("i am class of student ", classContext.value)
        try {
            const response = await getAllMarksUsinQueryParams(queryParams);
            setMarksData(response.data);
            console.log(response.data);
          } catch (error) {
            console.log("Error fetching marks data", error.message);
            setMarksData([])
          }
   
   
  };

  
   
    fetchMarksData();
  }, [districtContext, blockContext, schoolContext, classContext, examId, firstName]);

  //Clearing drop down values if user selects different value.

  useEffect(() => {
    setBlockContext([]);
    setSchoolContext([])
    setClassContext("")
    setMarksData([])
    
  }, [districtContext, ])

  const handleMarksChange = async (e, student) => {
    console.log(student)
    const inputValue = e.target.value;
    const cleanedInput = inputValue.trim();
    const schoolId = student.schoolId;
    const classofStudent = student.classofStudent;

    // Allow only valid inputs
    const isAbsent = /^absent$/i.test(cleanedInput);
    const isA = /^a$/i.test(cleanedInput);
    const isValidNumber = /^(\d{1,3})(\.\d{1,2})?$/.test(cleanedInput);

    if (!isAbsent && !isA && !isValidNumber && cleanedInput !== "") {
      // Invalid input: ignore
      return;
    }

    // Avoid unnecessary updates
    if (student.marksObtained?.toString() === cleanedInput) {
      return;
    }

    try {
      const payload = {
        studentSrn: student.studentSrn,
        examId: student.examId,
        schoolId: schoolId,
        userId: userData?.userId,
        classofStudent: classofStudent,
        marksObtained: cleanedInput,
        recordedBy: userData?.[0]?.userId ?? "Admin", // or dynamically from user
        marksUpdatedOn: new Date().toISOString(),
        fileUrl: student.fileUrl || undefined, // FIXED: Use fileUrl instead of testFileUrl
      };

      await updateMarksBySrnAndExamId({}, payload);

      //Gamification marks

      if (userData.role === "CC" || userData.role === "Admin"){
         const gamificationReqBody = {
        unqUserObjectId:userData?._id,
        schoolId:schoolId,
        classOfCenter:classofStudent,
        userId: userData?.userId,
        examId: student.examId,
      }

      const marksGamificationResponse = await studentMarksGamification(gamificationReqBody)

      }
     
      //ERP Test

      if (userData.role === "hkrn"){

        const erpTestReqBody = {
          unqUserObjectId:userData?._id,
        schoolId:schoolId,
        classOfCenter:classofStudent,
        userId: userData?.userId,
        examId: student.examId,
        }

        const erpTestResponse = await uploadMarks (erpTestReqBody)


        
      //function for routing back to test page after succesfully completting the task
        
       ErpTestPageRouteBack(userData, {keyStatus: 'Marks'})

      }


      // Update local state for immediate UI feedback
      setMarksData((prevData) =>
        prevData.map((item) =>
          item._id === student._id
            ? { ...item, marksObtained: cleanedInput }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating marks:", error.message);
    }
  };

  // File upload handler
  const handleFileUpload = async (e, student) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("File selected for upload:", file.name, file.type, file.size);

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadErrors(prev => ({
        ...prev,
        [student._id]: "File size exceeds 10MB limit"
      }));
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadErrors(prev => ({
        ...prev,
        [student._id]: "Only PDF and image files are allowed"
      }));
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [student._id]: true }));
    setUploadErrors(prev => ({ ...prev, [student._id]: null }));

    const formData = new FormData();
    formData.append('testFile', file);
    formData.append('studentSrn', student.studentSrn);
    formData.append('examId', student.examId);

    try {
      console.log("Uploading file to backend...");
      const response = await uploadTestFileService(formData);
      console.log("File upload response:", response);
      
      // Update local state with file URL - FIXED: Use fileUrl instead of testFileUrl
      setMarksData((prevData) =>
        prevData.map((item) =>
          item._id === student._id
            ? { ...item, fileUrl: response.fileUrl } // FIXED
            : item
        )
      );
      
      // Update marks record with file URL - FIXED: Use fileUrl instead of testFileUrl
      const payload = {
        studentSrn: student.studentSrn,
        examId: student.examId,
        schoolId: student.schoolId,
        userId: userData?.userId,
        classofStudent: student.classofStudent,
        fileUrl: response.fileUrl, // FIXED
        recordedBy: userData?.[0]?.userId ?? "Admin",
        marksUpdatedOn: new Date().toISOString(),
      };
      
      console.log("Updating marks with file URL:", payload);
      await updateMarksBySrnAndExamId({}, payload);
      
      // No alert - just update silently
      
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error uploading file";
      setUploadErrors(prev => ({
        ...prev,
        [student._id]: errorMessage
      }));
    } finally {
      setUploadingFiles(prev => ({ ...prev, [student._id]: false }));
    }
  };

  const openFile = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("No file available");
    }
  };

  //Passing props to DistrictBlockSchoolById component for filtering for logged in users.
  const assignedDistricts = allDistrictIds;
  console.log("i am user distrit", assignedDistricts);

  //____________________________________________________________________________


  //Sorting the marks data  
marksData.sort((a, b)=>a.firstName.localeCompare(b.firstName))

  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <Container fluid className="prevent-overflow">
          {/* <h1>Apply Filter</h1> */}

          {/* <DistrictBlockSchoolById assignedDistricts={assignedDistricts} /> */}
          <SchoolDropdown />

          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Test Id</Form.Label>
              <Select
                options={
                  getTest.length > 0
                    ? getTest.map((eachTest) => {
                        return {
                          value: eachTest.examId,
                          label: eachTest.examId,
                        };
                      })
                    : null
                }
                value={examId}
                onChange={setExamId}
              />
            </Form.Group>
          </Form>

          <ClassOfStudent />

          <Form>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="2">
                Filter Student Name
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="text"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Form>

          <hr></hr>
          <h2>Upload Marks</h2>

          {marksData.length > 0 ? (
            <Table responsive bordered cellPadding="10" cellSpacing="0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>SRN</th>
                  <th>Name</th>
                  <th>Marks</th>
                  <th>Test File</th>
                  <th>Upload File</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.studentSrn}</td>
                    <td>{student.firstName}</td>
                    <td>
                      <input
                      style={{width:'4rem'}}
                        type="text"
                        placeholder=""
                        defaultValue={student.marksObtained ?? ""}
                        onChange={(e) => handleMarksChange(e, student)}
                        disabled={!examId?.value} // <<< DISABLES INPUT IF TEST ID NOT SELECTED
                      />
                    </td>
                    <td>
                      {student.fileUrl ? ( // FIXED: Use fileUrl instead of testFileUrl
                        <Button 
                          variant="link" 
                          onClick={() => openFile(student.fileUrl)} // FIXED
                          size="sm"
                        >
                          View File
                        </Button>
                      ) : (
                        <span className="text-muted">No file</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[student._id] = el}
                          onChange={(e) => handleFileUpload(e, student)}
                          accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                          style={{ display: 'none' }}
                          disabled={uploadingFiles[student._id] || !examId?.value}
                        />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => fileInputRefs.current[student._id]?.click()}
                          disabled={uploadingFiles[student._id] || !examId?.value}
                        >
                          {uploadingFiles[student._id] ? 'Uploading...' : 'Choose File'}
                        </Button>
                        {uploadingFiles[student._id] && (
                          <ProgressBar 
                            animated 
                            now={50} 
                            className="mt-1" 
                            style={{ width: '100px' }}
                          />
                        )}
                        {uploadErrors[student._id] && (
                          <Alert variant="danger" className="mt-1 p-1" style={{ fontSize: '0.8rem' }}>
                            {uploadErrors[student._id]}
                          </Alert>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Please filter your data and start updating marks.</p>
          )}
        </Container>
      </Col>
    </Row>
  );
};