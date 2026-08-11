// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import Select from 'react-select'


// import { getAllUsersWithAccess, updateUserWithAccess } from "../../service/User.service";
// import { Button, Container } from "react-bootstrap";

// import { Table, Row, Col } from "react-bootstrap"

// import DistrictBlockSchool from '../../components/CentersOrSchools/DistrictBlockSchool.json'
// import { createGamificationUser } from "../../service/User.service";
// import CertificateGenerator from "../../Admin/GENERATETEMPLATE";
// import { Batch_drop_down } from "../Utils/DependentDropDowns.v2";


// export const CreateGamificationUsers = () => {

//     const { userData } = useContext(UserContext)


//     // console.log(userData.name)



//     //states

//     const [filterRole, setFilterRole] = useState(null)
//     const [data, setData] = useState([]);
//     const [distId, setDistId] = useState(null);


//     console.log(DistrictBlockSchool)


//     //structure of DistrictBlockSchool

//     // [
//     //     {
//     //         "schoolId": "356",
//     //         "schoolName": "GMSSSS TOSHAM",
//     //         "schoolCode": "356",
//     //         "totalStudents": 0,
//     //         "totalTeachers": 0,
//     //         "blockId": "16",
//     //         "blockName": "Tosham",
//     //         "districtId": "2",
//     //         "districtName": "Bhiwani"
//     //     },
//     //     {
//     //         "schoolId": "784",
//     //         "schoolName": "GSSS NAWADA FATEHPUR",
//     //         "schoolCode": "784",
//     //         "totalStudents": 0,
//     //         "totalTeachers": 0,
//     //         "blockId": "26",
//     //         "blockName": "Gurgaon",
//     //         "districtId": "6",
//     //         "districtName": "Gurugram"
//     //     },]

//     //Looping through DistrictBlockSchool and  string unique district name in a new array.

//     let region = []; // should look like [{value:"abc", label:"abc"}] for react select

//     for (let i = 0; i < DistrictBlockSchool.length; i++) {

//         if (region.some((district) => district.value === DistrictBlockSchool[i].districtName)) {

//             continue;
//         }



//         region.push({ value: DistrictBlockSchool[i].districtId, label: DistrictBlockSchool[i].districtName })


//         // region.push(DistrictBlockSchool[i].districtName)


//     }

//     let regionForSelect = []
//     console.log(region)


//     //Fetching existing users, so that existing users account can be created for gamfication.

//     const fetchUser = async () => {

//         const reqQuery = {
//             page: 1,
//             role: filterRole?.value || 'Project Coordinator'

//         }
//         // if (userData?.name) reqQuery.name = userData?.name;
//         // if (userData?.userId) reqQuery.userId = userData?.userId;
//         // if (userData?.contact1) reqQuery.contact1 = userData?.contact1;
//         // if (userData?.contact2) reqQuery.contact2 = userData?.contact2;
//         // if (userData?.department) reqQuery.department = userData?.department;
//         // if (userData?.role) reqQuery.role = userData?.role;
//         // if (userData?.isActive) reqQuery.isActive = userData?.isActive;
//         // if (userData?.email) reqQuery.email = userData?.email;
//         try {
//             const response = await getAllUsersWithAccess(reqQuery);
//             //   if (response.totalPages) setTotalPages(response.totalPages);

//             //Console logging my users data.
//             console.log(response.data);

//             setData(response.data);






//         } catch (error) {
//             console.log("Error fetching data", error);
//         } finally {

//         }
//     };



//     useEffect(() => {

//         fetchUser()
//     }, [filterRole])



//     // React select role frop downs.

//     let options = [];

//     if (userData?.role === "Community Incharge") {

//         options = [
//             { value: 'Project Coordinator', label: 'Chocolate' }
//         ]
//     } else {
//         options = [
//             { value: 'Project Coordinator', label: 'Project Coordinator' },
//             { value: 'ACI', label: 'ACI' },
//             { value: 'CC', label: 'CC' },
//         ]

//     }

  

//     //Creating user from existing users.

//     const CreateGamificationUser = async (_id) =>{

//         alert(_id)

//         let regionBody = [ {"districtId":1,
//       "blockIds":[
//          {
//               "blockId":distId,
//         "schoolIds":[{
//             "schoolId":null
//         }, {"schoolId":null}]
//          }
//       ]
         
//       }]

//         const reqBody = {
//             unqUserObjectId:_id,
//             access:["gamification"],
//             batch:["2025-27"],
//             region:regionBody,
//         }

//         try {
            
//         const response = await createGamificationUser(reqBody)


//         } catch (error) {
//             console.log(error)
//         }
//     }





