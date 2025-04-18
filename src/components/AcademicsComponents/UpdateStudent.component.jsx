//This component updates or edits the detials of students.

import React, {useEffect, useState} from "react";
import {Table, Col, Row, Container} from "react-bootstrap";

export default function UpdateStudent () {

    //Using updateStudentBySrn api from student.controller.js in backend to update or edit details of students

    const updateStudentsDetails = async () => {
        
    }


    //student state hooks. Will be used to update or edit the student detials
    const [updateStudentDate, setUpdateStudentData] = useState({
        studentSrn: "",
        rollNumber: "",
        firstName: "",
        lastName: "",
        fatherName: "",
        motherName: "",
        email: "",
        personalContact: "",
        ParentContact: "",
        otherContact: "",
        dob: "",
        gender: "",
        category: "",
        address: "",
        districtId: "",
        blockId: "",
        schoolId: "",
        classofStudent: "",
        parent: "",
        enrollmentDate: "",
        batch: "",
        documents: [
            {
                AadharCardNumber: "",
                AadharCardImage: "",
                BirthCertificateNumber: "",
                BirthCertificateImage: "",
                PassportPhoto: ""
            }
        ],
        singleSideDistance: "",
        bothSideDistance: "",
        slc: false,
        isSlcTaken: false,
        slcReleasingDate: "",
        erpEnrollingDate: "",
        medium: "",
        isStudentOf: "",
        isDressGiven: false,
        isTabGiven: false,
        tabIMEI: "",
        isSimGiven: false,
        simNumber: "",
        simIMSI: "",
        bankName: "",
        bankIFSC: "",
        bankAccNumber: "",
        bankHolderName: "",
       
    });



    return (
        <>
        Modal comonent
        </>
    )
}