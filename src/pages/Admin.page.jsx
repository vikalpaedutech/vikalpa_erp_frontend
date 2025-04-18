//This is admin.page.jsx
//This page is for admin. admin can perform CRUD operations from this page. 
//This page will be combination of components.

//importing packages. 
import React, {useState, useEffect} from "react";
import {GetStudents} from "../components/AcademicsComponents/Student.component.jsx";
import {District, Block, School, DistrictBlockSchool} from "../components/DependentDropDowns/DistrictBlockSchool.component.jsx";



export default function AdminPage () {


return (
<>
    I am admin page

    <GetStudents/>
    <hr></hr>
    <br></br>
    <District/>

    <hr></hr>
    <br></br>
    <Block/>
    <hr></hr>
    <br></br>
    <School/>

    <hr></hr>
    <br></br>
    <DistrictBlockSchool/>


    
</>

)



}
