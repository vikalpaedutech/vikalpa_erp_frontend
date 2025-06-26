// /FRONTEND/src/components/Concern/TechConcerns.jsx

import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Row, Tab, Tabs, Breadcrumb } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
  SchoolProvider,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { createConcern } from "../../service/ConcernsServices/Concern.services";
import SchoolDropDowns from "../DependentDropDowns/SchoolDropDowns";
import { IndividualConcernsForm } from "./IndividualConcernsForm";
import { IndividualLeave } from "./IndividualLeave";
import { IndividualConcernsStatus } from "./IndividualConcernsStatus";
import { IndividualLeaveRequests } from "./IndividualLeaveRequests";
import { IndividualConcernsRequest } from "./IndividualConcernsRequest";



export const IndividualConcenrsResolution = () => {
  const { userData } = useContext(UserContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);

  
  //Hooks

  const [handleForm, setHandleForm] = useState('form')

  const handleSubmit = (value) => {
   
    setHandleForm(value)

  }
 
  
  return (
    <Container className="my-4">
      <Breadcrumb>
      {/* <Breadcrumb.Item  onClick={()=>handleSubmit('form')} >Individual Concerns</Breadcrumb.Item> */}
      <Breadcrumb.Item  onClick={()=>handleSubmit('form')}>
        Leave Requests
      </Breadcrumb.Item>
        {/* <Breadcrumb.Item  onClick={()=>handleSubmit('Status')}>
        Status
      </Breadcrumb.Item> */}
    
    </Breadcrumb>



{handleForm === "form" ? (<IndividualLeaveRequests/>):(null)}

{/* {(
<>
{handleForm === "LeaveApplication" ? (<IndividualLeaveRequests/>):(<IndividualApprovedAndRejectedLeaveStatus/>)}

</>

)} */}
   
    
    </Container>
  );
};

//handleForm === "form" ? (<IndividualConcernsRequest />): 