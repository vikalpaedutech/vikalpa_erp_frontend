//This contains the hyperlinks for Bills Pending Bills, Verified/Rejected Bills.


import React, {useState, useEffect} from "react";

import {Breadcrumb, Container, Row, Col} from "react-bootstrap"

import { useLocation } from "react-router-dom";
import BillsVerification from "./BillsVerification";
import VerifiedAndRejectedBills from "./VerifiedAndRejectedBills";

export const MainBillPage = ()=>{

const navigate = useLocation();

const [component, setComponent] = useState("")

    const handleComponent = (id)=>{


        if (id === "1"){

            setComponent(id)
            // navigate("/verify-bills")
        } else if (id === "2"){
            // navigate("/verify-bills")

            setComponent(id)
             
        }

    }

    return (
      <Container fluid>
        <br></br>
        <Breadcrumb>
          <Breadcrumb.Item  id="1" onClick={(e)=>handleComponent("1")}>Pending Bills</Breadcrumb.Item>
          <Breadcrumb.Item id="2" onClick={(e)=>handleComponent("2")}>
            Verified/Rejected Bills
          </Breadcrumb.Item>
          
        </Breadcrumb>

            {component === "1" ? (
            <BillsVerification />
            ) : component === "2" ? (
            <VerifiedAndRejectedBills />
            ) : null}
                    
      </Container>
    );
}