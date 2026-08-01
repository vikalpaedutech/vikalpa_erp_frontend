import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import Select from 'react-select'


import { getAllUsersWithAccess, updateUserWithAccess } from "../../service/User.service";
import { Button, Container } from "react-bootstrap";

import { Table, Row, Col } from "react-bootstrap"

import DistrictBlockSchool from '../../components/CentersOrSchools/DistrictBlockSchool.json'
import { createGamificationUser } from "../../service/User.service";
import CertificateGenerator from "../../Admin/GENERATETEMPLATE";


export const CreateGamificationUsers = () => {

    const { userData } = useContext(UserContext)


    // console.log(userData.name)



    //states

    const [filterRole, setFilterRole] = useState(null)
    const [data, setData] = useState([]);
    const [distId, setDistId] = useState(null);


    console.log(DistrictBlockSchool)


    //structure of DistrictBlockSchool

    // [
    //     {
    //         "schoolId": "356",
    //         "schoolName": "GMSSSS TOSHAM",
    //         "schoolCode": "356",
    //         "totalStudents": 0,
    //         "totalTeachers": 0,
    //         "blockId": "16",
    //         "blockName": "Tosham",
    //         "districtId": "2",
    //         "districtName": "Bhiwani"
    //     },
    //     {
    //         "schoolId": "784",
    //         "schoolName": "GSSS NAWADA FATEHPUR",
    //         "schoolCode": "784",
    //         "totalStudents": 0,
    //         "totalTeachers": 0,
    //         "blockId": "26",
    //         "blockName": "Gurgaon",
    //         "districtId": "6",
    //         "districtName": "Gurugram"
    //     },]

    //Looping through DistrictBlockSchool and  string unique district name in a new array.

    let region = []; // should look like [{value:"abc", label:"abc"}] for react select

    for (let i = 0; i < DistrictBlockSchool.length; i++) {

        if (region.some((district) => district.value === DistrictBlockSchool[i].districtName)) {

            continue;
        }



        region.push({ value: DistrictBlockSchool[i].districtId, label: DistrictBlockSchool[i].districtName })


        // region.push(DistrictBlockSchool[i].districtName)


    }

    let regionForSelect = []
    console.log(region)


    //Fetching existing users, so that existing users account can be created for gamfication.

    const fetchUser = async () => {

        const reqQuery = {
            page: 1,
            role: filterRole?.value || 'Project Coordinator'

        }
        // if (userData?.name) reqQuery.name = userData?.name;
        // if (userData?.userId) reqQuery.userId = userData?.userId;
        // if (userData?.contact1) reqQuery.contact1 = userData?.contact1;
        // if (userData?.contact2) reqQuery.contact2 = userData?.contact2;
        // if (userData?.department) reqQuery.department = userData?.department;
        // if (userData?.role) reqQuery.role = userData?.role;
        // if (userData?.isActive) reqQuery.isActive = userData?.isActive;
        // if (userData?.email) reqQuery.email = userData?.email;
        try {
            const response = await getAllUsersWithAccess(reqQuery);
            //   if (response.totalPages) setTotalPages(response.totalPages);

            //Console logging my users data.
            console.log(response.data);

            setData(response.data);






        } catch (error) {
            console.log("Error fetching data", error);
        } finally {

        }
    };



    useEffect(() => {

        fetchUser()
    }, [filterRole])



    // React select role frop downs.

    let options = [];

    if (userData?.role === "Community Incharge") {

        options = [
            { value: 'Project Coordinator', label: 'Chocolate' }
        ]
    } else {
        options = [
            { value: 'Project Coordinator', label: 'Project Coordinator' },
            { value: 'ACI', label: 'ACI' },
            { value: 'CC', label: 'CC' },
        ]

    }

  

    //Creating user from existing users.

    const CreateGamificationUser = async (_id) =>{

        alert(_id)

        let regionBody = [ {"districtId":1,
      "blockIds":[
         {
              "blockId":distId,
        "schoolIds":[{
            "schoolId":null
        }, {"schoolId":null}]
         }
      ]
         
      }]

        const reqBody = {
            unqUserObjectId:_id,
            access:["gamification"],
            batch:["2025-27"],
            region:regionBody,
        }

        try {
            
        const response = await createGamificationUser(reqBody)


        } catch (error) {
            console.log(error)
        }
    }





    return (
        <Container fluid>
            <div>
                <section>
                    <label>Role</label>
                    <Select
                        options={options}
                        onChange={(options) => setFilterRole(options)}
                    />
                </section>
                <section>
                    <label></label>
                </section>
            </div>
            <hr></hr>
            <h1>Create Gamification User</h1>
            <h1></h1>

            <div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Role</th>
                            <th>Assign District</th>
                            <th>Submit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user) => {
                            return (
                                <tr >
                                    <td>{"#"}</td>
                                    <td>{user?.name}</td>
                                    <td>{user?.contact1}</td>
                                    <td>{user?.role}</td>
                                    <td><Select

                                        options={region}
                                    /></td>
                                    <td><Button 
                                        onClick={()=>{CreateGamificationUser(user?._id)}}
                                    >Submit</Button></td>

                                </tr>
                            )
                        })}

                    </tbody>
                </Table>

            </div>
        </Container>
    )
}