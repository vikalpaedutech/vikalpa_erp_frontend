// // // //This shows the test questions to users.



// // //This shows the test questions to users.
// // import React, { useContext, useEffect, useState } from "react";
// // import { Container, Card, Row, Col } from "react-bootstrap";
// // import { GetErpTestByUnqUserObjectId } from "../../service/ErpTest.services";
// // import { UserContext } from "../contextAPIs/User.context";

// // import { UpdateErpMarksService } from "../../service/ErpTest.services";
// // import { AnswerObject } from "./Answerr";

// // export const ERPtest = () => {

// //   console.log(AnswerObject)
// //   const { userData } = useContext(UserContext);

// //   //Hooks
// //   const [erpTestData, setErpTestData] = useState([]);
// //   const [savingMarks, setSavingMarks] = useState(false);
// //   const [saveStatus, setSaveStatus] = useState(null);

// //   const fetchErptestObject = async () => {
// //     const reqBody = {
// //       unqUserObjectId: userData._id,
// //     };

// //     const response = await GetErpTestByUnqUserObjectId(reqBody);

// //     setErpTestData(response.data);

// //     console.log(response.data);
// //   };

// //   useEffect(() => {
// //     fetchErptestObject();
// //   }, []);

// //   const tasks = [
// //     {
// //       id: "01",
// //       question: "Mark your self-attendance.",
// //       link: "http://localhost:3000/",
// //       field: "selfAttendance",
// //       label: "Click here to Attempt.",
// //       marks: 0.5,
// //     },
// //     {
// //       id: "02",
// //       question: "Mark the attendance of students from classes 9 and 10, where Ajay and Jatin from class 09 are absent, and Samay and Anjali from class 10 are absent.",
// //       // link: "http://localhost:3000/mb-attendance",
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "studentAttendanceCount",
// //       label: "Click here to Attempt.",
// //       marks: 2, // updated to 2 marks
// //     },
// //    {
// //   id: "03",
// //   question: `
// //   <p><strong>Update the marks of students on ERP for the following:</strong></p>

// //   <h4>For Class 09</h4>
// //   <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 12px;">
// //     <thead>
// //       <tr>
// //         <th style="text-align:left; padding:6px;">Name</th>
// //         <th style="text-align:left; padding:6px;">Father</th>
// //         <th style="text-align:left; padding:6px;">Obtained Marks</th>
// //       </tr>
// //     </thead>
// //     <tbody>
// //       <tr><td style="padding:6px;">Shubham</td><td style="padding:6px;">Shubhchandra</td><td style="padding:6px;">74</td></tr>
// //       <tr><td style="padding:6px;">Ripudaman</td><td style="padding:6px;">Shubham</td><td style="padding:6px;">94</td></tr>
// //       <tr><td style="padding:6px;">Sanjeev</td><td style="padding:6px;">Jeet</td><td style="padding:6px;">72</td></tr>
// //       <tr><td style="padding:6px;">Ajay</td><td style="padding:6px;">Brijesh</td><td style="padding:6px;">Absent</td></tr>
// //       <tr><td style="padding:6px;">Jatin</td><td style="padding:6px;">Raaj</td><td style="padding:6px;">87</td></tr>
// //       <tr><td style="padding:6px;">Poshak</td><td style="padding:6px;">Shailesh</td><td style="padding:6px;">79</td></tr>
// //       <tr><td style="padding:6px;">Anshu</td><td style="padding:6px;">Ajay</td><td style="padding:6px;">92</td></tr>
// //       <tr><td style="padding:6px;">Gajendra</td><td style="padding:6px;">Arun</td><td style="padding:6px;">88</td></tr>
// //       <tr><td style="padding:6px;">Vimal</td><td style="padding:6px;">Shyam</td><td style="padding:6px;">71</td></tr>
// //       <tr><td style="padding:6px;">Madhu</td><td style="padding:6px;">Jagjeet</td><td style="padding:6px;">86</td></tr>
// //     </tbody>
// //   </table>

// //   <h4 style="margin-top: 8px;">For Class 10</h4>
// //   <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
// //     <thead>
// //       <tr>
// //         <th style="text-align:left; padding:6px;">Name</th>
// //         <th style="text-align:left; padding:6px;">Father</th>
// //         <th style="text-align:left; padding:6px;">Obtained Marks</th>
// //       </tr>
// //     </thead>
// //     <tbody>
// //       <tr><td style="padding:6px;">Akhilesh</td><td style="padding:6px;">Chandu</td><td style="padding:6px;">98</td></tr>
// //       <tr><td style="padding:6px;">Abhinesh</td><td style="padding:6px;">Ram</td><td style="padding:6px;">92</td></tr>
// //       <tr><td style="padding:6px;">Akshay</td><td style="padding:6px;">Balraj</td><td style="padding:6px;">100</td></tr>
// //       <tr><td style="padding:6px;">Samay</td><td style="padding:6px;">Deepak</td><td style="padding:6px;">Absent</td></tr>
// //       <tr><td style="padding:6px;">Anjali</td><td style="padding:6px;">Rupesh</td><td style="padding:6px;">93</td></tr>
// //       <tr><td style="padding:6px;">Rekha</td><td style="padding:6px;">Sandeep</td><td style="padding:6px;">83</td></tr>
// //       <tr><td style="padding:6px;">Srishti</td><td style="padding:6px;">Jaiveer</td><td style="padding:6px;">97</td></tr>
// //       <tr><td style="padding:6px;">Aayush</td><td style="padding:6px;">Uma</td><td style="padding:6px;">86</td></tr>
// //       <tr><td style="padding:6px;">Jay</td><td style="padding:6px;">Shankar</td><td style="padding:6px;">93</td></tr>
// //       <tr><td style="padding:6px;">Rohit</td><td style="padding:6px;">Raju</td><td style="padding:6px;">90</td></tr>
// //     </tbody>
// //   </table>
// //   `,
// //   link: "http://localhost:3000/user-dashboard",
// //   field: "uploadMarksCount",
// //   label: "Click here to Attempt.",
// //   // per your spec: total 4 marks -> 2 marks for class 9 & 2 marks for class 10
// //   marks: 4,
// // },
// //     {
// //       id: "04",
// //       question: `Please update the disciplinary records of the following students based on their recent behavior:

// // For Class 09:
// // Aalia – reported late to class.

// // Ajay – absent for an entire week.

// // For Class 10:
// // 1. Aayush – caught using a mobile phone during class hours.

// // 2. Abhinesh – engaged in talking during class.

// // 3. Akhilesh – displayed disrespectful behavior and left the class without the teacher's permission.
// //       `,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "disciplinary",
// //       label: "Click here to Attempt.",
// //       marks: 2.5,
// //     },
// //     {
// //       id: "05",
// //       question: `Please update the Classwork Copy-Checking records for the following students as per their respective subjects:

// // For Class 09:
// // 1. Aalia: English – Complete, Hindi – Incomplete, Maths – Unavailable.

// // 2. Ajay: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.

// // For Class 10:
// // 1. Aayush: English – Complete, Hindi – Incomplete, Science – Unavailable.

// // 2. Abhinesh: English – Complete, Hindi – Incomplete, Maths – Unavailable.

// // 3. Akhilesh: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.`,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "copyChecking",
// //       label: "Click here to Attempt.",
// //       marks: 2.5,
// //     },
// //     {
// //       id: "06",
// //       question: "Download the attendance PDF of class 9th.",
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "downloadAttendancePdfFormat",
// //       label: "Click here to Attempt.",
// //       // not specified — keep default behavior (use 1 as default full marks)
// //       marks: 0.5,
// //     },
// //     {
// //       id: "07",
// //       question: "Upload the attendance pdf that was downloaded in question 6.",
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "uploadAttendancePdfFormat",
// //       label: "Click here to Attempt.",
// //       marks: 0.5,
// //     },
// //     {
// //       id: "08",
// //       question: `Please raise school-related concerns on the ERP system for the following situations:

// // For class 09:
// // 1. Classes were interrupted due to a poor internet connection; raise a concern in the ERP about this issue.

// // 2. Optional classes are not being conducted in your school; raise a concern in the ERP regarding this matter.

// // 3. Question papers of students have not been checked; raise a concern in the ERP to report this issue.

// // For class 10:
// // 1. The school was unexpectedly closed today due to a sudden event; raise a concern in the ERP to record this.

// // 2. A half-day was announced due to a specific event; raise a concern in the ERP regarding this.
// // `,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "schoolConcern",
// //       label: "Click here to Attempt.",
// //       marks: 2.5,
// //     },
// //     {
// //       id: "09",
// //       question: `Raise Student-related concerns on the ERP for the following situations:

// // For class 09:
// // 1. A student's SLC (School Leaving Certificate) has been released, and the record needs to be removed from the ERP. Raise a concern to update the system accordingly.

// // 2. A student's examination center has changed, but the ERP still shows the old center. Raise a concern regarding this center change.

// // For class 10:      
// // 1. The MB App is not working properly, and students are unable to log in or access their dashboards. Raise a concern on ERP regarding this issue.

// // 2. A student's details need to be added to the ERP, but the record is not yet available in the system. Raise a concern on ERP to add the student.
// // `,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "studentRelatedConncern",
// //       label: "Click here to Attempt.",
// //       marks: 2.5,
// //     },
// //     {
// //       id: "10",
// //       question: `Raise the Tech-related concerns on ERP for following classes and equipment:

// // For class 09:
// // 1. The smart classroom screen is not functioning properly in Class 9; raise a concern on ERP regarding the screen issue.

// // 2. The inverter is not working, causing frequent power interruptions during lessons in Class 9; raise a concern on ERP about this problem.

// // 3. The microphone in Class 9 is not operational, making it difficult for teacher to hear the students clearly; raise a concern on ERP to resolve this issue.

// // For class 10:
// // 1. The camera in Class 10's smart classroom is not working, preventing video sessions and monitoring; raise a concern about this issue on ERP.

// // 2. The Mini PC used for teaching in Class 10 is not starting or frequently crashes; raise a concern on ERP to report this malfunction.

// // 3. There is a power supply issue in Class 10 due to electricity fluctuations; raise a concern on ERP to get this resolved.`,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "techConcern",
// //       label: "Click here to Attempt.",
// //       marks: 3,
// //     },

// //      {
// //       id: "11",
// //       question: `Make the absentee calling to the students of class 9th and 10th who were absent in the class.`,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "absenteeCalling",
// //       label: "Click here to Attempt.",
// //       marks: 2,
// //     },

// //      {
// //       id: "12",
// //       question: `Please close the previously raised school-related concerns on the ERP system

// // Each concern should be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:

// // For Class 09:
// // 1. Classes were interrupted due to a poor internet connection – Still Not Resolved.

// // 2. Optional classes are not being conducted in your school – Still Not Resolved.

// // 3. Question papers of students have not been checked – Resolved.

// // For Class 10:
// // 1. The school was unexpectedly closed today due to a sudden event – Resolved.

// // 2. A half-day was announced due to a specific event – Resolved.

// // Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "closeSchoolConcerns",
// //       label: "Click here to Attempt.",
// //       marks: 2.5,
// //     },

// //      {
// //       id: "13",
// //       question: `Please close the previously raised student-related concerns on the ERP system.

// // Each concern should now be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:

// // For Class 09:
// // 1. A student's SLC (School Leaving Certificate) had been released, and the record needed to be removed from the ERP – Still Not Resolved.

// // 2. A student's examination center had changed, but the ERP still showed the old center – Resolved.

// // For Class 10:
// // 1. The MB App was not working properly, and students were unable to log in or access their dashboards – Resolved.

// // 2. A student's details needed to be added to the ERP, but the record was not available – Still Not Resolved.


// // Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "closeStudentConcerns",
// //       label: "Click here to Attempt.",
// //       marks: 2.5,
// //     },


// //     {
// //       id: "14",

// //       question: `Please close the previously raised Tech-related concerns on the ERP system.

// // Each concern should now be closed with the appropriate status — either Resolved or Still Not Resolved — as mentioned below:

// // For Class 09:
// // 1. The smart classroom screen was not functioning properly – Resolved.

// // 2. The inverter was not working, causing frequent power interruptions – Still Not Resolved.

// // 3. The microphone in Class 9 was not operational, making it difficult for the teacher to hear the students – Resolved.

// // For Class 10:
// // 1. The camera in Class 10's smart classroom was not working, preventing video sessions and monitoring – Resolved.

// // 2. The Mini PC used for teaching in Class 10 was frequently crashing or not starting – Still Not Resolved.

// // 3. The power supply issue in Class 10 due to electricity fluctuations – Resolved.

// // Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
// //       link: "http://localhost:3000/user-dashboard",
// //       field: "closeTechConcerns",
// //       label: "Click here to Attempt.",
// //       marks: 3,
// //     },


// //   ];

// //   // Helper: compute attendance score for question 2 (studentAttendanceCount)
// //  const computeAttendanceScore = (attendanceObj) => {
// //   if (!attendanceObj || typeof attendanceObj !== "object") return 0;

// //   const totalCount = (attendanceObj.count9 || 0) + (attendanceObj.count10 || 0);
  
// //   // ✅ Corrected logic:
// //   if (totalCount === 26) {
// //     return 2;  // Full marks for all students
// //   } else if (totalCount > 0 && totalCount < 26) {
// //     return 1;  // Partial marks for some students
// //   } else {
// //     return 0;  // Zero marks for no attendance
// //   }
// // };

// //   // Student lists for Q3 as shown in the table (used to compute per-student marks)
// //   const class9Students = [
// //     "Shubham",
// //     "Ripudaman",
// //     "Sanjeev",
// //     "Ajay",
// //     "Jatin",
// //     "Poshak",
// //     "Anshu",
// //     "Gajendra",
// //     "Vimal",
// //     "Madhu",
// //   ];
// //   const class10Students = [
// //     "Akhilesh",
// //     "Abhinesh",
// //     "Akshay",
// //     "Samay",
// //     "Anjali",
// //     "Rekha",
// //     "Srishti",
// //     "Aayush",
// //     "Jay",
// //     "Rohit",
// //   ];

// //   // Helper: compute object field score with field count validation
// //   const computeObjectFieldScore = (obj, expectedFieldCount, totalMarks) => {
// //     if (!obj || typeof obj !== "object") return 0;
    
// //     const actualFieldCount = Object.keys(obj).length;
    
// //     // If field count matches expected, give full marks
// //     if (actualFieldCount === expectedFieldCount) {
// //       return totalMarks;
// //     } else {
// //       // Negative marking: -0.5 for each missing/extra field
// //       const difference = Math.abs(expectedFieldCount - actualFieldCount);
// //       const penalty = difference * 0.5;
// //       const score = Math.max(0, totalMarks - penalty);
// //       return Math.round(score * 100) / 100;
// //     }
// //   };

// //   // Helper: compute array field score with count validation
// //   const computeArrayFieldScore = (obj, arrayFieldName, expectedCount, totalMarks) => {
// //     if (!obj || !obj[arrayFieldName] || !Array.isArray(obj[arrayFieldName])) return 0;
    
// //     const actualCount = obj[arrayFieldName].length;
    
// //     // If count matches expected, give full marks
// //     if (actualCount === expectedCount) {
// //       return totalMarks;
// //     } else {
// //       // Negative marking: -0.5 for each missing/extra item
// //       const difference = Math.abs(expectedCount - actualCount);
// //       const penalty = difference * 0.5;
// //       const score = Math.max(0, totalMarks - penalty);
// //       return Math.round(score * 100) / 100;
// //     }
// //   };

