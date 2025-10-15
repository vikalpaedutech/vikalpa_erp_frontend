// //This is the helper functions, it dynamically routes back to the test page...
// //...once the task is completed

// import React, {useState, useEffect, useContext} from 'react';
// import { GetErpTestByUnqUserObjectId } from "../../service/ErpTest.services";
// import { useLocation } from 'react-router-dom';



// export const ErpTestPageRouteBack = async (userData, keyStatus) =>{

//     // const navigate = useLocation();


// const reqBody = {
//       unqUserObjectId: userData._id || 'hello',
//     };

//     const response = await GetErpTestByUnqUserObjectId(reqBody);

//     console.log(response.data);
// // alert(keyStatus.keyStatus)
// // alert(response.data[0].disciplinary)

// if (keyStatus.keyStatus === "Attendance") {

//     if (response.data[0].studentAttendanceCount >=26){
      

//         window.location.href = "/erp-test";
//     }
// } else if (keyStatus.keyStatus === "Marks")
    
//         if (response.data[0].uploadMarksCount >=10){
      

//         window.location.href = "/erp-test";
//     } else if (keyStatus.keyStatus === "disciplinary")
//     alert(keyStatus.keyStatus)
//         if (response.data[0].disciplinary === true){
      

//         window.location.href = "/erp-test";
//     } else if (keyStatus.keyStatus === "Student-Concern")
//     alert(keyStatus.keyStatus)
//         if (response.data[0].studentRelatedConncern === true){
      

//         window.location.href = "/erp-test";
//     } else if (keyStatus.keyStatus === "School-Concern")
//     alert(keyStatus.keyStatus)
//         if (response.data[0].schoolConcern === true){
      

//         window.location.href = "/erp-test";
//     } else if (keyStatus.keyStatus === "Tech")
//     alert(keyStatus.keyStatus)
//         if (response.data[0].techConcern === true){
      

//         window.location.href = "/erp-test";
//     } else if (keyStatus.keyStatus === "Copy")
//     alert(keyStatus.keyStatus)
//         if (response.data[0].copyChecking === true){
      

//         window.location.href = "/erp-test";
//     } else if (keyStatus.keyStatus === "DownloadPdf")
//     alert(keyStatus.keyStatus)
//         if (response.data[0].downloadAttendancePdfFormat === true){
      

//         window.location.href = "/erp-test";
//     }  else if (keyStatus.keyStatus === "UploadPdf")
//     alert(keyStatus.keyStatus)
//         if (response.data[0].uploadAttendancePdfFormat === true){
      

//         window.location.href = "/erp-test";
//     }
// }







