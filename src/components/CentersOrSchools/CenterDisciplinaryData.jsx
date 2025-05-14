// FRONTEND/src/component/CentersOrSchools/CenterDisciplinaryData.jsx

import React, {useState, useEffect, useContext} from "react";
import { getCenterOrSchoolDisciplinaryDataByUserId } from "../../service/MbCentersDisciplinary.services";
import {Row, Col, Table, Container} from "react-bootstrap";
import { UserContext } from "../contextAPIs/User.context";

export const CenterDisciplinaryData = () => {

    //React hooks

    const [centerDisciplinaryData, setCenterDisciplinaryData] = useState([])

    //______________________________________________________


    //Using context hooks
    const {userData, setUserData} = useContext(UserContext)

    //_________________________________________________________

    const queryParams = {
        userId: userData?.[0]?.userId ?? "Admin",
        dateOfRecord: new Date().toISOString().split("T")[0]+'T00:00:00.000+00:00',
    }

    const fetchCenterDisciplinaryData =async () => {

        


        
        try {
            
            const response = await getCenterOrSchoolDisciplinaryDataByUserId(queryParams);
            
            setCenterDisciplinaryData(response.data);

            console.log(response.data)

        } catch (error) {
            
            console.log("Error fetching center disciplinary data", error.message)
        }
    }

    useEffect(()=>{

        fetchCenterDisciplinaryData();
        
    }, [])

    // Sort by districtName
const sortCenterDisciplinaryData = centerDisciplinaryData.sort((a, b) => {
    if (a.districtName < b.districtName) return -1;
    if (a.districtName > b.districtName) return 1;
    return 0;
});

    return (

        <Container fluid>
            <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>District</th>
          <th>Block</th>
          <th>School</th>
          <th>Class</th>
          <th>Disciplinary/Interaction</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {centerDisciplinaryData.length>0 ? centerDisciplinaryData.map((eachData, index) => {
            return (
                <tr id={index}>
                    <td>{eachData.districtName}</td>
                    <td>{eachData.blockName}</td>
                    <td>{eachData.schoolName}</td>
                    <td>{eachData.schoolName}</td>
                    <td>{eachData.classOfStudent}</td>
                    <td>{eachData.disciplinaryOrInteraction}</td>
                    <td>{eachData.disciplinaryOrInteractiionRemark}</td>
                </tr>
            )
        }):(null)}
    
      </tbody>
    </Table>
        </Container>
    )
}