// //   // Helper: compute disciplinary and copy checking score with null value check
// //   const computeDisciplinaryCopyScore = (obj, expectedFieldCount, totalMarks) => {
// //     if (!obj || typeof obj !== "object") return 0;
    
// //     const actualFieldCount = Object.keys(obj).length;
    
// //     // Check if field count matches and no field has null value
// //     let validFields = 0;
// //     Object.values(obj).forEach(value => {
// //       if (value !== null && value !== undefined) {
// //         if (Array.isArray(value)) {
// //           // For copyChecking arrays, check if any subject has non-null value
// //           const hasValidSubject = value.some(item => {
// //             if (typeof item === 'object' && item !== null) {
// //               return Object.values(item).some(val => val !== null && val !== undefined);
// //             }
// //             return item !== null && item !== undefined;
// //           });
// //           if (hasValidSubject) validFields++;
// //         } else {
// //           // For disciplinary, check if value is not null
// //           validFields++;
// //         }
// //       }
// //     });
    
// //     // If all expected fields are present and none are null, give full marks
// //     if (actualFieldCount === expectedFieldCount && validFields === expectedFieldCount) {
// //       return totalMarks;
// //     } else {
// //       // Negative marking: -0.5 for each missing/extra field or null field
// //       const fieldDifference = Math.abs(expectedFieldCount - actualFieldCount);
// //       const nullPenalty = Math.abs(expectedFieldCount - validFields);
// //       const totalPenalty = (fieldDifference + nullPenalty) * 0.5;
// //       const score = Math.max(0, totalMarks - totalPenalty);
// //       return Math.round(score * 100) / 100;
// //     }
// //   };

// //   // Generic function to compute earned marks for a given task using the fetched data object
// //   const computeTaskScore = (task, data) => {
// //     if (!task || !data) return 0;
// //     const value = data[task.field];
// //     const totalMarks = Number(task.marks ?? 1);

// //     // Special handling for studentAttendanceCount (q2)
// //     if (task.field === "studentAttendanceCount") {
// //       return computeAttendanceScore(value);
// //     }

    
// //     // Special handling for uploadMarksCount (q3)
// //     if (task.field === "uploadMarksCount") {
// //       const uploads = value && typeof value === "object" ? value : {};
// //       const class9TotalMarks = 2;
// //       const class10TotalMarks = 2;
// //       const class9Count = class9Students.length;
// //       const class10Count = class10Students.length;
// //       const perStudent9 = class9TotalMarks / class9Count;
// //       const perStudent10 = class10TotalMarks / class10Count;

// //       // Maps from the original HTML for 'Obtained Marks' to detect "Absent"
// //       const obtainedMap = {
// //         Shubham: "74",
// //         Ripudaman: "94",
// //         Sanjeev: "72",
// //         Ajay: "Absent",
// //         Jatin: "87",
// //         Poshak: "79",
// //         Anshu: "92",
// //         Gajendra: "88",
// //         Vimal: "71",
// //         Madhu: "86",
// //         Akhilesh: "98",
// //         Abhinesh: "92",
// //         Akshay: "100",
// //         Samay: "Absent",
// //         Anjali: "93",
// //         Rekha: "83",
// //         Srishti: "97",
// //         Aayush: "86",
// //         Jay: "93",
// //         Rohit: "90",
// //       };

// //       let awarded9 = 0;
// //       let penalty = 0;
// //       class9Students.forEach((s) => {
// //         if (Number(uploads[s]) === 1) {
// //           // Only apply penalty if student was marked as present but should be absent
// //           if (String(obtainedMap[s]).toLowerCase() === "absent") {
// //             penalty += 0.5;
// //           } else {
// //             awarded9 += perStudent9;
// //           }
// //         } else if (s === "Ajay" && Number(uploads[s]) === 0) {
// //           // Ajay should be 0 (absent) - give 0.2 marks for correct handling
// //           awarded9 += 0.2;
// //         }
// //         // If student is absent (Ajay) and not uploaded (value 0), no penalty - this is correct
// //       });

// //       let awarded10 = 0;
// //       class10Students.forEach((s) => {
// //         if (Number(uploads[s]) === 1) {
// //           if (String(obtainedMap[s]).toLowerCase() === "absent") {
// //             penalty += 0.5;
// //           } else {
// //             awarded10 += perStudent10;
// //           }
// //         } else if (s === "Samay" && Number(uploads[s]) === 0) {
// //           // Samay should be 0 (absent) - give 0.2 marks for correct handling
// //           awarded10 += 0.2;
// //         }
// //         // If student is absent (Samay) and not uploaded (value 0), no penalty - this is correct
// //       });

// //       // Round to 2 decimals
// //       let totalAwarded = Math.round((awarded9 + awarded10 - penalty) * 100) / 100;
// //       if (totalAwarded > totalMarks) totalAwarded = totalMarks;
// //       return totalAwarded;
// //     }

// //     // Special handling for disciplinary with null value check
// //     if (task.field === "disciplinary") {
// //       // Expected 5 fields: Aalia, Ajay, Aayush, Abhinesh, Akhilesh
// //       return computeDisciplinaryCopyScore(value, 5, totalMarks);
// //     }

// //     // Special handling for copyChecking with null value check
// //     if (task.field === "copyChecking") {
// //       // Expected 5 fields: Aalia, Ajay, Aayush, Abhinesh, Akhilesh
// //       return computeDisciplinaryCopyScore(value, 5, totalMarks);
// //     }

// //     if (task.field === "schoolConcern") {
// //       // Expected 5 concerns in the array
// //       return computeArrayFieldScore(value, "concerns", 5, totalMarks);
// //     }

// //     if (task.field === "studentRelatedConncern") {
// //       // Expected 4 concerns in the array
// //       return computeArrayFieldScore(value, "concerns", 4, totalMarks);
// //     }

// //     if (task.field === "techConcern") {
// //       // Expected 6 concerns in the array
// //       return computeArrayFieldScore(value, "concerns", 6, totalMarks);
// //     }

// //     if (task.field === "closeSchoolConcerns") {
// //       // Expected 5 concerns in the array
// //       return computeArrayFieldScore(value, "concerns", 5, totalMarks);
// //     }

// //     if (task.field === "closeStudentConcerns") {
// //       // Expected 4 concerns in the array
// //       return computeArrayFieldScore(value, "concerns", 4, totalMarks);
// //     }

// //     if (task.field === "closeTechConcerns") {
// //       // Expected 6 concerns in the array
// //       return computeArrayFieldScore(value, "concerns", 6, totalMarks);
// //     }

// //     // For boolean fields (most concerns, download/upload flags, etc.) grant full marks if true
// //     if (typeof value === "boolean") {
// //       return value === true ? totalMarks : 0;
// //     }

// //     // For numeric fields where original logic used >=10 as "completed", keep that logic and map to marks:
// //     if (typeof value === "number") {
// //       const valNum = value;
// //       const maxCount = 10;
// //       const proportion = Math.min(valNum / maxCount, 1);
// //       const score = Math.round(proportion * totalMarks * 100) / 100;
// //       return score;
// //     }

// //     // For object fields (like absenteeCalling) attempt a heuristic:
// //     if (typeof value === "object" && value !== null) {
// //       const keys = Object.keys(value);
// //       if (keys.length === 0) return 0;
// //       let filled = 0;
// //       keys.forEach((k) => {
// //         const v = value[k];
// //         if (Array.isArray(v)) {
// //           const anyFilled = v.some((entry) => {
// //             if (entry === null) return false;
// //             if (typeof entry === "object") {
// //               return Object.values(entry).some((ev) => ev !== null && ev !== undefined);
// //             }
// //             return entry !== null && entry !== undefined;
// //           });
// //           if (anyFilled) filled++;
// //         } else if (k.toLowerCase().includes("concern") && v && Array.isArray(v.concerns)) {
// //           const arr = v.concerns;
// //           if (!arr || arr.length === 0) {
// //           } else {
// //             let nonWrong = 0;
// //             arr.forEach((c) => {
// //               const isWrong =
// //                 (c && typeof c === "object" && (c.isWrong === true || String(c.status).toLowerCase().includes("wrong") || String(c.result).toLowerCase().includes("incorrect")));
// //               if (!isWrong) nonWrong++;
// //             });
// //             const proportion = nonWrong / arr.length;
// //             const score = Math.round(proportion * totalMarks * 100) / 100;
// //             return score;
// //           }
// //         } else {
// //           if (v !== null && v !== undefined && !(typeof v === "object" && Object.keys(v).length === 0)) {
// //             filled++;
// //           }
// //         }
// //       });
// //       const proportion = filled / keys.length;
// //       const score = Math.round(proportion * totalMarks * 100) / 100;
// //       return score;
// //     }

// //     // default fallback
// //     return 0;
// //   };

// //   const isTaskCompleted = (task) => {
// //     if (!erpTestData.length) return false;
// //     const data = erpTestData[0];

// //     const earned = computeTaskScore(task, data);
// //     const full = Number(task.marks ?? 1);

// //     // Consider completed only when full marks achieved
// //     return Math.abs(earned - full) < 0.0001;
// //   };

// //   const renderTaskStatus = (task) => {
// //     if (!erpTestData.length) {
// //       return (
// //         <span style={{ color: "gray", fontWeight: "bold" }}>
// //           Answer: Loading...
// //         </span>
// //       );
// //     }

// //     const data = erpTestData[0];
// //     const value = data[task.field];
// //     const totalMarks = Number(task.marks ?? 1);
// //     const earned = computeTaskScore(task, data);
// //     const testSubmitted = Boolean(data.marks && data.marks.isTestSubmitted === true);

// //     // Special rendering for studentAttendanceCount (question 2)
// //     if (task.field === "studentAttendanceCount") {
// //       return (
// //         <div>
// //           {testSubmitted && (
// //             <div style={{ fontWeight: "600", marginBottom: "8px" }}>
// //               Marks: {earned}/{totalMarks}
// //             </div>
// //           )}
// //           <div style={{ marginTop: 6 }}>
// //             <div style={{ fontSize: 13 }}>
// //               Count 9: {value?.count9 || 0}, Count 10: {value?.count10 || 0}, Total: {(value?.count9 || 0) + (value?.count10 || 0)}
// //             </div>
// //           </div>
// //           <div style={{ marginTop: 8, fontWeight: "700", color: earned > 0 ? "green" : "red" }}>
// //             {earned > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
// //           </div>
// //         </div>
// //       );
// //     }

// //     // Special rendering for uploadMarksCount (question 3)
// //     if (task.id === "03") {
// //       const uploads = value && typeof value === "object" ? value : {};
// //       const class9TotalMarks = 2;
// //       const class10TotalMarks = 2;
// //       const class9Count = class9Students.length;
// //       const class10Count = class10Students.length;
// //       const perStudent9 = Math.round((class9TotalMarks / class9Count) * 100) / 100;
// //       const perStudent10 = Math.round((class10TotalMarks / class10Count) * 100) / 100;

// //       const obtainedMap = {
// //         Shubham: "74",
// //         Ripudaman: "94",
// //         Sanjeev: "72",
// //         Ajay: "Absent",
// //         Jatin: "87",
// //         Poshak: "79",
// //         Anshu: "92",
// //         Gajendra: "88",
// //         Vimal: "71",
// //         Madhu: "86",
// //         Akhilesh: "98",
// //         Abhinesh: "92",
// //         Akshay: "100",
// //         Samay: "Absent",
// //         Anjali: "93",
// //         Rekha: "83",
// //         Srishti: "97",
// //         Aayush: "86",
// //         Jay: "93",
// //         Rohit: "90",
// //       };

// //       const rows9 = class9Students.map((s) => {
// //         const raw = Number(uploads[s]) || 0;
// //         let awarded = 0;
// //         let penalty = 0;
        
// //         if (raw === 1) {
// //           if (String(obtainedMap[s]).toLowerCase() !== "absent") {
// //             awarded = perStudent9;
// //           } else {
// //             penalty = 0.5;
// //           }
// //         } else if (s === "Ajay" && raw === 0) {
// //           // Ajay should be 0 (absent) - give 0.2 marks for correct handling
// //           awarded = 0.2;
// //         }
        
// //         return { name: s, raw, awarded, penalty, obtained: obtainedMap[s] || "" };
// //       });

// //       const rows10 = class10Students.map((s) => {
// //         const raw = Number(uploads[s]) || 0;
// //         let awarded = 0;
// //         let penalty = 0;
        
// //         if (raw === 1) {
// //           if (String(obtainedMap[s]).toLowerCase() !== "absent") {
// //             awarded = perStudent10;
// //           } else {
// //             penalty = 0.5;
// //           }
// //         } else if (s === "Samay" && raw === 0) {
// //           // Samay should be 0 (absent) - give 0.2 marks for correct handling
// //           awarded = 0.2;
// //         }
        
// //         return { name: s, raw, awarded, penalty, obtained: obtainedMap[s] || "" };
// //       });

// //       const sumAwarded = rows9.reduce((a, r) => a + r.awarded, 0) + rows10.reduce((a, r) => a + r.awarded, 0);
// //       const sumPenalty = rows9.reduce((a, r) => a + r.penalty, 0) + rows10.reduce((a, r) => a + r.penalty, 0);
// //       const totalAwarded = Math.round((sumAwarded - sumPenalty) * 100) / 100;

// //       return (
// //         <div>
// //           <div dangerouslySetInnerHTML={{ __html: `<p><strong>Update the marks of students on ERP for the following:</strong></p>` }} />