//     return (
//         <Container fluid>
//             <div>
//                 <section>
//                     <label>Role</label>
//                     <Select
//                         options={options}
//                         onChange={(options) => setFilterRole(options)}
//                     />
//                 </section>
//                 <section>
//                     <label></label>
//                 </section>
//             </div>
//             <hr></hr>
//             <h1>Create Gamification User</h1>
//             <h1></h1>

//             <div>

//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>#</th>
//                             <th>Name</th>
//                             <th>Contact</th>
//                             <th>Role</th>
//                             <th>Assign District</th>
//                             <th>Batch</th>
//                             <th>Submit</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((user) => {
//                             return (
//                                 <tr >
//                                     <td>{"#"}</td>
//                                     <td>{user?.name}</td>
//                                     <td>{user?.contact1}</td>
//                                     <td>{user?.role}</td>
//                                     <td><Select

//                                         options={region}
//                                     /></td>
//                                     <td>
//                                        <Select
//                                        options={[
//                                         {value:"2025-27", label:"2025-27"},
//                                         {value:"2026-28", label:"2026-28"},
//                                        ]}
//                                        />
//                                     </td>
//                                     <td><Button 
//                                         onClick={()=>{CreateGamificationUser(user?._id)}}
//                                     >Submit</Button></td>

//                                 </tr>
//                             )
//                         })}

//                     </tbody>
//                 </Table>

//             </div>
//         </Container>
//     )
// }











import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import Select from 'react-select'

import { getAllUsersWithAccess, updateUserWithAccess } from "../../service/User.service";
import { Button, Container } from "react-bootstrap";
import { Table, Row, Col } from "react-bootstrap"
import DistrictBlockSchool from '../../components/CentersOrSchools/DistrictBlockSchool.json'
import { createGamificationUser } from "../../service/User.service";

