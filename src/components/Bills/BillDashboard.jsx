//This will have the dashboard of bills. 
//Using this admin can download and update the status of bills as paid, or bulk approve and
//...rejection can be done from here


import React from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Card, Col, Row, Table, Button, ProgressBar, Form } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import { SchoolContext, BlockContext, DistrictBlockSchoolContext, ClassContext } from "../contextAPIs/DependentDropdowns.contextAPI";
import { getBillsByQueryParams, deleteBill, getAllBills, getAllBillsWithUserDetails } from "../../service/Bills.services";
import { District, DistrictBlockSchoolById, ClassOfStudent } from "../DependentDropDowns/DistrictBlockSchool.component";

export const BillDashboard = () => {
  //Context apis
  const { userData, setUserData } = useContext(UserContext);
  const { districtContext, setDistrictContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext, setBlockContext } = useContext(BlockContext);
  const { schoolContext, setSchoolContext } = useContext(SchoolContext);
  const { classContext, setClassContext } = useContext(ClassContext);

  //Usestate hooks.
  const [billsData, setBillsData] = useState([]);
  const [statusSelections, setStatusSelections] = useState({}); // to track dropdown selections

  



  //Get all bills with user details.

  const FetchAllBillsData = async () => {
  try {
    const data = await getAllBillsWithUserDetails(); // this is already JSON
    console.log(data); // ✅ now you'll see your array/object
    setBillsData(data.data); // if your API returns { status: "Success", data: [...] }
    console.log('I am inside try block');
  } catch (error) {
    console.log("Error fetching bills data", error.message);
    console.log('I am inside catch block');
  }
};

useEffect(()=>{
    FetchAllBillsData()
},[])

console.log('Hello dev')
  return (
    <Container>
      <h1>Hello bills</h1>
    </Container>
  );
};