// //           <div style={{ marginTop: 6 }}>
// //             <h4>For Class 09</h4>
// //             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }} border="1" cellPadding="6" cellSpacing="0">
// //               <thead>
// //                 <tr>
// //                   <th style={{ textAlign: "left", padding: 6 }}>Name</th>
// //                   <th style={{ textAlign: "left", padding: 6 }}>Father</th>
// //                   <th style={{ textAlign: "left", padding: 6 }}>Obtained Marks</th>
// //                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Upload Status</th>}
// //                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>ERP Marks</th>}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows9.map((r) => {
// //                   const fatherMap = {
// //                     Shubham: "Shubhchandra",
// //                     Ripudaman: "Shubham",
// //                     Sanjeev: "Jeet",
// //                     Ajay: "Brijesh",
// //                     Jatin: "Raaj",
// //                     Poshak: "Shailesh",
// //                     Anshu: "Ajay",
// //                     Gajendra: "Arun",
// //                     Vimal: "Shyam",
// //                     Madhu: "Jagjeet",
// //                   };
// //                   const obtainedMapLocal = {
// //                     Shubham: "74",
// //                     Ripudaman: "94",
// //                     Sanjeev: "72",
// //                     Ajay: "Absent",
// //                     Jatin: "87",
// //                     Poshak: "79",
// //                     Anshu: "92",
// //                     Gajendra: "88",
// //                     Vimal: "71",
// //                     Madhu: "86",
// //                   };
// //                   return (
// //                     <tr key={r.name}>
// //                       <td style={{ padding: 6 }}>{r.name}</td>
// //                       <td style={{ padding: 6 }}>{fatherMap[r.name]}</td>
// //                       <td style={{ padding: 6 }}>{obtainedMapLocal[r.name]}</td>
// //                       {testSubmitted && (
// //                         <td style={{ padding: 6 }}>
// //                           {r.raw === 1 ? "✅ Uploaded" : "❌ Not Uploaded"}
// //                         </td>
// //                       )}
// //                       {testSubmitted && (
// //                         <td style={{ padding: 6 }}>
// //                           {r.awarded}
// //                           {r.penalty ? `  (Penalty: -${r.penalty})` : ""}
// //                         </td>
// //                       )}
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           <div style={{ marginTop: 8 }}>
// //             <h4>For Class 10</h4>
// //             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }} border="1" cellPadding="6" cellSpacing="0">
// //               <thead>
// //                 <tr>
// //                   <th style={{ textAlign: "left", padding: 6 }}>Name</th>
// //                   <th style={{ textAlign: "left", padding: 6 }}>Father</th>
// //                   <th style={{ textAlign: "left", padding: 6 }}>Obtained Marks</th>
// //                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Upload Status</th>}
// //                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Erp Marks</th>}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows10.map((r) => {
// //                   const fatherMap10 = {
// //                     Akhilesh: "Chandu",
// //                     Abhinesh: "Ram",
// //                     Akshay: "Balraj",
// //                     Samay: "Deepak",
// //                     Anjali: "Rupesh",
// //                     Rekha: "Sandeep",
// //                     Srishti: "Jaiveer",
// //                     Aayush: "Uma",
// //                     Jay: "Shankar",
// //                     Rohit: "Raju",
// //                   };
// //                   const obtainedMap10 = {
// //                     Akhilesh: "98",
// //                     Abhinesh: "92",
// //                     Akshay: "100",
// //                     Samay: "Absent",
// //                     Anjali: "93",
// //                     Rekha: "83",
// //                     Srishti: "97",
// //                     Aayush: "86",
// //                     Jay: "93",
// //                     Rohit: "90",
// //                   };
// //                   return (
// //                     <tr key={r.name}>
// //                       <td style={{ padding: 6 }}>{r.name}</td>
// //                       <td style={{ padding: 6 }}>{fatherMap10[r.name]}</td>
// //                       <td style={{ padding: 6 }}>{obtainedMap10[r.name]}</td>
// //                       {testSubmitted && (
// //                         <td style={{ padding: 6 }}>
// //                           {r.raw === 1 ? "✅ Uploaded" : "❌ Not Uploaded"}
// //                         </td>
// //                       )}
// //                       {testSubmitted && (
// //                         <td style={{ padding: 6 }}>
// //                           {r.awarded}
// //                           {r.penalty ? `  (Penalty: -${r.penalty})` : ""}
// //                         </td>
// //                       )}
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {testSubmitted && (
// //             <div style={{ marginTop: 8, fontWeight: 600 }}>
// //               Mark: {totalAwarded}/{task.marks}
// //             </div>
// //           )}


// //           <div style={{ marginTop: 8, fontWeight: "700", color: totalAwarded > 0 ? "green" : "red" }}>
// //             {totalAwarded > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
// //           </div>
// //         </div>
// //       );
// //     }

// //     // Special rendering for object fields with field count validation
// //     const fieldCountTasks = ["disciplinary", "copyChecking", "schoolConcern", "studentRelatedConncern", "techConcern", "closeSchoolConcerns", "closeStudentConcerns", "closeTechConcerns"];
// //     if (fieldCountTasks.includes(task.field)) {
// //       let expectedCount = 0;
// //       let actualCount = 0;
// //       let validFields = 0;
      
// //       if (task.field === "disciplinary" || task.field === "copyChecking") {
// //         expectedCount = 5;
// //         actualCount = value && typeof value === "object" ? Object.keys(value).length : 0;
        
// //         // Count non-null fields for disciplinary and copyChecking
// //         if (value && typeof value === "object") {
// //           Object.values(value).forEach(fieldValue => {
// //             if (fieldValue !== null && fieldValue !== undefined) {
// //               if (Array.isArray(fieldValue)) {
// //                 // For copyChecking arrays, check if any subject has non-null value
// //                 const hasValidSubject = fieldValue.some(item => {
// //                   if (typeof item === 'object' && item !== null) {
// //                     return Object.values(item).some(val => val !== null && val !== undefined);
// //                   }
// //                   return item !== null && item !== undefined;
// //                 });
// //                 if (hasValidSubject) validFields++;
// //               } else {
// //                 // For disciplinary, check if value is not null
// //                 validFields++;
// //               }
// //             }
// //           });
// //         }
// //       } else {
// //         // Concern tasks
// //         switch(task.field) {
// //           case "schoolConcern":
// //           case "closeSchoolConcerns":
// //             expectedCount = 5;
// //             break;
// //           case "studentRelatedConncern":
// //           case "closeStudentConcerns":
// //             expectedCount = 4;
// //             break;
// //           case "techConcern":
// //           case "closeTechConcerns":
// //             expectedCount = 6;
// //             break;
// //           default:
// //             expectedCount = 0;
// //         }
// //         actualCount = value && value.concerns && Array.isArray(value.concerns) ? value.concerns.length : 0;
// //         validFields = actualCount; // For concerns, all are considered valid if they exist
// //       }

// //       const difference = Math.abs(expectedCount - actualCount);
// //       const nullDifference = (task.field === "disciplinary" || task.field === "copyChecking") ? Math.abs(expectedCount - validFields) : 0;
// //       const totalPenalty = (difference + nullDifference) * 0.5;

// //       return (
// //         <div>
// //           {testSubmitted && (
// //             <div style={{ fontWeight: "600", marginBottom: "8px" }}>
// //               Marks: {earned}/{totalMarks}
// //             </div>
// //           )}
// //           <div style={{ marginTop: 6 }}>
// //             <div style={{ fontSize: 13 }}>
// //               Expected {expectedCount} {task.field.includes("Concern") ? "concerns" : "fields"}, Found: {actualCount}
// //               {(task.field === "disciplinary" || task.field === "copyChecking") && (
// //                 <>, Valid (non-null): {validFields}</>
// //               )}
// //             </div>
// //           </div>
// //           <div style={{ marginTop: 8, fontWeight: "700", color: earned > 0 ? "green" : "red" }}>
// //             {earned > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
// //           </div>
// //         </div>
// //       );
// //     }

// //     // Generic rendering for other tasks
// //     const isAttempted = earned > 0;

// //     if (isAttempted) {
// //       return (
// //         <div>
// //           <span style={{ color: "green", fontWeight: "bold" }}>
// //             ✅ Answer: Attempted
// //           </span>
// //           {testSubmitted && (
// //             <>
// //               <br />
// //               <span style={{ color: "green", fontWeight: "bold" }}>Score: {earned}/{totalMarks}</span>
// //             </>
// //           )}
// //         </div>
// //       );
// //     } else {
// //       return (
// //         <div>
// //           <span style={{ color: "red", fontWeight: "bold" }}>
// //             ❌ Answer: Not Attempted
// //           </span>
// //           {testSubmitted && (
// //             <>
// //               <br />
// //               <span style={{ color: "gray", fontWeight: "bold" }}>Score: {earned}/{totalMarks}</span>
// //             </>
// //           )}
// //         </div>
// //       );
// //     }
// //   };

// //   const totalQuestions = tasks.length;
// //   const totalAnswered = tasks.filter((t) => isTaskCompleted(t)).length;

// //   // Calculate total marks
// //   const calculateTotalMarks = () => {
// //     if (!erpTestData.length) return { obtained: 0, total: 0 };
// //     const data = erpTestData[0];
// //     let obtained = 0;
// //     let total = 0;
    
// //     tasks.forEach(task => {
// //       const earned = computeTaskScore(task, data);
// //       obtained += earned;
// //       total += Number(task.marks ?? 1);
// //     });
    
// //     return { obtained: Math.round(obtained * 100) / 100, total };
// //   };

// //   // --- NEW: build marks payload (q1..q14) and save handler ---
// //   const buildMarksPayload = () => {
// //     if (!erpTestData || !erpTestData.length) return null;
// //     const data = erpTestData[0];
// //     const marks = {};
// //     for (let i = 0; i < 14; i++) {
// //       const t = tasks[i];
// //       const qKey = `q${i + 1}`;
// //       if (t) {
// //         marks[qKey] = computeTaskScore(t, data);
// //       } else {
// //         marks[qKey] = 0;
// //       }
// //     }
// //     return marks;
// //   };

// //   const handleSaveMarks = async () => {
// //     if (!erpTestData || !erpTestData.length) {
// //       setSaveStatus({ type: "error", message: "No ERP data available to compute marks." });
// //       return;
// //     }
// //     const marksPayload = buildMarksPayload();
// //     if (!marksPayload) {
// //       setSaveStatus({ type: "error", message: "Unable to build marks payload." });
// //       return;
// //     }

// //     setSavingMarks(true);
// //     setSaveStatus(null);

// //     try {
// //       const payload = {
// //         unqUserObjectId: userData._id,
// //         userId: userData._id,
// //         marks: marksPayload,
// //         // mark the test submitted flag true on submit
// //         isTestSubmitted: true
// //       };
// //       const resp = await UpdateErpMarksService(payload);
// //       // update local state with returned data (if any)
// //       if (resp && resp.data) {
// //         setErpTestData(resp.data);
// //       } else if (resp && resp.status === "Ok" && resp.data) {
// //         setErpTestData(resp.data);
// //       } else {
// //         // if backend didn't return full object, refetch to get latest state (so isTestSubmitted is reflected)
// //         await fetchErptestObject();
// //       }
// //       setSaveStatus({ type: "success", message: "Marks saved to ERP successfully." });

// //       // Refresh the page after successful submission so everything reloads and shows updated state
// //       // This ensures the UI reflects latest data and any server-side changes.
// //       // We perform an immediate reload here.
// //       window.location.reload();
// //     } catch (err) {
// //       console.error("Error saving marks:", err);
// //       setSaveStatus({ type: "error", message: "Failed to save marks. Check console for details." });
// //     } finally {
// //       setSavingMarks(false);
// //     }
// //   };
// //   // --- END NEW ---

// //   // determine if test has been submitted (to disable links)
// //   const isSubmitted = Boolean(erpTestData && erpTestData[0] && erpTestData[0].marks && erpTestData[0].marks.isTestSubmitted === true);
// //   const marksSummary = calculateTotalMarks();

// //   return (
// //     <Container className="my-4">
// //       <div className="text-center mb-4">
// //         <h2 className="mb-3" style={{ 
// //           fontSize: "2.5rem", 
// //           fontWeight: "700", 
// //           color: "#2c3e50",
// //           textShadow: "2px 2px 4px rgba(0,0,0,0.1)" 
// //         }}>
// //           ERP Assessment Test
// //         </h2>
        
// //         <div style={{
// //           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //           borderRadius: "12px",
// //           padding: "20px",
// //           boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
// //           color: "white",
// //           marginBottom: "20px"
// //         }}>
// //           <Row className="text-center">
// //             <Col md={4}>
// //               <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Total Questions</div>
// //               <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{totalQuestions}</div>
// //             </Col>
// //             <Col md={4}>
// //               <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Answered</div>
// //               <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2ecc71" }}>{totalAnswered}</div>
// //             </Col>
// //             <Col md={4}>
// //               <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Remaining</div>
// //               <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e74c3c" }}>{totalQuestions - totalAnswered}</div>
// //             </Col>
// //           </Row>
// //         </div>

// //         {/* {isSubmitted && (
// //           <div style={{
// //             background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
// //             borderRadius: "12px",
// //             padding: "20px",
// //             boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
// //             color: "white",
// //             marginBottom: "20px"
// //           }}>
// //             <Row className="text-center">
// //               <Col md={6}>
// //                 <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Obtained Marks</div>
// //                 <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{marksSummary.obtained}</div>
// //               </Col>
// //               <Col md={6}>
// //                 <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Total Marks</div>
// //                 <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{marksSummary.total}</div>
// //               </Col>
// //             </Row>
// //             <div style={{ 
// //               fontSize: "1.3rem", 
// //               fontWeight: "bold", 
// //               marginTop: "10px",
// //               color: marksSummary.obtained >= marksSummary.total * 0.4 ? "#2ecc71" : "#e74c3c"
// //             }}>
// //               {marksSummary.obtained >= marksSummary.total * 0.4 ? "🎉 Passed" : "❌ Failed"}
// //             </div>
// //           </div>
// //         )} */}
// //       </div>

// //       {tasks.map((task) => {
// //         const completed = isTaskCompleted(task);
// //         return (
// //           <Card
// //             key={task.id}
// //             className="mb-4 shadow-lg"
// //             style={{
// //               borderLeft: completed ? "6px solid #27ae60" : "6px solid #95a5a6",
// //               transition: "0.3s",
// //               borderRadius: "12px",
// //               overflow: "hidden"
// //             }}
// //           >
// //             <Card.Body style={{ padding: "25px" }}>
// //               <Card.Title style={{ 
// //                 fontWeight: "700", 
// //                 fontSize: "1.3rem", 
// //                 color: "#2c3e50",
// //                 marginBottom: "15px",
// //                 fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //                 lineHeight: "1.6"
// //               }}>
// //                 {typeof task.question === "string" && task.question.trim().startsWith("<") ? (
// //                   <div
// //                     dangerouslySetInnerHTML={{ __html: `Question ${task.id}: ${task.question}` }}
// //                   />
// //                 ) : (
// //                   <div style={{ 
// //                     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //                     whiteSpace: "pre-wrap",
// //                     lineHeight: "1.6"
// //                   }}>
// //                     Question {task.id}: {task.question}
// //                   </div>
// //                 )}
// //               </Card.Title>
              
// //               {task.link && (
// //                 <p style={{ marginBottom: "15px" }}>
// //                   <a
// //                     href={(completed || isSubmitted) ? undefined : task.link}
// //                     rel="noopener noreferrer"
// //                     style={{
// //                       pointerEvents: (completed || isSubmitted) ? "none" : "auto",
// //                       opacity: (completed || isSubmitted) ? 0.6 : 1,
// //                       textDecoration: (completed || isSubmitted) ? "none" : "underline",
// //                       color: (completed || isSubmitted) ? "gray" : "#3498db",
// //                       cursor: (completed || isSubmitted) ? "not-allowed" : "pointer",
// //                       fontWeight: "600",
// //                       fontSize: "1rem",
// //                       padding: "8px 16px",
// //                       border: (completed || isSubmitted) ? "1px solid #bdc3c7" : "1px solid #3498db",
// //                       borderRadius: "6px",
// //                       display: "inline-block",
// //                       background: (completed || isSubmitted) ? "#ecf0f1" : "transparent",
// //                       transition: "all 0.3s ease"
// //                     }}
// //                     onMouseEnter={(e) => {
// //                       if (!completed && !isSubmitted) {
// //                         e.target.style.background = "#3498db";
// //                         e.target.style.color = "white";
// //                       }
// //                     }}
// //                     onMouseLeave={(e) => {
// //                       if (!completed && !isSubmitted) {
// //                         e.target.style.background = "transparent";
// //                         e.target.style.color = "#3498db";
// //                       }
// //                     }}
// //                   >
// //                     {task.label} (Marks: {task.marks ?? 1})
// //                   </a>
// //                 </p>
// //               )}
              
// //               <Card.Text style={{ 
// //                 fontSize: "1rem",
// //                 fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //                 lineHeight: "1.5"
// //               }}>
// //                 {renderTaskStatus(task)}
// //               </Card.Text>
// //             </Card.Body>
// //           </Card>
// //         );
// //       })}

// //       {/* SAVE UI (shows status + save button). Kept separate so original layout/markup isn't modified. */}
// //       <div style={{ 
// //         textAlign: "center", 
// //         marginTop: "30px", 
// //         marginBottom: "30px",
// //         padding: "20px",
// //         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
// //         borderRadius: "12px",
// //         color: "white"
// //       }}>
// //         {saveStatus && (
// //           <div style={{ marginBottom: "15px" }}>
// //             <strong style={{ 
// //               color: saveStatus.type === "success" ? "#2ecc71" : "#e74c3c",
// //               fontSize: "1.1rem"
// //             }}>
// //               {saveStatus.message}
// //             </strong>
// //           </div>
// //         )}
// //         <div>
// //           <button
// //             onClick={handleSaveMarks}
// //             disabled={savingMarks || !erpTestData || !erpTestData.length || isSubmitted}
// //             style={{
// //               padding: "12px 30px",
// //               borderRadius: "8px",
// //               border: "none",
// //               background: savingMarks ? "#95a5a6" : (isSubmitted ? "#27ae60" : "#e74c3c"),
// //               color: "#fff",
// //               cursor: (savingMarks || isSubmitted) ? "not-allowed" : "pointer",
// //               fontWeight: "600",
// //               fontSize: "1.1rem",
// //               transition: "all 0.3s ease",
// //               boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
// //             }}
// //             onMouseEnter={(e) => {
// //               if (!savingMarks && !isSubmitted) {
// //                 e.target.style.transform = "translateY(-2px)";
// //                 e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
// //               }
// //             }}
// //             onMouseLeave={(e) => {
// //               if (!savingMarks && !isSubmitted) {
// //                 e.target.style.transform = "translateY(0)";
// //                 e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
// //               }
// //             }}
// //           >
// //             {savingMarks ? "⏳ Saving..." : (isSubmitted ? "✅ Test Submitted" : "🚀 Submit Test")}
// //           </button>
// //         </div>
// //         {isSubmitted && (
// //           <div style={{ marginTop: "15px", fontSize: "0.9rem", opacity: 0.9 }}>
// //             Test has been submitted. You cannot make further changes.
// //           </div>
// //         )}
// //       </div>
// //     </Container>
// //   );
// // };




// import React, { useContext, useEffect, useState } from "react";
// import { Container, Card, Row, Col } from "react-bootstrap";
// import { GetErpTestByUnqUserObjectId } from "../../service/ErpTest.services";
// import { UserContext } from "../contextAPIs/User.context";
// import { UpdateErpMarksService } from "../../service/ErpTest.services";
// import { AnswerObject } from "./Answerr";

// export const ERPtest = () => {
//   console.log(AnswerObject)
//   const { userData } = useContext(UserContext);

//   const [erpTestData, setErpTestData] = useState([]);
//   const [savingMarks, setSavingMarks] = useState(false);
//   const [saveStatus, setSaveStatus] = useState(null);

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
//       label: "Click here to Attempt.",
//       marks: 0.5,
//     },
//     {
//       id: "02",
//       question: "Mark the attendance of students from classes 9 and 10, where Ajay and Jatin from class 09 are absent, and Samay and Anjali from class 10 are absent.",
//       link: "http://localhost:3000/user-dashboard",
//       field: "studentAttendanceCount",
//       label: "Click here to Attempt.",
//       marks: 2,
//     },
//     {
//       id: "03",
//       question: `<p><strong>Update the marks of students on ERP for the following:</strong></p>
//   <h4>For Class 09</h4>
//   <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 12px;">
//     <thead>
//       <tr>
//         <th style="text-align:left; padding:6px;">Name</th>
//         <th style="text-align:left; padding:6px;">Father</th>
//         <th style="text-align:left; padding:6px;">Obtained Marks</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr><td style="padding:6px;">Shubham</td><td style="padding:6px;">Shubhchandra</td><td style="padding:6px;">74</td></tr>
//       <tr><td style="padding:6px;">Ripudaman</td><td style="padding:6px;">Shubham</td><td style="padding:6px;">94</td></tr>
//       <tr><td style="padding:6px;">Sanjeev</td><td style="padding:6px;">Jeet</td><td style="padding:6px;">72</td></tr>
//       <tr><td style="padding:6px;">Ajay</td><td style="padding:6px;">Brijesh</td><td style="padding:6px;">Absent</td></tr>
//       <tr><td style="padding:6px;">Jatin</td><td style="padding:6px;">Raaj</td><td style="padding:6px;">87</td></tr>
//       <tr><td style="padding:6px;">Poshak</td><td style="padding:6px;">Shailesh</td><td style="padding:6px;">79</td></tr>
//       <tr><td style="padding:6px;">Anshu</td><td style="padding:6px;">Ajay</td><td style="padding:6px;">92</td></tr>
//       <tr><td style="padding:6px;">Gajendra</td><td style="padding:6px;">Arun</td><td style="padding:6px;">88</td></tr>
//       <tr><td style="padding:6px;">Vimal</td><td style="padding:6px;">Shyam</td><td style="padding:6px;">71</td></tr>
//       <tr><td style="padding:6px;">Madhu</td><td style="padding:6px;">Jagjeet</td><td style="padding:6px;">86</td></tr>
//     </tbody>
//   </table>
//   <h4 style="margin-top: 8px;">For Class 10</h4>
//   <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
//     <thead>
//       <tr>
//         <th style="text-align:left; padding:6px;">Name</th>
//         <th style="text-align:left; padding:6px;">Father</th>
//         <th style="text-align:left; padding:6px;">Obtained Marks</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr><td style="padding:6px;">Akhilesh</td><td style="padding:6px;">Chandu</td><td style="padding:6px;">98</td></tr>
//       <tr><td style="padding:6px;">Abhinesh</td><td style="padding:6px;">Ram</td><td style="padding:6px;">92</td></tr>
//       <tr><td style="padding:6px;">Akshay</td><td style="padding:6px;">Balraj</td><td style="padding:6px;">100</td></tr>
//       <tr><td style="padding:6px;">Samay</td><td style="padding:6px;">Deepak</td><td style="padding:6px;">Absent</td></tr>
//       <tr><td style="padding:6px;">Anjali</td><td style="padding:6px;">Rupesh</td><td style="padding:6px;">93</td></tr>
//       <tr><td style="padding:6px;">Rekha</td><td style="padding:6px;">Sandeep</td><td style="padding:6px;">83</td></tr>
//       <tr><td style="padding:6px;">Srishti</td><td style="padding:6px;">Jaiveer</td><td style="padding:6px;">97</td></tr>
//       <tr><td style="padding:6px;">Aayush</td><td style="padding:6px;">Uma</td><td style="padding:6px;">86</td></tr>
//       <tr><td style="padding:6px;">Jay</td><td style="padding:6px;">Shankar</td><td style="padding:6px;">93</td></tr>
//       <tr><td style="padding:6px;">Rohit</td><td style="padding:6px;">Raju</td><td style="padding:6px;">90</td></tr>
//     </tbody>
//   </table>`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "uploadMarksCount",
//       label: "Click here to Attempt.",
//       marks: 4,
//     },
//     {
//       id: "04",
//       question: `Please update the disciplinary records of the following students based on their recent behavior:
// For Class 09:
// Aalia – reported late to class.
// Ajay – absent for an entire week.
// For Class 10:
// 1. Aayush – caught using a mobile phone during class hours.
// 2. Abhinesh – engaged in talking during class.
// 3. Akhilesh – displayed disrespectful behavior and left the class without the teacher's permission.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "disciplinary",
//       label: "Click here to Attempt.",
//       marks: 2.5,
//     },
//     {
//       id: "05",
//       question: `Please update the Classwork Copy-Checking records for the following students as per their respective subjects:
// For Class 09:
// 1. Aalia: English – Complete, Hindi – Incomplete, Maths – Unavailable.
// 2. Ajay: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.
// For Class 10:
// 1. Aayush: English – Complete, Hindi – Incomplete, Science – Unavailable.
// 2. Abhinesh: English – Complete, Hindi – Incomplete, Maths – Unavailable.
// 3. Akhilesh: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "copyChecking",
//       label: "Click here to Attempt.",
//       marks: 2.5,
//     },
//     {
//       id: "06",
//       question: "Download the attendance PDF of class 9th.",
//       link: "http://localhost:3000/user-dashboard",
//       field: "downloadAttendancePdfFormat",
//       label: "Click here to Attempt.",
//       marks: 0.5,
//     },
//     {
//       id: "07",
//       question: "Upload the attendance pdf that was downloaded in question 6.",
//       link: "http://localhost:3000/user-dashboard",
//       field: "uploadAttendancePdfFormat",
//       label: "Click here to Attempt.",
//       marks: 0.5,
//     },
//     {
//       id: "08",
//       question: `Please raise school-related concerns on the ERP system for the following situations:
// For class 09:
// 1. Classes were interrupted due to a poor internet connection; raise a concern in the ERP about this issue.
// 2. Optional classes are not being conducted in your school; raise a concern in the ERP regarding this matter.
// 3. Question papers of students have not been checked; raise a concern in the ERP to report this issue.
// For class 10:
// 1. The school was unexpectedly closed today due to a sudden event; raise a concern in the ERP to record this.
// 2. A half-day was announced due to a specific event; raise a concern in the ERP regarding this.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "schoolConcern",
//       label: "Click here to Attempt.",
//       marks: 2.5,
//     },
//     {
//       id: "09",
//       question: `Raise Student-related concerns on the ERP for the following situations:
// For class 09:
// 1. A student's SLC (School Leaving Certificate) has been released, and the record needs to be removed from the ERP. Raise a concern to update the system accordingly.
// 2. A student's examination center has changed, but the ERP still shows the old center. Raise a concern regarding this center change.
// For class 10:      
// 1. The MB App is not working properly, and students are unable to log in or access their dashboards. Raise a concern on ERP regarding this issue.
// 2. A student's details need to be added to the ERP, but the record is not yet available in the system. Raise a concern on ERP to add the student.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "studentRelatedConncern",
//       label: "Click here to Attempt.",
//       marks: 2.5,
//     },
//     {
//       id: "10",
//       question: `Raise the Tech-related concerns on ERP for following classes and equipment:
// For class 09:
// 1. The smart classroom screen is not functioning properly in Class 9; raise a concern on ERP regarding the screen issue.
// 2. The inverter is not working, causing frequent power interruptions during lessons in Class 9; raise a concern on ERP about this problem.
// 3. The microphone in Class 9 is not operational, making it difficult for teacher to hear the students clearly; raise a concern on ERP to resolve this issue.
// For class 10:
// 1. The camera in Class 10's smart classroom is not working, preventing video sessions and monitoring; raise a concern about this issue on ERP.
// 2. The Mini PC used for teaching in Class 10 is not starting or frequently crashes; raise a concern on ERP to report this malfunction.
// 3. There is a power supply issue in Class 10 due to electricity fluctuations; raise a concern on ERP to get this resolved.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "techConcern",
//       label: "Click here to Attempt.",
//       marks: 3,
//     },
//     {
//       id: "11",
//       question: `Make the absentee calling to the students of class 9th and 10th who were absent in the class.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "absenteeCalling",
//       label: "Click here to Attempt.",
//       marks: 2,
//     },
//     {
//       id: "12",
//       question: `Please close the previously raised school-related concerns on the ERP system
// Each concern should be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:
// For Class 09:
// 1. Classes were interrupted due to a poor internet connection – Still Not Resolved.
// 2. Optional classes are not being conducted in your school – Still Not Resolved.
// 3. Question papers of students have not been checked – Resolved.
// For Class 10:
// 1. The school was unexpectedly closed today due to a sudden event – Resolved.
// 2. A half-day was announced due to a specific event – Resolved.
// Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "closeSchoolConcerns",
//       label: "Click here to Attempt.",
//       marks: 2.5,
//     },
//     {
//       id: "13",
//       question: `Please close the previously raised student-related concerns on the ERP system.
// Each concern should now be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:
// For Class 09:
// 1. A student's SLC (School Leaving Certificate) had been released, and the record needed to be removed from the ERP – Still Not Resolved.
// 2. A student's examination center had changed, but the ERP still showed the old center – Resolved.
// For Class 10:
// 1. The MB App was not working properly, and students were unable to log in or access their dashboards – Resolved.
// 2. A student's details needed to be added to the ERP, but the record was not available – Still Not Resolved.
// Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "closeStudentConcerns",
//       label: "Click here to Attempt.",
//       marks: 2.5,
//     },
//     {
//       id: "14",
//       question: `Please close the previously raised Tech-related concerns on the ERP system.
// Each concern should now be closed with the appropriate status — either Resolved or Still Not Resolved — as mentioned below:
// For Class 09:
// 1. The smart classroom screen was not functioning properly – Resolved.
// 2. The inverter was not working, causing frequent power interruptions – Still Not Resolved.
// 3. The microphone in Class 9 was not operational, making it difficult for the teacher to hear the students – Resolved.
// For Class 10:
// 1. The camera in Class 10's smart classroom was not working, preventing video sessions and monitoring – Resolved.
// 2. The Mini PC used for teaching in Class 10 was frequently crashing or not starting – Still Not Resolved.
// 3. The power supply issue in Class 10 due to electricity fluctuations – Resolved.
// Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
//       link: "http://localhost:3000/user-dashboard",
//       field: "closeTechConcerns",
//       label: "Click here to Attempt.",
//       marks: 3,
//     },
//   ];

//   const computeAttendanceScore = (attendanceObj) => {
//     if (!attendanceObj || typeof attendanceObj !== "object") return 0;
//     const totalCount = (attendanceObj.count9 || 0) + (attendanceObj.count10 || 0);
//     if (totalCount === 26) {
//       return 2;
//     } else if (totalCount > 0 && totalCount < 26) {
//       return 1;
//     } else {
//       return 0;
//     }
//   };

//   const class9Students = [
//     "Shubham", "Ripudaman", "Sanjeev", "Ajay", "Jatin", "Poshak", "Anshu", "Gajendra", "Vimal", "Madhu",
//   ];
//   const class10Students = [
//     "Akhilesh", "Abhinesh", "Akshay", "Samay", "Anjali", "Rekha", "Srishti", "Aayush", "Jay", "Rohit",
//   ];

//   const computeObjectFieldScore = (obj, expectedFieldCount, totalMarks) => {
//     if (!obj || typeof obj !== "object") return 0;
//     const actualFieldCount = Object.keys(obj).length;
//     if (actualFieldCount === expectedFieldCount) {
//       return totalMarks;
//     } else {
//       const difference = Math.abs(expectedFieldCount - actualFieldCount);
//       const penalty = difference * 0.5;
//       const score = Math.max(0, totalMarks - penalty);
//       return Math.round(score * 100) / 100;
//     }
//   };

//   const computeArrayFieldScore = (obj, arrayFieldName, expectedCount, totalMarks) => {
//     if (!obj || !obj[arrayFieldName] || !Array.isArray(obj[arrayFieldName])) return 0;
//     const actualCount = obj[arrayFieldName].length;
//     if (actualCount === expectedCount) {
//       return totalMarks;
//     } else {
//       const difference = Math.abs(expectedCount - actualCount);
//       const penalty = difference * 0.5;
//       const score = Math.max(0, totalMarks - penalty);
//       return Math.round(score * 100) / 100;
//     }
//   };

//   const computeDisciplinaryCopyScore = (obj, expectedFieldCount, totalMarks) => {
//     if (!obj || typeof obj !== "object") return 0;
//     const actualFieldCount = Object.keys(obj).length;
//     let validFields = 0;
//     Object.values(obj).forEach(value => {
//       if (value !== null && value !== undefined) {
//         if (Array.isArray(value)) {
//           const hasValidSubject = value.some(item => {
//             if (typeof item === 'object' && item !== null) {
//               return Object.values(item).some(val => val !== null && val !== undefined);
//             }
//             return item !== null && item !== undefined;
//           });
//           if (hasValidSubject) validFields++;
//         } else {
//           validFields++;
//         }
//       }
//     });
//     if (actualFieldCount === expectedFieldCount && validFields === expectedFieldCount) {
//       return totalMarks;
//     } else {
//       const fieldDifference = Math.abs(expectedFieldCount - actualFieldCount);
//       const nullPenalty = Math.abs(expectedFieldCount - validFields);
//       const totalPenalty = (fieldDifference + nullPenalty) * 0.5;
//       const score = Math.max(0, totalMarks - totalPenalty);
//       return Math.round(score * 100) / 100;
//     }
//   };

//   const computeTaskScore = (task, data) => {
//     if (!task || !data) return 0;
//     const value = data[task.field];
//     const totalMarks = Number(task.marks ?? 1);

//     if (task.field === "studentAttendanceCount") {
//       return computeAttendanceScore(value);
//     }

//     if (task.field === "uploadMarksCount") {
//       if (value === 0 || !value || (typeof value === "object" && Object.keys(value).length === 0)) {
//         return 0;
//       }
//       const uploads = value && typeof value === "object" ? value : {};
//       const class9TotalMarks = 2;
//       const class10TotalMarks = 2;
//       const class9Count = class9Students.length;
//       const class10Count = class10Students.length;
//       const perStudent9 = class9TotalMarks / class9Count;
//       const perStudent10 = class10TotalMarks / class10Count;

//       const obtainedMap = {
//         Shubham: "74", Ripudaman: "94", Sanjeev: "72", Ajay: "Absent", Jatin: "87",
//         Poshak: "79", Anshu: "92", Gajendra: "88", Vimal: "71", Madhu: "86",
//         Akhilesh: "98", Abhinesh: "92", Akshay: "100", Samay: "Absent", Anjali: "93",
//         Rekha: "83", Srishti: "97", Aayush: "86", Jay: "93", Rohit: "90",
//       };

//       let awarded9 = 0;
//       let penalty = 0;
//       class9Students.forEach((s) => {
//         if (Number(uploads[s]) === 1) {
//           if (String(obtainedMap[s]).toLowerCase() === "absent") {
//             penalty += 0.5;
//           } else {
//             awarded9 += perStudent9;
//           }
//         } else if (s === "Ajay" && Number(uploads[s]) === 0) {
//           awarded9 += 0.2;
//         }
//       });

//       let awarded10 = 0;
//       class10Students.forEach((s) => {
//         if (Number(uploads[s]) === 1) {
//           if (String(obtainedMap[s]).toLowerCase() === "absent") {
//             penalty += 0.5;
//           } else {
//             awarded10 += perStudent10;
//           }
//         } else if (s === "Samay" && Number(uploads[s]) === 0) {
//           awarded10 += 0.2;
//         }
//       });

//       let totalAwarded = Math.round((awarded9 + awarded10 - penalty) * 100) / 100;
//       if (totalAwarded > totalMarks) totalAwarded = totalMarks;
//       return totalAwarded;
//     }

//     if (task.field === "disciplinary") {
//       return computeDisciplinaryCopyScore(value, 5, totalMarks);
//     }

//     if (task.field === "copyChecking") {
//       return computeDisciplinaryCopyScore(value, 5, totalMarks);
//     }

//     if (task.field === "schoolConcern") {
//       return computeArrayFieldScore(value, "concerns", 5, totalMarks);
//     }

//     if (task.field === "studentRelatedConncern") {
//       if (!value || !value.concerns || !Array.isArray(value.concerns) || value.concerns.length === 0) {
//         return 0;
//       }
//       return computeArrayFieldScore(value, "concerns", 4, totalMarks);
//     }

//     if (task.field === "techConcern") {
//       return computeArrayFieldScore(value, "concerns", 6, totalMarks);
//     }

//     if (task.field === "closeSchoolConcerns") {
//       return computeArrayFieldScore(value, "concerns", 5, totalMarks);
//     }

//     if (task.field === "closeStudentConcerns") {
//       if (!value || !value.concerns || !Array.isArray(value.concerns) || value.concerns.length === 0) {
//         return 0;
//       }
//       return computeArrayFieldScore(value, "concerns", 4, totalMarks);
//     }

//     if (task.field === "closeTechConcerns") {
//       return computeArrayFieldScore(value, "concerns", 6, totalMarks);
//     }

//     if (typeof value === "boolean") {
//       return value === true ? totalMarks : 0;
//     }

//     if (typeof value === "number") {
//       const valNum = value;
//       const maxCount = 10;
//       const proportion = Math.min(valNum / maxCount, 1);
//       const score = Math.round(proportion * totalMarks * 100) / 100;
//       return score;
//     }

//     if (typeof value === "object" && value !== null) {
//       const keys = Object.keys(value);
//       if (keys.length === 0) return 0;
//       let filled = 0;
//       keys.forEach((k) => {
//         const v = value[k];
//         if (Array.isArray(v)) {
//           const anyFilled = v.some((entry) => {
//             if (entry === null) return false;
//             if (typeof entry === "object") {
//               return Object.values(entry).some((ev) => ev !== null && ev !== undefined);
//             }
//             return entry !== null && entry !== undefined;
//           });
//           if (anyFilled) filled++;
//         } else if (k.toLowerCase().includes("concern") && v && Array.isArray(v.concerns)) {
//           const arr = v.concerns;
//           if (!arr || arr.length === 0) {
//           } else {
//             let nonWrong = 0;
//             arr.forEach((c) => {
//               const isWrong =
//                 (c && typeof c === "object" && (c.isWrong === true || String(c.status).toLowerCase().includes("wrong") || String(c.result).toLowerCase().includes("incorrect")));
//               if (!isWrong) nonWrong++;
//             });
//             const proportion = nonWrong / arr.length;
//             const score = Math.round(proportion * totalMarks * 100) / 100;
//             return score;
//           }
//         } else {
//           if (v !== null && v !== undefined && !(typeof v === "object" && Object.keys(v).length === 0)) {
//             filled++;
//           }
//         }
//       });
//       const proportion = filled / keys.length;
//       const score = Math.round(proportion * totalMarks * 100) / 100;
//       return score;
//     }

//     return 0;
//   };

//   const isTaskCompleted = (task) => {
//     if (!erpTestData.length) return false;
//     const data = erpTestData[0];
//     const earned = computeTaskScore(task, data);
//     const full = Number(task.marks ?? 1);
//     return Math.abs(earned - full) < 0.0001;
//   };

//   const renderTaskStatus = (task) => {
//     if (!erpTestData.length) {
//       return (
//         <span style={{ color: "gray", fontWeight: "bold" }}>
//           Answer: Loading...
//         </span>
//       );
//     }

//     const data = erpTestData[0];
//     const value = data[task.field];
//     const totalMarks = Number(task.marks ?? 1);
//     const earned = computeTaskScore(task, data);
//     const testSubmitted = Boolean(data.marks && data.marks.isTestSubmitted === true);

//     if (task.field === "studentAttendanceCount") {
//       return (
//         <div>
//           {testSubmitted && (
//             <div style={{ fontWeight: "600", marginBottom: "8px" }}>
//               Marks: {earned}/{totalMarks}
//             </div>
//           )}
//           <div style={{ marginTop: 6 }}>
//             <div style={{ fontSize: 13 }}>
//               Count 9: {value?.count9 || 0}, Count 10: {value?.count10 || 0}, Total: {(value?.count9 || 0) + (value?.count10 || 0)}
//             </div>
//           </div>
//           <div style={{ marginTop: 8, fontWeight: "700", color: earned > 0 ? "green" : "red" }}>
//             {earned > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
//           </div>
//         </div>
//       );
//     }

//     if (task.id === "03") {
//       const uploads = value && typeof value === "object" ? value : {};
//       const class9TotalMarks = 2;
//       const class10TotalMarks = 2;
//       const class9Count = class9Students.length;
//       const class10Count = class10Students.length;
//       const perStudent9 = Math.round((class9TotalMarks / class9Count) * 100) / 100;
//       const perStudent10 = Math.round((class10TotalMarks / class10Count) * 100) / 100;

//       const obtainedMap = {
//         Shubham: "74", Ripudaman: "94", Sanjeev: "72", Ajay: "Absent", Jatin: "87",
//         Poshak: "79", Anshu: "92", Gajendra: "88", Vimal: "71", Madhu: "86",
//         Akhilesh: "98", Abhinesh: "92", Akshay: "100", Samay: "Absent", Anjali: "93",
//         Rekha: "83", Srishti: "97", Aayush: "86", Jay: "93", Rohit: "90",
//       };

//       const rows9 = class9Students.map((s) => {
//         const raw = Number(uploads[s]) || 0;
//         let awarded = 0;
//         let penalty = 0;
        
//         if (raw === 1) {
//           if (String(obtainedMap[s]).toLowerCase() !== "absent") {
//             awarded = perStudent9;
//           } else {
//             penalty = 0.5;
//           }
//         } else if (s === "Ajay" && raw === 0) {
//           awarded = 0.2;
//         }
        
//         return { name: s, raw, awarded, penalty, obtained: obtainedMap[s] || "" };
//       });

//       const rows10 = class10Students.map((s) => {
//         const raw = Number(uploads[s]) || 0;
//         let awarded = 0;
//         let penalty = 0;
        
//         if (raw === 1) {
//           if (String(obtainedMap[s]).toLowerCase() !== "absent") {
//             awarded = perStudent10;
//           } else {
//             penalty = 0.5;
//           }
//         } else if (s === "Samay" && raw === 0) {
//           awarded = 0.2;
//         }
        
//         return { name: s, raw, awarded, penalty, obtained: obtainedMap[s] || "" };
//       });

//       const sumAwarded = rows9.reduce((a, r) => a + r.awarded, 0) + rows10.reduce((a, r) => a + r.awarded, 0);
//       const sumPenalty = rows9.reduce((a, r) => a + r.penalty, 0) + rows10.reduce((a, r) => a + r.penalty, 0);
//       const totalAwarded = Math.round((sumAwarded - sumPenalty) * 100) / 100;

//       return (
//         <div>
//           <div dangerouslySetInnerHTML={{ __html: `<p><strong>Update the marks of students on ERP for the following:</strong></p>` }} />
//           <div style={{ marginTop: 6 }}>
//             <h4>For Class 09</h4>
//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }} border="1" cellPadding="6" cellSpacing="0">
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: "left", padding: 6 }}>Name</th>
//                   <th style={{ textAlign: "left", padding: 6 }}>Father</th>
//                   <th style={{ textAlign: "left", padding: 6 }}>Obtained Marks</th>
//                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Upload Status</th>}
//                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>ERP Marks</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows9.map((r) => {
//                   const fatherMap = {
//                     Shubham: "Shubhchandra", Ripudaman: "Shubham", Sanjeev: "Jeet", Ajay: "Brijesh",
//                     Jatin: "Raaj", Poshak: "Shailesh", Anshu: "Ajay", Gajendra: "Arun",
//                     Vimal: "Shyam", Madhu: "Jagjeet",
//                   };
//                   const obtainedMapLocal = {
//                     Shubham: "74", Ripudaman: "94", Sanjeev: "72", Ajay: "Absent", Jatin: "87",
//                     Poshak: "79", Anshu: "92", Gajendra: "88", Vimal: "71", Madhu: "86",
//                   };
//                   return (
//                     <tr key={r.name}>
//                       <td style={{ padding: 6 }}>{r.name}</td>
//                       <td style={{ padding: 6 }}>{fatherMap[r.name]}</td>
//                       <td style={{ padding: 6 }}>{obtainedMapLocal[r.name]}</td>
//                       {testSubmitted && (
//                         <td style={{ padding: 6 }}>
//                           {r.raw === 1 ? "✅ Uploaded" : "❌ Not Uploaded"}
//                         </td>
//                       )}
//                       {testSubmitted && (
//                         <td style={{ padding: 6 }}>
//                           {r.awarded}
//                           {r.penalty ? `  (Penalty: -${r.penalty})` : ""}
//                         </td>
//                       )}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           <div style={{ marginTop: 8 }}>
//             <h4>For Class 10</h4>
//             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }} border="1" cellPadding="6" cellSpacing="0">
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: "left", padding: 6 }}>Name</th>
//                   <th style={{ textAlign: "left", padding: 6 }}>Father</th>
//                   <th style={{ textAlign: "left", padding: 6 }}>Obtained Marks</th>
//                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Upload Status</th>}
//                   {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Erp Marks</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows10.map((r) => {
//                   const fatherMap10 = {
//                     Akhilesh: "Chandu", Abhinesh: "Ram", Akshay: "Balraj", Samay: "Deepak",
//                     Anjali: "Rupesh", Rekha: "Sandeep", Srishti: "Jaiveer", Aayush: "Uma",
//                     Jay: "Shankar", Rohit: "Raju",
//                   };
//                   const obtainedMap10 = {
//                     Akhilesh: "98", Abhinesh: "92", Akshay: "100", Samay: "Absent", Anjali: "93",
//                     Rekha: "83", Srishti: "97", Aayush: "86", Jay: "93", Rohit: "90",
//                   };
//                   return (
//                     <tr key={r.name}>
//                       <td style={{ padding: 6 }}>{r.name}</td>
//                       <td style={{ padding: 6 }}>{fatherMap10[r.name]}</td>
//                       <td style={{ padding: 6 }}>{obtainedMap10[r.name]}</td>
//                       {testSubmitted && (
//                         <td style={{ padding: 6 }}>
//                           {r.raw === 1 ? "✅ Uploaded" : "❌ Not Uploaded"}
//                         </td>
//                       )}
//                       {testSubmitted && (
//                         <td style={{ padding: 6 }}>
//                           {r.awarded}
//                           {r.penalty ? `  (Penalty: -${r.penalty})` : ""}
//                         </td>
//                       )}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           {testSubmitted && (
//             <div style={{ marginTop: 8, fontWeight: 600 }}>
//               Mark: {totalAwarded}/{task.marks}
//             </div>
//           )}
//           <div style={{ marginTop: 8, fontWeight: "700", color: totalAwarded > 0 ? "green" : "red" }}>
//             {totalAwarded > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
//           </div>
//         </div>
//       );
//     }

