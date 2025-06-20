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
import BillsVerification from "./BillsVerification";
import { BillsVerificationStatus } from "./BillsVerificationStatus";


const BillsVerificationPage = () => {
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
      <Breadcrumb.Item  onClick={()=>handleSubmit('form')} >CC Bills</Breadcrumb.Item>
      <Breadcrumb.Item  onClick={()=>handleSubmit('status')}>
        Verified Bills
      </Breadcrumb.Item>
    
    </Breadcrumb>



{handleForm === "form" ? (<BillsVerification/>):(<BillsVerificationStatus/>)}


   
    
    </Container>
  );
};

export default BillsVerificationPage;
