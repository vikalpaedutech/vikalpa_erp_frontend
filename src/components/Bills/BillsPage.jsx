// /FRONTEND/src/components/Bills/BillsPage.jsx

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
import Bills from "./Bills";
import { BillsStatus } from "./BillsStatus";


const BillsPage = () => {
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
      <Breadcrumb.Item  onClick={()=>handleSubmit('form')} >Home</Breadcrumb.Item>
      <Breadcrumb.Item  onClick={()=>handleSubmit('status')}>
        My Bills
      </Breadcrumb.Item>
    
    </Breadcrumb>



{handleForm === "form" ? (<Bills/>):(<BillsStatus/>)}


   
    
    </Container>
  );
};

export default BillsPage;