//     const fieldCountTasks = ["disciplinary", "copyChecking", "schoolConcern", "studentRelatedConncern", "techConcern", "closeSchoolConcerns", "closeStudentConcerns", "closeTechConcerns"];
//     if (fieldCountTasks.includes(task.field)) {
//       let expectedCount = 0;
//       let actualCount = 0;
//       let validFields = 0;
      
//       if (task.field === "disciplinary" || task.field === "copyChecking") {
//         expectedCount = 5;
//         actualCount = value && typeof value === "object" ? Object.keys(value).length : 0;
//         if (value && typeof value === "object") {
//           Object.values(value).forEach(fieldValue => {
//             if (fieldValue !== null && fieldValue !== undefined) {
//               if (Array.isArray(fieldValue)) {
//                 const hasValidSubject = fieldValue.some(item => {
//                   if (typeof item === 'object' && item !== null) {
//                     return Object.values(item).some(val => val !== null && val !== undefined);
//                   }
//                   return item !== null && item !== undefined;
//                 });
//                 if (hasValidSubject) validFields++;
//               } else {
//                 validFields++;
//               }
//             }
//           });
//         }
//       } else {
//         switch(task.field) {
//           case "schoolConcern":
//           case "closeSchoolConcerns":
//             expectedCount = 5;
//             break;
//           case "studentRelatedConncern":
//           case "closeStudentConcerns":
//             expectedCount = 4;
//             break;
//           case "techConcern":
//           case "closeTechConcerns":
//             expectedCount = 6;
//             break;
//           default:
//             expectedCount = 0;
//         }
//         actualCount = value && value.concerns && Array.isArray(value.concerns) ? value.concerns.length : 0;
//         validFields = actualCount;
//       }

