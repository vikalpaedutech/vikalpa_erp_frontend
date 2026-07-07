

import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
    useRef,
} from "react";

import { UserContext } from "../contextAPIs/User.context";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";
import { DateNDateRangeContext } from "../contextAPIs/DateNDateRangePicker";

import {
    School_drop_down,
    Batch_drop_down,
    District_block_school,
} from "../Utils/DependentDropDowns.v2";

import { SingleDatePicker } from "../Utils/DateNDateRangePicker";

import {
    GetMBStudents,
    MarkMBStudentAttendance,
} from "../../service/Student.service";

import {
    Container,
    Card,
    Table,
    Button,
    Badge,
    Spinner,
    ToggleButton,
    ToggleButtonGroup,
    Row,
    Col,
    Alert,
} from "react-bootstrap";

import {
    FaThLarge,
    FaTable,
    FaSpinner,
    FaUserCheck,
    FaUserTimes,
} from "react-icons/fa";
import { ClaimGamificationPoint } from "../../service/Gamification/ClaimGamification.services";


import { GetStudents } from "../../service/Student.service";

export const StudentsV2 = () => {


    const { userData } = useContext(UserContext)

    console.log(userData)

    const {
        districtContext,
        blockContext,
        schoolContext,
        batchContext,
        setSelectedBatch,
    } = useContext(DistrictBlockSschoolContextV2);



    //Get students data

    const fetchStudentsData = async () => {

  
        const reqBody = {

            batch: [batchContext?.batch],
            isSlcTaken: false,
            page: 1,
            limit: 50
        }

        try {

            const response = await GetStudents(reqBody)
            console.log(response.data)


        } catch (error) {
            console.log(error)
        }
    }



    // useEffect(() => {
    //     fetchStudentsData()
    // }, [ batchContext?.batch])


    useEffect(() => {
        console.log('batch mounted', batchContext?.batch)
  fetchStudentsData()
    }, batchContext?.batch)



    return (
        <>
            <Batch_drop_down />
            <District_block_school />


 <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
        </>
    )
}