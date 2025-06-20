// This is AttendanceSession1.jsx.

// This component marks the attendance of class 8th for MB

// importing packages.
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Table, Alert, Breadcrumb, Card, Button  } from 'react-bootstrap';


import { getAllAttendance, updateAttendanceBySrnAndDate } from "../service/AttendanceMB.services.js";
import { DistrictBlockSchoolById, ClassOfStudent  } from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";


//importing context api (District Block School Context API)
import { DistrictBlockSchoolContext, BlockContext,  SchoolContext, ClassContext} from "../components/contextAPIs/DependentDropdowns.contextAPI.js";

import Select from 'react-select'
import { formToJSON } from "axios";
import SchoolDropDowns from "../components/DependentDropDowns/SchoolDropDowns.jsx";
import { UserContext } from "../components/contextAPIs/User.context.js";

export const AbsentCalling = ({assignedDistricts, assignedBlocks, assignedSchools}) => {

    //HOOKS

    const [date, setDate] = useState('')
    const [attendanceData, setAttendanceData] = useState([])
    const [callingStatus, setCallingStatus] = useState({})

    //ClassContext API

      const {classContext, setClassContext} = useContext(ClassContext);

    //User Context api
    
    const {userData, setUserData} = useContext(UserContext);

    //District, Block, School Context api.

     const {schoolContext, setSchoolContext} = useContext(SchoolContext); // Use context

    
     
    useEffect(()=>{
      setDate(new Date().toISOString().split("T")[0])
    }, [])

    const fetchAttendanceData = async () =>{
        const queryParams = {
          studentSrn: "",
          firstName: "",
          fatherName: "",
          date: date,
          status: "Absent",
          startDate: date,
        //endDate: endDate || "",
          //districtId: Object(districtContext[0]).value  ,
          //blockId:Object(blockContext[0]).value || "",
          schoolId:
            Object(schoolContext[0]).value || userData[0].assignedSchools,
          classofStudent: classContext.value || ["9", "10"],
          batch: "",
        };
        
        try {
            const response = await getAllAttendance(queryParams)

            setAttendanceData(response.data)

        } catch (error) {

            console.log('Error fetching data', error)

            setAttendanceData([])
        }


    }

    useEffect(()=>{
 
        fetchAttendanceData()
        console.log(date)
    }, [date, classContext, schoolContext])


//Logic for handling statusOptions and subOptions

const handleStatusChange = (studentSrn, selectedOption) =>{
  setCallingStatus(prev => ({
    ...prev,
    [studentSrn]:{
      status:selectedOption,
      subOptions: null
    }
  }))
};

const handleSubOptionsChange = (studentSrn, selectedOption) => {
  setCallingStatus(prev => ({
    ...prev,
    [studentSrn]:{
      ...prev[studentSrn],
      subOptions: selectedOption
    }
  }))
};
//---------------------------------------------------------------

//Handling calling status updation in backend

const updateCallingStatusInDb = async (studentSrn) => {

 const queryParamsForAttendance = {
    studentSrn,
    date,
  };


const formData = {
  absenteeCallingStatus: callingStatus[studentSrn]?.status?.value || "",
  callingRemark1: callingStatus[studentSrn]?.subOptions?.value || ""
}

console.log(queryParamsForAttendance)
console.log(formData)

  try {
    await updateAttendanceBySrnAndDate(queryParamsForAttendance, formData);
    fetchAttendanceData()
        console.log("Sent to backend:", queryParamsForAttendance, formData);
  } catch (error) {
    console.error("Error updating attendance", error.message);
  }

}

useEffect(()=>{
  Object.entries(callingStatus).forEach(([studentSrn, remarkObject])=>{
    console.log(remarkObject.subOptions)
    if(remarkObject.subOptions === null){
        return;
    } else {
        updateCallingStatusInDb(studentSrn)
        
    }
      
  }) 
}, [callingStatus])





    return (
        <Container fluid>
            <div>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
                <SchoolDropDowns/>
                <ClassOfStudent/>
            </div>

            <div>
                <h1>Absentee Calling</h1>
                <hr/>
            </div>

            <div>

                {attendanceData.length>0 ? attendanceData.map((eachObject, index)=>{
                  const selectedStatus = callingStatus[eachObject.studentSrn]?.status?.value
                  const selectedCallingStatus = eachObject.absenteeCallingStatus
                  let backColor = 'white'
                  
                  if (selectedCallingStatus === "Connected") {backColor = '#00FFFF'}
                  else if (selectedCallingStatus === "Not-Connected") (backColor = '#FCE4D6')
                 
                   return (
                     <div key={index}>
                      <br/>
                       <Card style={{ width: "18rem", backgroundColor:`${backColor}`}}>
                         {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                         <Card.Body>
                           <Card.Title>
                             srn: {eachObject.studentDetails.studentSrn}
                           </Card.Title>
                           <Card.Title>
                             Name: {eachObject.studentDetails.firstName}
                           </Card.Title>
                           <Card.Title>
                             Calling Status: {selectedCallingStatus}
                           </Card.Title>


                           <Card.Text style={{ fontSize: "15px" }}>
                             <div style={{display: "flex", flexDirection:'column'}}>
                                <a
                               href={`tel:${eachObject.studentDetails.personalContact}`}
                               style={{ textDecoration: "none" }}
                             >
                               📞 {eachObject.studentDetails.personalContact}
                             </a>
                             <a
                               href={`tel:${eachObject.studentDetails.ParentContact}`}
                               style={{ textDecoration: "none" }}
                             >
                               📞 {eachObject.studentDetails.ParentContact}
                             </a>
                             </div>
                           </Card.Text>
                           <Select
                           
                           options={statusOptions}
                           value={callingStatus[eachObject.studentSrn]?.status || null}
                           onChange={(selectedOption)=>handleStatusChange(eachObject.studentSrn, selectedOption)}
                           
                           />
                            <br/>
                           <Select
                           
                           options={selectedStatus ? subOptions[selectedStatus] : []}
                           value={callingStatus[eachObject.studentSrn]?.subOptions || null}
                           onChange={(selectedOption)=>handleSubOptionsChange(eachObject.studentSrn, selectedOption)}
                           isDisabled = {!selectedStatus}


                           />
                         </Card.Body>
                       </Card>
                     </div>
                   ); 
                }):("No data found")}
            </div>
           
        </Container>
    )
};






//Options for Calling status and Remark

const statusOptions = [

  {value: "Connected", label: "Connected"},
  {value: "Not-Connected", label: "Not-Connected"}
]

const subOptions = {

"Connected":[
  {value:'Sick', label:'Sick'},
  { value: "health_issues", label: "Health Issues" },
  { value: "family_emergency", label: "Family Emergency" },
  { value: "out_of_station", label: "Out of Station" },
  { value: "personal_work", label: "Personal Work" },
  { value: "transport_issue", label: "Transport Issue" },
  { value: "weather_problem", label: "Bad Weather" },
  { value: "not_interested", label: "Not Interested" },
  
  { value: "family_function", label: "Family Function" },
  


],
"Not-Connected":[
  {value:'Wrong Number', label:'Wrong Number'},
  {value: 'Call not picked', label:'Call not picked'}
]

}