//       const difference = Math.abs(expectedCount - actualCount);
//       const nullDifference = (task.field === "disciplinary" || task.field === "copyChecking") ? Math.abs(expectedCount - validFields) : 0;
//       const totalPenalty = (difference + nullDifference) * 0.5;

//       return (
//         <div>
//           {testSubmitted && (
//             <div style={{ fontWeight: "600", marginBottom: "8px" }}>
//               Marks: {earned}/{totalMarks}
//             </div>
//           )}
//           <div style={{ marginTop: 6 }}>
//             <div style={{ fontSize: 13 }}>
//               Expected {expectedCount} {task.field.includes("Concern") ? "concerns" : "fields"}, Found: {actualCount}
//               {(task.field === "disciplinary" || task.field === "copyChecking") && (
//                 <>, Valid (non-null): {validFields}</>
//               )}
//             </div>
//           </div>
//           <div style={{ marginTop: 8, fontWeight: "700", color: earned > 0 ? "green" : "red" }}>
//             {earned > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
//           </div>
//         </div>
//       );
//     }

//     const isAttempted = earned > 0;

//     if (isAttempted) {
//       return (
//         <div>
//           <span style={{ color: "green", fontWeight: "bold" }}>
//             ✅ Answer: Attempted
//           </span>
//           {testSubmitted && (
//             <>
//               <br />
//               <span style={{ color: "green", fontWeight: "bold" }}>Score: {earned}/{totalMarks}</span>
//             </>
//           )}
//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <span style={{ color: "red", fontWeight: "bold" }}>
//             ❌ Answer: Not Attempted
//           </span>
//           {testSubmitted && (
//             <>
//               <br />
//               <span style={{ color: "gray", fontWeight: "bold" }}>Score: {earned}/{totalMarks}</span>
//             </>
//           )}
//         </div>
//       );
//     }
//   };