export const CreateGamificationUsers = () => {

    const { userData } = useContext(UserContext)

    //states
    const [filterRole, setFilterRole] = useState(null)
    const [data, setData] = useState([]);
    
    // ✅ State to store selected districts and batches for each user
    const [selectedDistricts, setSelectedDistricts] = useState({});
    const [selectedBatches, setSelectedBatches] = useState({});

    // ✅ Get unique districts from DistrictBlockSchool
    const getUniqueDistricts = () => {
        const districtMap = new Map();
        DistrictBlockSchool.forEach((school) => {
            if (!districtMap.has(school.districtId)) {
                districtMap.set(school.districtId, {
                    value: school.districtId,
                    label: school.districtName
                });
            }
        });
        return Array.from(districtMap.values());
    };

    const districtOptions = getUniqueDistricts();

    // ✅ Batch options
    const batchOptions = [
        { value: "2024-26", label: "2024-26" },
        { value: "2025-27", label: "2025-27" },
        { value: "2026-28", label: "2026-28" }
    ];

    // Fetching existing users
    const fetchUser = async () => {
        const reqQuery = {
            page: 1,
            role: filterRole?.value || 'Project Coordinator'
        }
        try {
            const response = await getAllUsersWithAccess(reqQuery);
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.log("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchUser()
    }, [filterRole])

    // React select role dropdowns
    let options = [];
    if (userData?.role === "Community Incharge") {
        options = [
            { value: 'Project Coordinator', label: 'Project Coordinator' }
        ]
    } else {
        options = [
            { value: 'Project Coordinator', label: 'Project Coordinator' },
            { value: 'ACI', label: 'ACI' },
            { value: 'CC', label: 'CC' },
        ]
    }

    // ✅ Build full region data from selected districts
    const buildFullRegionData = (districtIds) => {
        if (!districtIds || districtIds.length === 0) return [];

        const regionMap = new Map();

        DistrictBlockSchool.forEach((school) => {
            if (districtIds.includes(school.districtId)) {
                // Get or create district entry
                if (!regionMap.has(school.districtId)) {
                    regionMap.set(school.districtId, {
                        districtId: school.districtId,
                        blockIds: []
                    });
                }

                const district = regionMap.get(school.districtId);
                
                // Find or create block entry
                let blockEntry = district.blockIds.find(b => b.blockId === school.blockId);
                if (!blockEntry) {
                    blockEntry = {
                        blockId: school.blockId,
                        schoolIds: []
                    };
                    district.blockIds.push(blockEntry);
                }

                // Add school if not already exists
                if (!blockEntry.schoolIds.some(s => s.schoolId === school.schoolId)) {
                    blockEntry.schoolIds.push({ schoolId: school.schoolId });
                }
            }
        });

        return Array.from(regionMap.values());
    };

    // ✅ Handle district selection for a user
    const handleDistrictChange = (userId, selectedOptions) => {
        setSelectedDistricts(prev => ({
            ...prev,
            [userId]: selectedOptions || []
        }));
    };

    // ✅ Handle batch selection for a user
    const handleBatchChange = (userId, selectedOptions) => {
        setSelectedBatches(prev => ({
            ...prev,
            [userId]: selectedOptions || []
        }));
    };

    // ✅ Create Gamification User with full region data
    const CreateGamificationUser = async (userId) => {
        const districts = selectedDistricts[userId] || [];
        const batches = selectedBatches[userId] || [];

        // ✅ Validate selections
        if (districts.length === 0) {
            alert("Please select at least one district for the user");
            return;
        }
        if (batches.length === 0) {
            alert("Please select at least one batch for the user");
            return;
        }

        // ✅ Build full region structure with all blocks and schools
        const districtIds = districts.map(d => d.value);
        const regionBody = buildFullRegionData(districtIds);

        const reqBody = {
            unqUserObjectId: userId,
            access: ["gamification"],
            batch: batches.map(b => b.value),
            region: regionBody,
        };

        console.log("Creating Gamification User with payload:", JSON.stringify(reqBody, null, 2));

        try {
            const response = await createGamificationUser(reqBody);
            alert(`✅ Gamification user created successfully!`);
            
            // ✅ Clear selections for this user after successful creation
            setSelectedDistricts(prev => ({ ...prev, [userId]: [] }));
            setSelectedBatches(prev => ({ ...prev, [userId]: [] }));
            
            // Refresh the user list
            fetchUser();
        } catch (error) {
            console.log(error);
            alert("❌ Error creating gamification user: " + error.message);
        }
    };

    return (
        <Container fluid>
            <div>
                <section>
                    <label>Role</label>
                    <Select
                        options={options}
                        onChange={(options) => setFilterRole(options)}
                        isClearable
                        placeholder="Filter by role..."
                    />
                </section>
            </div>
            <hr />
            <h1>Create Gamification User</h1>

            <div style={{ overflowX: 'auto' }}>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Role</th>
                            <th style={{ minWidth: "250px" }}>Select Districts <span style={{ color: "red" }}>*</span></th>
                            <th style={{ minWidth: "200px" }}>Select Batches <span style={{ color: "red" }}>*</span></th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((user, index) => {
                                const districts = selectedDistricts[user?._id] || [];
                                const batches = selectedBatches[user?._id] || [];

                                const isFormValid = districts.length > 0 && batches.length > 0;

                                // ✅ Show preview of what will be added
                                const districtIds = districts.map(d => d.value);
                                const totalBlocks = DistrictBlockSchool.filter(s => districtIds.includes(s.districtId)).length;
                                const totalSchools = DistrictBlockSchool.filter(s => districtIds.includes(s.districtId)).length;

                                return (
                                    <tr key={user?._id || index}>
                                        <td>{index + 1}</td>
                                        <td>{user?.name || 'N/A'}</td>
                                        <td>{user?.contact1 || 'N/A'}</td>
                                        <td>{user?.role || 'N/A'}</td>
                                        <td>
                                            <Select
                                                options={districtOptions}
                                                isMulti
                                                value={districts}
                                                onChange={(selected) => handleDistrictChange(user?._id, selected)}
                                                placeholder="Select district(s)..."
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            {districts.length > 0 && (
                                                <small style={{ color: "#28a745", display: "block", marginTop: "4px" }}>
                                                    ✅ {districts.length} district(s) selected 
                                                    (Auto-includes all blocks & schools)
                                                </small>
                                            )}
                                            {districts.length > 0 && (
                                                <small style={{ color: "#6c757d", display: "block", marginTop: "2px" }}>
                                                    📊 {totalBlocks} blocks • {totalSchools} schools will be added
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            <Select
                                                options={batchOptions}
                                                isMulti
                                                value={batches}
                                                onChange={(selected) => handleBatchChange(user?._id, selected)}
                                                placeholder="Select batch(es)..."
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                            {batches.length > 0 && (
                                                <small style={{ color: "#28a745", display: "block", marginTop: "4px" }}>
                                                    ✅ {batches.length} batch(es) selected
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            <Button 
                                                variant="primary"
                                                size="sm"
                                                onClick={() => CreateGamificationUser(user?._id)}
                                                disabled={!isFormValid}
                                            >
                                                Create
                                            </Button>
                                            {!isFormValid && (
                                                <div>
                                                    <small style={{ color: "#dc3545", fontSize: "10px" }}>
                                                        Select district & batch
                                                    </small>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
                                    <div className="text-muted">No users found</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    )
}