//   const totalQuestions = tasks.length;
//   const totalAnswered = tasks.filter((t) => isTaskCompleted(t)).length;

//   const calculateTotalMarks = () => {
//     if (!erpTestData.length) return { obtained: 0, total: 0 };
//     const data = erpTestData[0];
//     let obtained = 0;
//     let total = 0;
    
//     tasks.forEach(task => {
//       const earned = computeTaskScore(task, data);
//       obtained += earned;
//       total += Number(task.marks ?? 1);
//     });
    
//     return { obtained: Math.round(obtained * 100) / 100, total };
//   };

//   const buildMarksPayload = () => {
//     if (!erpTestData || !erpTestData.length) return null;
//     const data = erpTestData[0];
//     const marks = {};
//     for (let i = 0; i < 14; i++) {
//       const t = tasks[i];
//       const qKey = `q${i + 1}`;
//       if (t) {
//         marks[qKey] = computeTaskScore(t, data);
//       } else {
//         marks[qKey] = 0;
//       }
//     }
//     return marks;
//   };

//   const handleSaveMarks = async () => {
//     if (!erpTestData || !erpTestData.length) {
//       setSaveStatus({ type: "error", message: "No ERP data available to compute marks." });
//       return;
//     }
//     const marksPayload = buildMarksPayload();
//     if (!marksPayload) {
//       setSaveStatus({ type: "error", message: "Unable to build marks payload." });
//       return;
//     }

//     setSavingMarks(true);
//     setSaveStatus(null);

//     try {
//       const payload = {
//         unqUserObjectId: userData._id,
//         userId: userData._id,
//         marks: marksPayload,
//         isTestSubmitted: true
//       };
//       const resp = await UpdateErpMarksService(payload);
//       if (resp && resp.data) {
//         setErpTestData(resp.data);
//       } else if (resp && resp.status === "Ok" && resp.data) {
//         setErpTestData(resp.data);
//       } else {
//         await fetchErptestObject();
//       }
//       setSaveStatus({ type: "success", message: "Marks saved to ERP successfully." });
//       window.location.reload();
//     } catch (err) {
//       console.error("Error saving marks:", err);
//       setSaveStatus({ type: "error", message: "Failed to save marks. Check console for details." });
//     } finally {
//       setSavingMarks(false);
//     }
//   };

//   const isSubmitted = Boolean(erpTestData && erpTestData[0] && erpTestData[0].marks && erpTestData[0].marks.isTestSubmitted === true);
//   const marksSummary = calculateTotalMarks();

//   return (
//     <Container className="my-4">
//       <div className="text-center mb-4">
//         <h2 className="mb-3" style={{ 
//           fontSize: "2.5rem", 
//           fontWeight: "700", 
//           color: "#2c3e50",
//           textShadow: "2px 2px 4px rgba(0,0,0,0.1)" 
//         }}>
//           ERP Assessment Test
//         </h2>
        
//         <div style={{
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           borderRadius: "12px",
//           padding: "20px",
//           boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
//           color: "white",
//           marginBottom: "20px"
//         }}>
//           <Row className="text-center">
//             <Col md={4}>
//               <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Total Questions</div>
//               <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{totalQuestions}</div>
//             </Col>
//             <Col md={4}>
//               <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Answered</div>
//               <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2ecc71" }}>{totalAnswered}</div>
//             </Col>
//             <Col md={4}>
//               <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Remaining</div>
//               <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e74c3c" }}>{totalQuestions - totalAnswered}</div>
//             </Col>
//           </Row>
//         </div>
//       </div>

//       {tasks.map((task) => {
//         const completed = isTaskCompleted(task);
//         return (
//           <Card
//             key={task.id}
//             className="mb-4 shadow-lg"
//             style={{
//               borderLeft: completed ? "6px solid #27ae60" : "6px solid #95a5a6",
//               transition: "0.3s",
//               borderRadius: "12px",
//               overflow: "hidden"
//             }}
//           >
//             <Card.Body style={{ padding: "25px" }}>
//               <Card.Title style={{ 
//                 fontWeight: "700", 
//                 fontSize: "1.3rem", 
//                 color: "#2c3e50",
//                 marginBottom: "15px",
//                 fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//                 lineHeight: "1.6"
//               }}>
//                 {typeof task.question === "string" && task.question.trim().startsWith("<") ? (
//                   <div
//                     dangerouslySetInnerHTML={{ __html: `Question ${task.id}: ${task.question}` }}
//                   />
//                 ) : (
//                   <div style={{ 
//                     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//                     whiteSpace: "pre-wrap",
//                     lineHeight: "1.6"
//                   }}>
//                     Question {task.id}: {task.question}
//                   </div>
//                 )}
//               </Card.Title>
              
//               {task.link && (
//                 <p style={{ marginBottom: "15px" }}>
//                   <a
//                     href={(completed || isSubmitted) ? undefined : task.link}
//                     rel="noopener noreferrer"
//                     style={{
//                       pointerEvents: (completed || isSubmitted) ? "none" : "auto",
//                       opacity: (completed || isSubmitted) ? 0.6 : 1,
//                       textDecoration: (completed || isSubmitted) ? "none" : "underline",
//                       color: (completed || isSubmitted) ? "gray" : "#3498db",
//                       cursor: (completed || isSubmitted) ? "not-allowed" : "pointer",
//                       fontWeight: "600",
//                       fontSize: "1rem",
//                       padding: "8px 16px",
//                       border: (completed || isSubmitted) ? "1px solid #bdc3c7" : "1px solid #3498db",
//                       borderRadius: "6px",
//                       display: "inline-block",
//                       background: (completed || isSubmitted) ? "#ecf0f1" : "transparent",
//                       transition: "all 0.3s ease"
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!completed && !isSubmitted) {
//                         e.target.style.background = "#3498db";
//                         e.target.style.color = "white";
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!completed && !isSubmitted) {
//                         e.target.style.background = "transparent";
//                         e.target.style.color = "#3498db";
//                       }
//                     }}
//                   >
//                     {task.label} (Marks: {task.marks ?? 1})
//                   </a>
//                 </p>
//               )}
              
//               <Card.Text style={{ 
//                 fontSize: "1rem",
//                 fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//                 lineHeight: "1.5"
//               }}>
//                 {renderTaskStatus(task)}
//               </Card.Text>
//             </Card.Body>
//           </Card>
//         );
//       })}

//       <div style={{ 
//         textAlign: "center", 
//         marginTop: "30px", 
//         marginBottom: "30px",
//         padding: "20px",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         borderRadius: "12px",
//         color: "white"
//       }}>
//         {saveStatus && (
//           <div style={{ marginBottom: "15px" }}>
//             <strong style={{ 
//               color: saveStatus.type === "success" ? "#2ecc71" : "#e74c3c",
//               fontSize: "1.1rem"
//             }}>
//               {saveStatus.message}
//             </strong>
//           </div>
//         )}
//         <div>
//           <button
//             onClick={handleSaveMarks}
//             disabled={savingMarks || !erpTestData || !erpTestData.length || isSubmitted}
//             style={{
//               padding: "12px 30px",
//               borderRadius: "8px",
//               border: "none",
//               background: savingMarks ? "#95a5a6" : (isSubmitted ? "#27ae60" : "#e74c3c"),
//               color: "#fff",
//               cursor: (savingMarks || isSubmitted) ? "not-allowed" : "pointer",
//               fontWeight: "600",
//               fontSize: "1.1rem",
//               transition: "all 0.3s ease",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
//             }}
//             onMouseEnter={(e) => {
//               if (!savingMarks && !isSubmitted) {
//                 e.target.style.transform = "translateY(-2px)";
//                 e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!savingMarks && !isSubmitted) {
//                 e.target.style.transform = "translateY(0)";
//                 e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
//               }
//             }}
//           >
//             {savingMarks ? "⏳ Saving..." : (isSubmitted ? "✅ Test Submitted" : "🚀 Submit Test")}
//           </button>
//         </div>
//         {isSubmitted && (
//           <div style={{ marginTop: "15px", fontSize: "0.9rem", opacity: 0.9 }}>
//             Test has been submitted. You cannot make further changes.
//           </div>
//         )}
//       </div>
//     </Container>
//   );
// };




















import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { GetErpTestByUnqUserObjectId } from "../../service/ErpTest.services";
import { UserContext } from "../contextAPIs/User.context";
import { UpdateErpMarksService } from "../../service/ErpTest.services";
import { AnswerObject } from "./Answerr";

export const ERPtest = () => {
  console.log(AnswerObject)
  const { userData } = useContext(UserContext);

  const [erpTestData, setErpTestData] = useState([]);
  const [savingMarks, setSavingMarks] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

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
      label: "Click here to Attempt.",
      marks: 0.5,
    },
    {
      id: "02",
      question: "Mark the attendance of students from classes 9 and 10, where Ajay and Jatin from class 09 are absent, and Samay and Anjali from class 10 are absent.",
      link: "http://localhost:3000/user-dashboard",
      field: "studentAttendanceCount",
      label: "Click here to Attempt.",
      marks: 2,
    },
    {
      id: "03",
      question: `<p><strong>Update the marks of students on ERP for the following:</strong></p>
  <h4>For Class 09</h4>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="text-align:left; padding:6px;">Name</th>
        <th style="text-align:left; padding:6px;">Father</th>
        <th style="text-align:left; padding:6px;">Obtained Marks</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:6px;">Shubham</td><td style="padding:6px;">Shubhchandra</td><td style="padding:6px;">74</td></tr>
      <tr><td style="padding:6px;">Ripudaman</td><td style="padding:6px;">Shubham</td><td style="padding:6px;">94</td></tr>
      <tr><td style="padding:6px;">Sanjeev</td><td style="padding:6px;">Jeet</td><td style="padding:6px;">72</td></tr>
      <tr><td style="padding:6px;">Ajay</td><td style="padding:6px;">Brijesh</td><td style="padding:6px;">Absent</td></tr>
      <tr><td style="padding:6px;">Jatin</td><td style="padding:6px;">Raaj</td><td style="padding:6px;">87</td></tr>
      <tr><td style="padding:6px;">Poshak</td><td style="padding:6px;">Shailesh</td><td style="padding:6px;">79</td></tr>
      <tr><td style="padding:6px;">Anshu</td><td style="padding:6px;">Ajay</td><td style="padding:6px;">92</td></tr>
      <tr><td style="padding:6px;">Gajendra</td><td style="padding:6px;">Arun</td><td style="padding:6px;">88</td></tr>
      <tr><td style="padding:6px;">Vimal</td><td style="padding:6px;">Shyam</td><td style="padding:6px;">71</td></tr>
      <tr><td style="padding:6px;">Madhu</td><td style="padding:6px;">Jagjeet</td><td style="padding:6px;">86</td></tr>
    </tbody>
  </table>
  <h4 style="margin-top: 8px;">For Class 10</h4>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr>
        <th style="text-align:left; padding:6px;">Name</th>
        <th style="text-align:left; padding:6px;">Father</th>
        <th style="text-align:left; padding:6px;">Obtained Marks</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="padding:6px;">Akhilesh</td><td style="padding:6px;">Chandu</td><td style="padding:6px;">98</td></tr>
      <tr><td style="padding:6px;">Abhinesh</td><td style="padding:6px;">Ram</td><td style="padding:6px;">92</td></tr>
      <tr><td style="padding:6px;">Akshay</td><td style="padding:6px;">Balraj</td><td style="padding:6px;">100</td></tr>
      <tr><td style="padding:6px;">Samay</td><td style="padding:6px;">Deepak</td><td style="padding:6px;">Absent</td></tr>
      <tr><td style="padding:6px;">Anjali</td><td style="padding:6px;">Rupesh</td><td style="padding:6px;">93</td></tr>
      <tr><td style="padding:6px;">Rekha</td><td style="padding:6px;">Sandeep</td><td style="padding:6px;">83</td></tr>
      <tr><td style="padding:6px;">Srishti</td><td style="padding:6px;">Jaiveer</td><td style="padding:6px;">97</td></tr>
      <tr><td style="padding:6px;">Aayush</td><td style="padding:6px;">Uma</td><td style="padding:6px;">86</td></tr>
      <tr><td style="padding:6px;">Jay</td><td style="padding:6px;">Shankar</td><td style="padding:6px;">93</td></tr>
      <tr><td style="padding:6px;">Rohit</td><td style="padding:6px;">Raju</td><td style="padding:6px;">90</td></tr>
    </tbody>
  </table>`,
      link: "http://localhost:3000/user-dashboard",
      field: "uploadMarksCount",
      label: "Click here to Attempt.",
      marks: 4,
    },
    {
      id: "04",
      question: `Please update the disciplinary records of the following students based on their recent behavior:
For Class 09:
Aalia – reported late to class.
Ajay – absent for an entire week.
For Class 10:
1. Aayush – caught using a mobile phone during class hours.
2. Abhinesh – engaged in talking during class.
3. Akhilesh – displayed disrespectful behavior and left the class without the teacher's permission.`,
      link: "http://localhost:3000/user-dashboard",
      field: "disciplinary",
      label: "Click here to Attempt.",
      marks: 2.5,
    },
    {
      id: "05",
      question: `Please update the Classwork Copy-Checking records for the following students as per their respective subjects:
For Class 09:
1. Aalia: English – Complete, Hindi – Incomplete, Maths – Unavailable.
2. Ajay: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.
For Class 10:
1. Aayush: English – Complete, Hindi – Incomplete, Science – Unavailable.
2. Abhinesh: English – Complete, Hindi – Incomplete, Maths – Unavailable.
3. Akhilesh: English – Incomplete, Hindi – Complete, Maths – Unavailable, Science – Complete, Social Studies – Complete.`,
      link: "http://localhost:3000/user-dashboard",
      field: "copyChecking",
      label: "Click here to Attempt.",
      marks: 2.5,
    },
    {
      id: "06",
      question: "Download the attendance PDF of class 9th.",
      link: "http://localhost:3000/user-dashboard",
      field: "downloadAttendancePdfFormat",
      label: "Click here to Attempt.",
      marks: 0.5,
    },
    {
      id: "07",
      question: "Upload the attendance pdf that was downloaded in question 6.",
      link: "http://localhost:3000/user-dashboard",
      field: "uploadAttendancePdfFormat",
      label: "Click here to Attempt.",
      marks: 0.5,
    },
    {
      id: "08",
      question: `Please raise school-related concerns on the ERP system for the following situations:
For class 09:
1. Classes were interrupted due to a poor internet connection; raise a concern in the ERP about this issue.
2. Optional classes are not being conducted in your school; raise a concern in the ERP regarding this matter.
3. Question papers of students have not been checked; raise a concern in the ERP to report this issue.
For class 10:
1. The school was unexpectedly closed today due to a sudden event; raise a concern in the ERP to record this.
2. A half-day was announced due to a specific event; raise a concern in the ERP regarding this.`,
      link: "http://localhost:3000/user-dashboard",
      field: "schoolConcern",
      label: "Click here to Attempt.",
      marks: 2.5,
    },
    {
      id: "09",
      question: `Raise Student-related concerns on the ERP for the following situations:
For class 09:
1. A student's SLC (School Leaving Certificate) has been released, and the record needs to be removed from the ERP. Raise a concern to update the system accordingly.
2. A student's examination center has changed, but the ERP still shows the old center. Raise a concern regarding this center change.
For class 10:      
1. The MB App is not working properly, and students are unable to log in or access their dashboards. Raise a concern on ERP regarding this issue.
2. A student's details need to be added to the ERP, but the record is not yet available in the system. Raise a concern on ERP to add the student.`,
      link: "http://localhost:3000/user-dashboard",
      field: "studentRelatedConncern",
      label: "Click here to Attempt.",
      marks: 2.5,
    },
    {
      id: "10",
      question: `Raise the Tech-related concerns on ERP for following classes and equipment:
For class 09:
1. The smart classroom screen is not functioning properly in Class 9; raise a concern on ERP regarding the screen issue.
2. The inverter is not working, causing frequent power interruptions during lessons in Class 9; raise a concern on ERP about this problem.
3. The microphone in Class 9 is not operational, making it difficult for teacher to hear the students clearly; raise a concern on ERP to resolve this issue.
For class 10:
1. The camera in Class 10's smart classroom is not working, preventing video sessions and monitoring; raise a concern about this issue on ERP.
2. The Mini PC used for teaching in Class 10 is not starting or frequently crashes; raise a concern on ERP to report this malfunction.
3. There is a power supply issue in Class 10 due to electricity fluctuations; raise a concern on ERP to get this resolved.`,
      link: "http://localhost:3000/user-dashboard",
      field: "techConcern",
      label: "Click here to Attempt.",
      marks: 3,
    },
    {
      id: "11",
      question: `Make the absentee calling to the students of class 9th and 10th who were absent in the class.`,
      link: "http://localhost:3000/user-dashboard",
      field: "absenteeCalling",
      label: "Click here to Attempt.",
      marks: 2,
    },
    {
      id: "12",
      question: `Please close the previously raised school-related concerns on the ERP system
Each concern should be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:
For Class 09:
1. Classes were interrupted due to a poor internet connection – Still Not Resolved.
2. Optional classes are not being conducted in your school – Still Not Resolved.
3. Question papers of students have not been checked – Resolved.
For Class 10:
1. The school was unexpectedly closed today due to a sudden event – Resolved.
2. A half-day was announced due to a specific event – Resolved.
Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
      link: "http://localhost:3000/user-dashboard",
      field: "closeSchoolConcerns",
      label: "Click here to Attempt.",
      marks: 2.5,
    },
    {
      id: "13",
      question: `Please close the previously raised student-related concerns on the ERP system.
Each concern should now be closed with the appropriate status — either Resolved or Not Resolved — as mentioned below:
For Class 09:
1. A student's SLC (School Leaving Certificate) had been released, and the record needed to be removed from the ERP – Still Not Resolved.
2. A student's examination center had changed, but the ERP still showed the old center – Resolved.
For Class 10:
1. The MB App was not working properly, and students were unable to log in or access their dashboards – Resolved.
2. A student's details needed to be added to the ERP, but the record was not available – Still Not Resolved.
Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
      link: "http://localhost:3000/user-dashboard",
      field: "closeStudentConcerns",
      label: "Click here to Attempt.",
      marks: 2.5,
    },
    {
      id: "14",
      question: `Please close the previously raised Tech-related concerns on the ERP system.
Each concern should now be closed with the appropriate status — either Resolved or Still Not Resolved — as mentioned below:
For Class 09:
1. The smart classroom screen was not functioning properly – Resolved.
2. The inverter was not working, causing frequent power interruptions – Still Not Resolved.
3. The microphone in Class 9 was not operational, making it difficult for the teacher to hear the students – Resolved.
For Class 10:
1. The camera in Class 10's smart classroom was not working, preventing video sessions and monitoring – Resolved.
2. The Mini PC used for teaching in Class 10 was frequently crashing or not starting – Still Not Resolved.
3. The power supply issue in Class 10 due to electricity fluctuations – Resolved.
Note: Please update the ERP accordingly by marking each concern with its respective closure status.`,
      link: "http://localhost:3000/user-dashboard",
      field: "closeTechConcerns",
      label: "Click here to Attempt.",
      marks: 3,
    },
  ];

  const computeAttendanceScore = (attendanceObj) => {
    if (!attendanceObj || typeof attendanceObj !== "object") return 0;
    const totalCount = (attendanceObj.count9 || 0) + (attendanceObj.count10 || 0);
    if (totalCount === 26) {
      return 2;
    } else if (totalCount > 0 && totalCount < 26) {
      return 1;
    } else {
      return 0;
    }
  };

  const class9Students = [
    "Shubham", "Ripudaman", "Sanjeev", "Ajay", "Jatin", "Poshak", "Anshu", "Gajendra", "Vimal", "Madhu",
  ];
  const class10Students = [
    "Akhilesh", "Abhinesh", "Akshay", "Samay", "Anjali", "Rekha", "Srishti", "Aayush", "Jay", "Rohit",
  ];

  const computeObjectFieldScore = (obj, expectedFieldCount, totalMarks) => {
    if (!obj || typeof obj !== "object") return 0;
    const actualFieldCount = Object.keys(obj).length;
    if (actualFieldCount === expectedFieldCount) {
      return totalMarks;
    } else {
      const difference = Math.abs(expectedFieldCount - actualFieldCount);
      const penalty = difference * 0.5;
      const score = Math.max(0, totalMarks - penalty);
      return Math.round(score * 100) / 100;
    }
  };

  const computeArrayFieldScore = (obj, arrayFieldName, expectedCount, totalMarks) => {
    if (!obj || !obj[arrayFieldName] || !Array.isArray(obj[arrayFieldName])) return 0;
    const actualCount = obj[arrayFieldName].length;
    if (actualCount === expectedCount) {
      return totalMarks;
    } else {
      const difference = Math.abs(expectedCount - actualCount);
      const penalty = difference * 0.5;
      const score = Math.max(0, totalMarks - penalty);
      return Math.round(score * 100) / 100;
    }
  };

  const computeDisciplinaryCopyScore = (obj, expectedFieldCount, totalMarks) => {
    if (!obj || typeof obj !== "object") return 0;
    const actualFieldCount = Object.keys(obj).length;
    let validFields = 0;
    Object.values(obj).forEach(value => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          const hasValidSubject = value.some(item => {
            if (typeof item === 'object' && item !== null) {
              return Object.values(item).some(val => val !== null && val !== undefined);
            }
            return item !== null && item !== undefined;
          });
          if (hasValidSubject) validFields++;
        } else {
          validFields++;
        }
      }
    });
    if (actualFieldCount === expectedFieldCount && validFields === expectedFieldCount) {
      return totalMarks;
    } else {
      const fieldDifference = Math.abs(expectedFieldCount - actualFieldCount);
      const nullPenalty = Math.abs(expectedFieldCount - validFields);
      const totalPenalty = (fieldDifference + nullPenalty) * 0.5;
      const score = Math.max(0, totalMarks - totalPenalty);
      return Math.round(score * 100) / 100;
    }
  };

  const computeTaskScore = (task, data) => {
    if (!task || !data) return 0;
    const value = data[task.field];
    const totalMarks = Number(task.marks ?? 1);

    if (task.field === "studentAttendanceCount") {
      return computeAttendanceScore(value);
    }

    if (task.field === "uploadMarksCount") {
      if (value === 0 || !value || (typeof value === "object" && Object.keys(value).length === 0)) {
        return 0;
      }
      const uploads = value && typeof value === "object" ? value : {};
      const class9TotalMarks = 2;
      const class10TotalMarks = 2;
      const class9Count = class9Students.length;
      const class10Count = class10Students.length;
      const perStudent9 = class9TotalMarks / class9Count;
      const perStudent10 = class10TotalMarks / class10Count;

      const obtainedMap = {
        Shubham: "74", Ripudaman: "94", Sanjeev: "72", Ajay: "Absent", Jatin: "87",
        Poshak: "79", Anshu: "92", Gajendra: "88", Vimal: "71", Madhu: "86",
        Akhilesh: "98", Abhinesh: "92", Akshay: "100", Samay: "Absent", Anjali: "93",
        Rekha: "83", Srishti: "97", Aayush: "86", Jay: "93", Rohit: "90",
      };

      let awarded9 = 0;
      let penalty = 0;
      class9Students.forEach((s) => {
        if (Number(uploads[s]) === 1) {
          if (String(obtainedMap[s]).toLowerCase() === "absent") {
            penalty += 0.5;
          } else {
            awarded9 += perStudent9;
          }
        } else if (s === "Ajay" && Number(uploads[s]) === 0) {
          awarded9 += 0.2;
        }
      });

      let awarded10 = 0;
      class10Students.forEach((s) => {
        if (Number(uploads[s]) === 1) {
          if (String(obtainedMap[s]).toLowerCase() === "absent") {
            penalty += 0.5;
          } else {
            awarded10 += perStudent10;
          }
        } else if (s === "Samay" && Number(uploads[s]) === 0) {
          awarded10 += 0.2;
        }
      });

      let totalAwarded = Math.round((awarded9 + awarded10 - penalty) * 100) / 100;
      if (totalAwarded > totalMarks) totalAwarded = totalMarks;
      return totalAwarded;
    }

    if (task.field === "disciplinary") {
      return computeDisciplinaryCopyScore(value, 5, totalMarks);
    }

    if (task.field === "copyChecking") {
      return computeDisciplinaryCopyScore(value, 5, totalMarks);
    }

    if (task.field === "schoolConcern") {
      return computeArrayFieldScore(value, "concerns", 5, totalMarks);
    }

    if (task.field === "studentRelatedConncern") {
      if (!value || !value.concerns || !Array.isArray(value.concerns) || value.concerns.length === 0) {
        return 0;
      }
      return computeArrayFieldScore(value, "concerns", 4, totalMarks);
    }

    if (task.field === "techConcern") {
      return computeArrayFieldScore(value, "concerns", 6, totalMarks);
    }

    if (task.field === "closeSchoolConcerns") {
      return computeArrayFieldScore(value, "concerns", 5, totalMarks);
    }

    if (task.field === "closeStudentConcerns") {
      if (!value || !value.concerns || !Array.isArray(value.concerns) || value.concerns.length === 0) {
        return 0;
      }
      return computeArrayFieldScore(value, "concerns", 4, totalMarks);
    }

    if (task.field === "closeTechConcerns") {
      return computeArrayFieldScore(value, "concerns", 6, totalMarks);
    }

    if (typeof value === "boolean") {
      return value === true ? totalMarks : 0;
    }

    if (typeof value === "number") {
      const valNum = value;
      const maxCount = 10;
      const proportion = Math.min(valNum / maxCount, 1);
      const score = Math.round(proportion * totalMarks * 100) / 100;
      return score;
    }

    if (typeof value === "object" && value !== null) {
      const keys = Object.keys(value);
      if (keys.length === 0) return 0;
      let filled = 0;
      keys.forEach((k) => {
        const v = value[k];
        if (Array.isArray(v)) {
          const anyFilled = v.some((entry) => {
            if (entry === null) return false;
            if (typeof entry === "object") {
              return Object.values(entry).some((ev) => ev !== null && ev !== undefined);
            }
            return entry !== null && entry !== undefined;
          });
          if (anyFilled) filled++;
        } else if (k.toLowerCase().includes("concern") && v && Array.isArray(v.concerns)) {
          const arr = v.concerns;
          if (!arr || arr.length === 0) {
          } else {
            let nonWrong = 0;
            arr.forEach((c) => {
              const isWrong =
                (c && typeof c === "object" && (c.isWrong === true || String(c.status).toLowerCase().includes("wrong") || String(c.result).toLowerCase().includes("incorrect")));
              if (!isWrong) nonWrong++;
            });
            const proportion = nonWrong / arr.length;
            const score = Math.round(proportion * totalMarks * 100) / 100;
            return score;
          }
        } else {
          if (v !== null && v !== undefined && !(typeof v === "object" && Object.keys(v).length === 0)) {
            filled++;
          }
        }
      });
      const proportion = filled / keys.length;
      const score = Math.round(proportion * totalMarks * 100) / 100;
      return score;
    }

    return 0;
  };

  const isTaskCompleted = (task) => {
    if (!erpTestData.length) return false;
    const data = erpTestData[0];
    const earned = computeTaskScore(task, data);
    
    return earned > 0;
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
    const totalMarks = Number(task.marks ?? 1);
    const earned = computeTaskScore(task, data);
    const testSubmitted = Boolean(data.marks && data.marks.isTestSubmitted === true);

    if (task.field === "studentAttendanceCount") {
      return (
        <div>
          {testSubmitted && (
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              Marks: {earned}/{totalMarks}
            </div>
          )}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 13 }}>
              Count 9: {value?.count9 || 0}, Count 10: {value?.count10 || 0}, Total: {(value?.count9 || 0) + (value?.count10 || 0)}
            </div>
          </div>
          <div style={{ marginTop: 8, fontWeight: "700", color: earned > 0 ? "green" : "red" }}>
            {earned > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
          </div>
        </div>
      );
    }

    if (task.id === "03") {
      const uploads = value && typeof value === "object" ? value : {};
      const class9TotalMarks = 2;
      const class10TotalMarks = 2;
      const class9Count = class9Students.length;
      const class10Count = class10Students.length;
      const perStudent9 = Math.round((class9TotalMarks / class9Count) * 100) / 100;
      const perStudent10 = Math.round((class10TotalMarks / class10Count) * 100) / 100;

      const obtainedMap = {
        Shubham: "74", Ripudaman: "94", Sanjeev: "72", Ajay: "Absent", Jatin: "87",
        Poshak: "79", Anshu: "92", Gajendra: "88", Vimal: "71", Madhu: "86",
        Akhilesh: "98", Abhinesh: "92", Akshay: "100", Samay: "Absent", Anjali: "93",
        Rekha: "83", Srishti: "97", Aayush: "86", Jay: "93", Rohit: "90",
      };

      const rows9 = class9Students.map((s) => {
        const raw = Number(uploads[s]) || 0;
        let awarded = 0;
        let penalty = 0;
        
        if (raw === 1) {
          if (String(obtainedMap[s]).toLowerCase() !== "absent") {
            awarded = perStudent9;
          } else {
            penalty = 0.5;
          }
        } else if (s === "Ajay" && raw === 0) {
          awarded = 0.2;
        }
        
        return { name: s, raw, awarded, penalty, obtained: obtainedMap[s] || "" };
      });

      const rows10 = class10Students.map((s) => {
        const raw = Number(uploads[s]) || 0;
        let awarded = 0;
        let penalty = 0;
        
        if (raw === 1) {
          if (String(obtainedMap[s]).toLowerCase() !== "absent") {
            awarded = perStudent10;
          } else {
            penalty = 0.5;
          }
        } else if (s === "Samay" && raw === 0) {
          awarded = 0.2;
        }
        
        return { name: s, raw, awarded, penalty, obtained: obtainedMap[s] || "" };
      });

      const sumAwarded = rows9.reduce((a, r) => a + r.awarded, 0) + rows10.reduce((a, r) => a + r.awarded, 0);
      const sumPenalty = rows9.reduce((a, r) => a + r.penalty, 0) + rows10.reduce((a, r) => a + r.penalty, 0);
      const totalAwarded = Math.round((sumAwarded - sumPenalty) * 100) / 100;

      return (
        <div>
          <div dangerouslySetInnerHTML={{ __html: `<p><strong>Update the marks of students on ERP for the following:</strong></p>` }} />
          <div style={{ marginTop: 6 }}>
            <h4>For Class 09</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }} border="1" cellPadding="6" cellSpacing="0">
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 6 }}>Name</th>
                  <th style={{ textAlign: "left", padding: 6 }}>Father</th>
                  <th style={{ textAlign: "left", padding: 6 }}>Obtained Marks</th>
                  {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Upload Status</th>}
                  {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>ERP Marks</th>}
                </tr>
              </thead>
              <tbody>
                {rows9.map((r) => {
                  const fatherMap = {
                    Shubham: "Shubhchandra", Ripudaman: "Shubham", Sanjeev: "Jeet", Ajay: "Brijesh",
                    Jatin: "Raaj", Poshak: "Shailesh", Anshu: "Ajay", Gajendra: "Arun",
                    Vimal: "Shyam", Madhu: "Jagjeet",
                  };
                  const obtainedMapLocal = {
                    Shubham: "74", Ripudaman: "94", Sanjeev: "72", Ajay: "Absent", Jatin: "87",
                    Poshak: "79", Anshu: "92", Gajendra: "88", Vimal: "71", Madhu: "86",
                  };
                  return (
                    <tr key={r.name}>
                      <td style={{ padding: 6 }}>{r.name}</td>
                      <td style={{ padding: 6 }}>{fatherMap[r.name]}</td>
                      <td style={{ padding: 6 }}>{obtainedMapLocal[r.name]}</td>
                      {testSubmitted && (
                        <td style={{ padding: 6 }}>
                          {r.raw === 1 ? "✅ Uploaded" : "❌ Not Uploaded"}
                        </td>
                      )}
                      {testSubmitted && (
                        <td style={{ padding: 6 }}>
                          {r.awarded}
                          {r.penalty ? `  (Penalty: -${r.penalty})` : ""}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8 }}>
            <h4>For Class 10</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }} border="1" cellPadding="6" cellSpacing="0">
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 6 }}>Name</th>
                  <th style={{ textAlign: "left", padding: 6 }}>Father</th>
                  <th style={{ textAlign: "left", padding: 6 }}>Obtained Marks</th>
                  {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Upload Status</th>}
                  {testSubmitted && <th style={{ textAlign: "left", padding: 6 }}>Erp Marks</th>}
                </tr>
              </thead>
              <tbody>
                {rows10.map((r) => {
                  const fatherMap10 = {
                    Akhilesh: "Chandu", Abhinesh: "Ram", Akshay: "Balraj", Samay: "Deepak",
                    Anjali: "Rupesh", Rekha: "Sandeep", Srishti: "Jaiveer", Aayush: "Uma",
                    Jay: "Shankar", Rohit: "Raju",
                  };
                  const obtainedMap10 = {
                    Akhilesh: "98", Abhinesh: "92", Akshay: "100", Samay: "Absent", Anjali: "93",
                    Rekha: "83", Srishti: "97", Aayush: "86", Jay: "93", Rohit: "90",
                  };
                  return (
                    <tr key={r.name}>
                      <td style={{ padding: 6 }}>{r.name}</td>
                      <td style={{ padding: 6 }}>{fatherMap10[r.name]}</td>
                      <td style={{ padding: 6 }}>{obtainedMap10[r.name]}</td>
                      {testSubmitted && (
                        <td style={{ padding: 6 }}>
                          {r.raw === 1 ? "✅ Uploaded" : "❌ Not Uploaded"}
                        </td>
                      )}
                      {testSubmitted && (
                        <td style={{ padding: 6 }}>
                          {r.awarded}
                          {r.penalty ? `  (Penalty: -${r.penalty})` : ""}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {testSubmitted && (
            <div style={{ marginTop: 8, fontWeight: 600 }}>
              Mark: {totalAwarded}/{task.marks}
            </div>
          )}
          <div style={{ marginTop: 8, fontWeight: "700", color: totalAwarded > 0 ? "green" : "red" }}>
            {totalAwarded > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
          </div>
        </div>
      );
    }

    const fieldCountTasks = ["disciplinary", "copyChecking", "schoolConcern", "studentRelatedConncern", "techConcern", "closeSchoolConcerns", "closeStudentConcerns", "closeTechConcerns"];
    if (fieldCountTasks.includes(task.field)) {
      let expectedCount = 0;
      let actualCount = 0;
      let validFields = 0;
      
      if (task.field === "disciplinary" || task.field === "copyChecking") {
        expectedCount = 5;
        actualCount = value && typeof value === "object" ? Object.keys(value).length : 0;
        if (value && typeof value === "object") {
          Object.values(value).forEach(fieldValue => {
            if (fieldValue !== null && fieldValue !== undefined) {
              if (Array.isArray(fieldValue)) {
                const hasValidSubject = fieldValue.some(item => {
                  if (typeof item === 'object' && item !== null) {
                    return Object.values(item).some(val => val !== null && val !== undefined);
                  }
                  return item !== null && item !== undefined;
                });
                if (hasValidSubject) validFields++;
              } else {
                validFields++;
              }
            }
          });
        }
      } else {
        switch(task.field) {
          case "schoolConcern":
          case "closeSchoolConcerns":
            expectedCount = 5;
            break;
          case "studentRelatedConncern":
          case "closeStudentConcerns":
            expectedCount = 4;
            break;
          case "techConcern":
          case "closeTechConcerns":
            expectedCount = 6;
            break;
          default:
            expectedCount = 0;
        }
        actualCount = value && value.concerns && Array.isArray(value.concerns) ? value.concerns.length : 0;
        validFields = actualCount;
      }

      const difference = Math.abs(expectedCount - actualCount);
      const nullDifference = (task.field === "disciplinary" || task.field === "copyChecking") ? Math.abs(expectedCount - validFields) : 0;
      const totalPenalty = (difference + nullDifference) * 0.5;

      return (
        <div>
          {testSubmitted && (
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              Marks: {earned}/{totalMarks}
            </div>
          )}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 13 }}>
              Expected {expectedCount} {task.field.includes("Concern") ? "concerns" : "fields"}, Found: {actualCount}
              {(task.field === "disciplinary" || task.field === "copyChecking") && (
                <>, Valid (non-null): {validFields}</>
              )}
            </div>
          </div>
          <div style={{ marginTop: 8, fontWeight: "700", color: earned > 0 ? "green" : "red" }}>
            {earned > 0 ? "✅ Answer: Attempted" : "❌ Answer: Not Attempted"}
          </div>
        </div>
      );
    }

    const isAttempted = earned > 0;

    if (isAttempted) {
      return (
        <div>
          <span style={{ color: "green", fontWeight: "bold" }}>
            ✅ Answer: Attempted
          </span>
          {testSubmitted && (
            <>
              <br />
              <span style={{ color: "green", fontWeight: "bold" }}>Score: {earned}/{totalMarks}</span>
            </>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <span style={{ color: "red", fontWeight: "bold" }}>
            ❌ Answer: Not Attempted
          </span>
          {testSubmitted && (
            <>
              <br />
              <span style={{ color: "gray", fontWeight: "bold" }}>Score: {earned}/{totalMarks}</span>
            </>
          )}
        </div>
      );
    }
  };

  const totalQuestions = tasks.length;
  const totalAnswered = tasks.filter((t) => isTaskCompleted(t)).length;

  const calculateTotalMarks = () => {
    if (!erpTestData.length) return { obtained: 0, total: 0 };
    const data = erpTestData[0];
    let obtained = 0;
    let total = 0;
    
    tasks.forEach(task => {
      const earned = computeTaskScore(task, data);
      obtained += earned;
      total += Number(task.marks ?? 1);
    });
    
    return { obtained: Math.round(obtained * 100) / 100, total };
  };

  const buildMarksPayload = () => {
    if (!erpTestData || !erpTestData.length) return null;
    const data = erpTestData[0];
    const marks = {};
    for (let i = 0; i < 14; i++) {
      const t = tasks[i];
      const qKey = `q${i + 1}`;
      if (t) {
        marks[qKey] = computeTaskScore(t, data);
      } else {
        marks[qKey] = 0;
      }
    }
    return marks;
  };

  const handleSaveMarks = async () => {
    if (!erpTestData || !erpTestData.length) {
      setSaveStatus({ type: "error", message: "No ERP data available to compute marks." });
      return;
    }
    const marksPayload = buildMarksPayload();
    if (!marksPayload) {
      setSaveStatus({ type: "error", message: "Unable to build marks payload." });
      return;
    }

    setSavingMarks(true);
    setSaveStatus(null);

    try {
      const payload = {
        unqUserObjectId: userData._id,
        userId: userData._id,
        marks: marksPayload,
        isTestSubmitted: true
      };
      const resp = await UpdateErpMarksService(payload);
      if (resp && resp.data) {
        setErpTestData(resp.data);
      } else if (resp && resp.status === "Ok" && resp.data) {
        setErpTestData(resp.data);
      } else {
        await fetchErptestObject();
      }
      setSaveStatus({ type: "success", message: "Marks saved to ERP successfully." });
      window.location.reload();
    } catch (err) {
      console.error("Error saving marks:", err);
      setSaveStatus({ type: "error", message: "Failed to save marks. Check console for details." });
    } finally {
      setSavingMarks(false);
    }
  };

  const isSubmitted = Boolean(erpTestData && erpTestData[0] && erpTestData[0].marks && erpTestData[0].marks.isTestSubmitted === true);
  const marksSummary = calculateTotalMarks();

  return (
    <Container className="my-4">
      <div className="text-center mb-4">
        <h2 className="mb-3" style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          color: "#2c3e50",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)" 
        }}>
          ERP Assessment Test
        </h2>
        
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          color: "white",
          marginBottom: "20px"
        }}>
          <Row className="text-center">
            <Col md={4}>
              <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Total Questions</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{totalQuestions}</div>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Answered</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2ecc71" }}>{totalAnswered}</div>
            </Col>
            <Col md={4}>
              <div style={{ fontSize: "1.1rem", marginBottom: "5px" }}>Remaining</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e74c3c" }}>{totalQuestions - totalAnswered}</div>
            </Col>
          </Row>
        </div>
      </div>

      {tasks.map((task) => {
        const completed = isTaskCompleted(task);
        return (
          <Card
            key={task.id}
            className="mb-4 shadow-lg"
            style={{
              borderLeft: completed ? "6px solid #27ae60" : "6px solid #95a5a6",
              transition: "0.3s",
              borderRadius: "12px",
              overflow: "hidden"
            }}
          >
            <Card.Body style={{ padding: "25px" }}>
              <Card.Title style={{ 
                fontWeight: "700", 
                fontSize: "1.3rem", 
                color: "#2c3e50",
                marginBottom: "15px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                lineHeight: "1.6"
              }}>
                {typeof task.question === "string" && task.question.trim().startsWith("<") ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: `Question ${task.id}: ${task.question}` }}
                  />
                ) : (
                  <div style={{ 
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.6"
                  }}>
                    Question {task.id}: {task.question}
                  </div>
                )}
              </Card.Title>
              
              {task.link && (
                <p style={{ marginBottom: "15px" }}>
                  <a
                    href={(completed || isSubmitted) ? undefined : task.link}
                    rel="noopener noreferrer"
                    style={{
                      pointerEvents: (completed || isSubmitted) ? "none" : "auto",
                      opacity: (completed || isSubmitted) ? 0.6 : 1,
                      textDecoration: (completed || isSubmitted) ? "none" : "underline",
                      color: (completed || isSubmitted) ? "gray" : "#3498db",
                      cursor: (completed || isSubmitted) ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      fontSize: "1rem",
                      padding: "8px 16px",
                      border: (completed || isSubmitted) ? "1px solid #bdc3c7" : "1px solid #3498db",
                      borderRadius: "6px",
                      display: "inline-block",
                      background: (completed || isSubmitted) ? "#ecf0f1" : "transparent",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!completed && !isSubmitted) {
                        e.target.style.background = "#3498db";
                        e.target.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!completed && !isSubmitted) {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#3498db";
                      }
                    }}
                  >
                    {task.label} (Marks: {task.marks ?? 1})
                  </a>
                </p>
              )}
              
              <Card.Text style={{ 
                fontSize: "1rem",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                lineHeight: "1.5"
              }}>
                {renderTaskStatus(task)}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      })}

      <div style={{ 
        textAlign: "center", 
        marginTop: "30px", 
        marginBottom: "30px",
        padding: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "12px",
        color: "white"
      }}>
        {saveStatus && (
          <div style={{ marginBottom: "15px" }}>
            <strong style={{ 
              color: saveStatus.type === "success" ? "#2ecc71" : "#e74c3c",
              fontSize: "1.1rem"
            }}>
              {saveStatus.message}
            </strong>
          </div>
        )}
        <div>
          <button
            onClick={handleSaveMarks}
            disabled={savingMarks || !erpTestData || !erpTestData.length || isSubmitted}
            style={{
              padding: "12px 30px",
              borderRadius: "8px",
              border: "none",
              background: savingMarks ? "#95a5a6" : (isSubmitted ? "#27ae60" : "#e74c3c"),
              color: "#fff",
              cursor: (savingMarks || isSubmitted) ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}
            onMouseEnter={(e) => {
              if (!savingMarks && !isSubmitted) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!savingMarks && !isSubmitted) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }
            }}
          >
            {savingMarks ? "⏳ Saving..." : (isSubmitted ? "✅ Test Submitted" : "🚀 Submit Test")}
          </button>
        </div>
        {isSubmitted && (
          <div style={{ marginTop: "15px", fontSize: "0.9rem", opacity: 0.9 }}>
            Test has been submitted. You cannot make further changes.
          </div>
        )}
      </div>
    </Container>
  );
};