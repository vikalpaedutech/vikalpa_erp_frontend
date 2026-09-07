

// // src/components/EditUserAccess.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,
//   Spinner,
//   Alert,
//   ToggleButton,
//   ToggleButtonGroup,
//   Badge
// } from "react-bootstrap";
// import Select from "react-select";
// import { useLocation, useNavigate } from "react-router-dom";
// import { updateUserAccesses, getUsersByObjectId } from "../service/User.service";
// import { GetDistrictBlockSchoolByParams } from "../service/DistrictBlockSchool.service";

// export const EditUserAccess = () => {


//   const location = useLocation();
//   const navigate = useNavigate();
//   const userAccessData = location.state?.fetchedAccessData;

//   // States
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState({}); // Track which item is being updated
//   const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
//   const [accessLevel, setAccessLevel] = useState("school");
  
//   // User's current access data
//   const [userAccess, setUserAccess] = useState(null);
//   const [unqObjectId, setUnqObjectId] = useState("");
//   const [userId, setUserId] = useState("");
  
//   // DB data for all districts, blocks, schools
//   const [dbDistrictBlockSchoolData, setDbDistrictBlockSchoolData] = useState([]);
  
//   // Filter states
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);
  
//   // Filter options
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [blockOptions, setBlockOptions] = useState([]);
//   const [schoolOptions, setSchoolOptions] = useState([]);
  
//   // Processed data for display
//   const [schoolLevelData, setSchoolLevelData] = useState([]);
//   const [districtLevelData, setDistrictLevelData] = useState([]);
//   const [batchData, setBatchData] = useState([]);

//   // Available batches
//   const allBatches = ["2024-26", "2025-27", "2026-28", "2027-29"];

//   // Show alert message
//   const showAlert = useCallback((message, variant) => {
//     setAlert({ show: true, message, variant });
//     setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
//   }, []);

//   // Refresh user data from server
//   const refreshUserData = useCallback(async () => {
//     if (!unqObjectId) return;

//     try {
//       const response = await getUsersByObjectId({ _id: unqObjectId });
//       if (response.status === "Success" && response.data?.[0]) {
//         const newUserAccess = response.data[0].accessDetails;
//         setUserAccess(newUserAccess);
        
//         // Update batch data
//         const userBatches = newUserAccess?.batch || [];
        
//         setBatchData(
//           allBatches.map(batchName => ({
//             batchName,
//             isAssigned: userBatches.includes(batchName)
//           }))
//         );
        
//         showAlert("Data refreshed successfully", "success");
//       }
//     } catch (error) {
//       console.error("Error refreshing user data:", error);
//       showAlert("Error refreshing data", "danger");
//     }
//   }, [unqObjectId, showAlert]);

//   // Parse user access data
//   useEffect(() => {
//     if (userAccessData?.data?.[0]) {
//       const user = userAccessData.data[0];
//       setUserAccess(user.accessDetails);
//       setUnqObjectId(user._id);
//       setUserId(user.userId);
      
//       // Initialize batch data
//       const userBatches = user.accessDetails?.batch || [];
//       setBatchData(
//         allBatches.map(batchName => ({
//           batchName,
//           isAssigned: userBatches.includes(batchName)
//         }))
//       );
//     }
//   }, [userAccessData]);

//   // Fetch district-block-school data
//   const fetchDistrictBlockSchool = async () => {


   
//     setLoading(true);
//     try {
//       const response = await GetDistrictBlockSchoolByParams();
//       setDbDistrictBlockSchoolData(response.data);
     
//       // Debug log to check data structure
//       if (response.data && response.data.length > 0) {
//         console.log('📋 Sample school data:', response.data[0]);
//         console.log('✅ schoolId exists?', response.data[0].schoolId ? 'Yes' : 'No');
//       }
//     } catch (error) {
//       console.log("Error::::>", error);
//       showAlert("Error fetching district data", "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDistrictBlockSchool();
//   }, [showAlert]);

//   // Process school-level data
//   useEffect(() => {
//     if (dbDistrictBlockSchoolData.length > 0 && userAccess) {
//       processSchoolLevelData();
//     }
//   }, [dbDistrictBlockSchoolData, userAccess, selectedDistrict, selectedBlock, selectedSchool]);

//   // Process district-level data
//   useEffect(() => {
//     if (dbDistrictBlockSchoolData.length > 0 && userAccess) {
//       processDistrictLevelData();
//     }
//   }, [dbDistrictBlockSchoolData, userAccess]);

//   // Create filter options
//   useEffect(() => {
//     createFilterOptions();
//   }, [dbDistrictBlockSchoolData, selectedDistrict, selectedBlock]);

//   const processSchoolLevelData = () => {
//     const schoolMap = new Map();
    
//     dbDistrictBlockSchoolData.forEach(item => {
//           console.log('🔍 Item fields:', Object.keys(item));
//       // Skip if schoolId is missing or empty
//       if (!item.schoolId || item.schoolId === '') {
//         return;
//       }

//       const districtId = item.districtId;
//       const districtName = item.districtName;
//       const blockId = item.blockId;
//       const blockName = item.blockName;
//       const schoolId = item.schoolId;  // Changed from centerId
//       const schoolName = item.schoolName;  // Changed from centerName

//       // Check if this school is assigned to user
//       let isAssigned = false;
      
//       if (userAccess?.region) {
//         const district = userAccess.region.find(d => d.districtId === districtId);
//         if (district) {
//           const block = district.blockIds?.find(b => b.blockId === blockId);
//           if (block) {
//             // Filter out empty school objects
//             const schoolExists = block.schoolIds?.some(s => s.schoolId === schoolId);
//             if (schoolExists) {
//               isAssigned = true;
//             }
//           }
//         }
//       }

//       // Apply filters
//       if (selectedDistrict && selectedDistrict.value !== districtId) return;
//       if (selectedBlock && selectedBlock.value !== blockId) return;
//       if (selectedSchool && selectedSchool.value !== schoolId) return;

//       const key = `${districtId}-${blockId}-${schoolId}`;
//       schoolMap.set(key, {
//         districtId,
//         districtName,
//         blockId,
//         blockName,
//         schoolId,
//         schoolName,
//         isAssigned
//       });
//     });

//     setSchoolLevelData(Array.from(schoolMap.values()));
//   };

//   const processDistrictLevelData = () => {
//     const districtMap = new Map();
    
//     // Get all unique districts from DB
//     const districts = [...new Set(dbDistrictBlockSchoolData.map(item => item.districtId))];
    
//     districts.forEach(districtId => {
//       const firstItem = dbDistrictBlockSchoolData.find(item => item.districtId === districtId);
//       const districtName = firstItem?.districtName || districtId;
      
//       // Check if district is assigned (has at least one school assigned)
//       let isAssigned = false;
//       if (userAccess?.region) {
//         const district = userAccess.region.find(d => d.districtId === districtId);
//         if (district) {
//           // Check if district has any blocks with schools
//           const hasSchools = district.blockIds?.some(block => 
//             block.schoolIds && block.schoolIds.length > 0 && 
//             block.schoolIds.some(s => s.schoolId && s.schoolId !== '')
//           );
//           isAssigned = hasSchools || false;
//         }
//       }

//       districtMap.set(districtId, {
//         districtId,
//         districtName,
//         isAssigned
//       });
//     });

//     setDistrictLevelData(Array.from(districtMap.values()));
//   };

//   const createFilterOptions = () => {
//     // District options
//     const districts = [...new Map(
//       dbDistrictBlockSchoolData.map(item => [
//         item.districtId, 
//         { value: item.districtId, label: item.districtName }
//       ])
//     ).values()];
//     setDistrictOptions(districts);

//     // Block options
//     if (selectedDistrict) {
//       const blocks = [...new Map(
//         dbDistrictBlockSchoolData
//           .filter(item => item.districtId === selectedDistrict.value)
//           .map(item => [item.blockId, { value: item.blockId, label: item.blockName }])
//       ).values()];
//       setBlockOptions(blocks);
//     } else {
//       setBlockOptions([]);
//     }

//     // School options - Changed from centerId to schoolId
//     if (selectedDistrict && selectedBlock) {
//       const schools = dbDistrictBlockSchoolData
//         .filter(item => 
//           item.districtId === selectedDistrict.value && 
//           item.blockId === selectedBlock.value
//         )
//         .map(item => ({
//           value: item.schoolId,  // Changed from centerId
//           label: item.schoolName  // Changed from centerName
//         }));
//       setSchoolOptions(schools);
//     } else {
//       setSchoolOptions([]);
//     }
//   };

//   const handleDistrictFilter = (option) => {
//     setSelectedDistrict(option);
//     setSelectedBlock(null);
//     setSelectedSchool(null);
//   };

//   const handleBlockFilter = (option) => {
//     setSelectedBlock(option);
//     setSelectedSchool(null);
//   };

//   const handleSchoolFilter = (option) => {
//     setSelectedSchool(option);
//   };

//   const resetFilters = () => {
//     setSelectedDistrict(null);
//     setSelectedBlock(null);
//     setSelectedSchool(null);
//   };

//   // Handle school add/remove with immediate UI update
//   const handleSchoolAccess = async (schoolItem, action) => {
//     // Validate schoolId
//     if (!schoolItem.schoolId || schoolItem.schoolId === '') {
//       showAlert("Invalid school ID", "danger");
//       return;
//     }

//     const updateKey = `school-${schoolItem.schoolId}`;
//     setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
//     try {
//       const requestBody = {
//         unqObjectId,
//         ...(action === 'add' ? {
//           addSchool: {
//             districtId: schoolItem.districtId,
//             blockId: schoolItem.blockId,
//             schoolId: schoolItem.schoolId
//           }
//         } : {
//           removeSchool: {
//             districtId: schoolItem.districtId,
//             blockId: schoolItem.blockId,
//             schoolId: schoolItem.schoolId
//           }
//         })
//       };

//       console.log('📤 Sending school request:', JSON.stringify(requestBody, null, 2));

//       const response = await updateUserAccesses(requestBody);
      
//       if (response.status === "Success") {
//         // Update local state immediately
//         setUserAccess(prev => ({
//           ...prev,
//           region: response.data.region
//         }));
        
//         // Update school level data
//         setSchoolLevelData(prev =>
//           prev.map(item =>
//             item.schoolId === schoolItem.schoolId
//               ? { ...item, isAssigned: action === 'add' }
//               : item
//           )
//         );
        
//         showAlert(`School ${action === 'add' ? 'added' : 'removed'} successfully`, "success");
//       }
//     } catch (error) {
//       console.error("Error updating school access:", error);
//       showAlert("Error updating school access", "danger");
//     } finally {
//       setUpdating(prev => ({ ...prev, [updateKey]: false }));
//     }
//   };

//   // Handle district add/remove with immediate UI update
//   const handleDistrictAccess = async (districtItem, action) => {
//     const updateKey = `district-${districtItem.districtId}`;
//     setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
//     try {
//       const requestBody = {
//         unqObjectId,
//         ...(action === 'add' ? {
//           addDistrict: {
//             districtId: districtItem.districtId
//           }
//         } : {
//           removeDistrict: {
//             districtId: districtItem.districtId
//           }
//         })
//       };

//       const response = await updateUserAccesses(requestBody);
      
//       if (response.status === "Success") {
//         // Update local state immediately
//         setUserAccess(prev => ({
//           ...prev,
//           region: response.data.region
//         }));
        
//         showAlert(`District ${action === 'add' ? 'added' : 'removed'} successfully`, "success");
//       }
//     } catch (error) {
//       console.error("Error updating district access:", error);
//       showAlert("Error updating district access", "danger");
//     } finally {
//       setUpdating(prev => ({ ...prev, [updateKey]: false }));
//     }
//   };

//   // Handle bulk district add - FIXED VERSION
//   const handleBulkAddDistrict = async (districtId) => {
//     const updateKey = `bulk-${districtId}`;
//     setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
//     try {
//       console.log('=== Starting Bulk Add for District:', districtId);
      
//       // Get all schools in this district
//       const districtSchools = dbDistrictBlockSchoolData.filter(
//         item => item.districtId === districtId
//       );
      
//       console.log('Total schools in district:', districtSchools.length);
      
//       // STEP 1: Add the district first
//       console.log('STEP 1: Adding district...');
//       await updateUserAccesses({
//         unqObjectId,
//         addDistrict: { districtId }
//       });

//       // STEP 2: Get all unique blocks
//       const blocks = [...new Set(districtSchools.map(item => item.blockId))];
//       console.log('STEP 2: Adding blocks:', blocks);

//       // Add each block
//       for (const blockId of blocks) {
//         await updateUserAccesses({
//           unqObjectId,
//           addBlock: { districtId, blockId }
//         });
//         console.log(`✅ Block ${blockId} added`);
//       }

//       // STEP 3: Add all schools
//       console.log('STEP 3: Adding schools...');
//       let schoolCount = 0;
//       for (const school of districtSchools) {
//         // Validate schoolId
//         if (school.schoolId && school.schoolId !== '') {
//           await updateUserAccesses({
//             unqObjectId,
//             addSchool: {
//               districtId: districtId,
//               blockId: school.blockId,
//               schoolId: school.schoolId  // Changed from centerId
//             }
//           });
//           schoolCount++;
//           console.log(`✅ School ${school.schoolId} added`);
          
//           // Small delay to prevent rate limiting
//           await new Promise(resolve => setTimeout(resolve, 50));
//         } else {
//           console.warn('⚠️ Skipping school with no schoolId:', school);
//         }
//       }
      
//       console.log(`✅ Total schools added: ${schoolCount}`);

//       // Refresh data after all operations
//       await refreshUserData();
      
//       showAlert(`District added successfully with ${schoolCount} schools`, "success");
//     } catch (error) {
//       console.error("Error in bulk add district:", error);
//       showAlert("Error in bulk add district", "danger");
//     } finally {
//       setUpdating(prev => ({ ...prev, [updateKey]: false }));
//     }
//   };

//   // Handle batch add/remove with immediate UI update
//   const handleBatchAccess = async (batchName, action) => {
//     const updateKey = `batch-${batchName}`;
//     setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
//     try {
//       const currentBatches = userAccess?.batch || [];
//       let updatedBatches;

//       if (action === 'add') {
//         updatedBatches = [...currentBatches, batchName];
//       } else {
//         updatedBatches = currentBatches.filter(b => b !== batchName);
//       }

//       const requestBody = {
//         unqObjectId,
//         batch: updatedBatches
//       };

//       const response = await updateUserAccesses(requestBody);
      
//       if (response.status === "Success") {
//         // Update local state immediately
//         setUserAccess(prev => ({
//           ...prev,
//           batch: response.data.batch
//         }));
        
//         // Update batch data
//         setBatchData(prev =>
//           prev.map(item =>
//             item.batchName === batchName
//               ? { ...item, isAssigned: action === 'add' }
//               : item
//           )
//         );
        
//         showAlert(`Batch ${action === 'add' ? 'added' : 'removed'} successfully`, "success");
//       }
//     } catch (error) {
//       console.error("Error updating batch access:", error);
//       showAlert("Error updating batch access", "danger");
//     } finally {
//       setUpdating(prev => ({ ...prev, [updateKey]: false }));
//     }
//   };

//   // Handle bulk batch add
//   const handleBulkBatchAdd = async () => {
//     setUpdating(prev => ({ ...prev, bulkBatches: true }));
    
//     try {
//       const requestBody = {
//         unqObjectId,
//         batch: allBatches
//       };

//       const response = await updateUserAccesses(requestBody);
      
//       if (response.status === "Success") {
//         // Update local state immediately
//         setUserAccess(prev => ({
//           ...prev,
//           batch: response.data.batch
//         }));
        
//         // Update all batch data
//         setBatchData(prev =>
//           prev.map(item => ({ ...item, isAssigned: true }))
//         );
        
//         showAlert("All batches added successfully", "success");
//       }
//     } catch (error) {
//       console.error("Error adding all batches:", error);
//       showAlert("Error adding all batches", "danger");
//     } finally {
//       setUpdating(prev => ({ ...prev, bulkBatches: false }));
//     }
//   };

//   if (loading && !userAccess) {
//     return (
//       <Container className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="py-4">
//       {/* Alert */}
//       {alert.show && (
//         <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
//           {alert.message}
//         </Alert>
//       )}

//       {/* Header */}
//       <Row className="mb-4">
//         <Col>
//           <h2>Edit User Access</h2>
//           <p className="text-muted">
//             User: {userAccessData?.data?.[0]?.name} ({userId})
//           </p>
//         </Col>
//         <Col className="text-end">
//           <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
//             Back
//           </Button>
//           <Button variant="info" onClick={refreshUserData} disabled={updating.bulkBatches}>
//             Refresh Data
//           </Button>
//         </Col>
//       </Row>

//       {/* Access Level Toggle */}
//       <Card className="mb-4">
//         <Card.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Label>Access Level</Form.Label>
//               <ToggleButtonGroup
//                 type="radio"
//                 name="accessLevel"
//                 value={accessLevel}
//                 onChange={(val) => setAccessLevel(val)}
//               >
//                 <ToggleButton id="tbg-radio-1" value="school" variant="outline-primary">
//                   School Level Access
//                 </ToggleButton>
//                 <ToggleButton id="tbg-radio-2" value="district" variant="outline-primary">
//                   District Level Access
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Filters */}
//       {accessLevel === "school" && (
//         <Card className="mb-4">
//           <Card.Header>
//             <h5>Filters</h5>
//           </Card.Header>
//           <Card.Body>
//             <Row>
//               <Col md={3}>
//                 <Form.Label>District</Form.Label>
//                 <Select
//                   options={districtOptions}
//                   value={selectedDistrict}
//                   onChange={handleDistrictFilter}
//                   isClearable
//                   placeholder="Select District"
//                 />
//               </Col>
//               <Col md={3}>
//                 <Form.Label>Block</Form.Label>
//                 <Select
//                   options={blockOptions}
//                   value={selectedBlock}
//                   onChange={handleBlockFilter}
//                   isClearable
//                   placeholder="Select Block"
//                   isDisabled={!selectedDistrict}
//                 />
//               </Col>
//               <Col md={3}>
//                 <Form.Label>School</Form.Label>
//                 <Select
//                   options={schoolOptions}
//                   value={selectedSchool}
//                   onChange={handleSchoolFilter}
//                   isClearable
//                   placeholder="Select School"
//                   isDisabled={!selectedBlock}
//                 />
//               </Col>
//               <Col md={3} className="d-flex align-items-end">
//                 <Button variant="outline-secondary" onClick={resetFilters}>
//                   Clear Filters
//                 </Button>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//       )}

//       {/* School Level Access Table */}
//       {accessLevel === "school" ? (
//         <Card className="mb-4">
//           <Card.Header>
//             <h5>School Level Access</h5>
//             <Badge bg="info">{schoolLevelData.length} schools found</Badge>
//           </Card.Header>
//           <Card.Body>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>District</th>
//                   <th>Block</th>
//                   <th>School</th>
//                   <th>Access</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {schoolLevelData.length > 0 ? (
//                   schoolLevelData.map((item, index) => {
//                     const updateKey = `school-${item.schoolId}`;
//                     const isUpdating = updating[updateKey];
                    
//                     return (
//                       <tr key={index}>
//                         <td>{item.districtName}</td>
//                         <td>{item.blockName}</td>
//                         <td>{item.schoolName}</td>
//                         <td>
//                           {isUpdating ? (
//                             <Spinner animation="border" size="sm" />
//                           ) : item.isAssigned ? (
//                             <Button
//                               variant="success"
//                               size="sm"
//                               onClick={() => handleSchoolAccess(item, 'remove')}
//                               disabled={isUpdating}
//                             >
//                               Remove
//                             </Button>
//                           ) : (
//                             <Button
//                               variant="danger"
//                               size="sm"
//                               onClick={() => handleSchoolAccess(item, 'add')}
//                               disabled={isUpdating}
//                             >
//                               Add
//                             </Button>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center">
//                       No schools found matching the filters
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       ) : (
//         /* District Level Access Table */
//         <Card className="mb-4">
//           <Card.Header>
//             <h5>District Level Access</h5>
//             <Badge bg="info">{districtLevelData.length} districts found</Badge>
//           </Card.Header>
//           <Card.Body>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>District</th>
//                   <th>Access</th>
//                   <th>Bulk Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {districtLevelData.map((item, index) => {
//                   const updateKey = `district-${item.districtId}`;
//                   const bulkKey = `bulk-${item.districtId}`;
//                   const isUpdating = updating[updateKey];
//                   const isBulkUpdating = updating[bulkKey];
                  
//                   return (
//                     <tr key={index}>
//                       <td>{item.districtName}</td>
//                       <td>
//                         {isUpdating ? (
//                           <Spinner animation="border" size="sm" />
//                         ) : item.isAssigned ? (
//                           <Button
//                             variant="success"
//                             size="sm"
//                             onClick={() => handleDistrictAccess(item, 'remove')}
//                             disabled={isUpdating || isBulkUpdating}
//                           >
//                             Remove
//                           </Button>
//                         ) : (
//                           <Button
//                             variant="danger"
//                             size="sm"
//                             onClick={() => handleDistrictAccess(item, 'add')}
//                             disabled={isUpdating || isBulkUpdating}
//                           >
//                             Add
//                           </Button>
//                         )}
//                       </td>
//                       <td>
//                         {!item.isAssigned && (
//                           <Button
//                             variant="primary"
//                             size="sm"
//                             onClick={() => handleBulkAddDistrict(item.districtId)}
//                             disabled={isBulkUpdating}
//                           >
//                             {isBulkUpdating ? (
//                               <>
//                                 <Spinner animation="border" size="sm" className="me-2" />
//                                 Adding...
//                               </>
//                             ) : (
//                               "Add All Blocks & Schools"
//                             )}
//                           </Button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Batch Assignment Section - Replaced Class with Batch */}
//       <Card className="mt-4">
//         <Card.Header>
//           <Row>
//             <Col>
//               <h5>Batch Assignment</h5>
//             </Col>
//             <Col className="text-end">
//               <Button
//                 variant="primary"
//                 size="sm"
//                 onClick={handleBulkBatchAdd}
//                 disabled={updating.bulkBatches}
//               >
//                 {updating.bulkBatches ? (
//                   <>
//                     <Spinner animation="border" size="sm" className="me-2" />
//                     Adding...
//                   </>
//                 ) : (
//                   "Add All Batches"
//                 )}
//               </Button>
//             </Col>
//           </Row>
//         </Card.Header>
//         <Card.Body>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Batch</th>
//                 <th>Access</th>
//               </tr>
//             </thead>
//             <tbody>
//               {batchData.map((item, index) => {
//                 const updateKey = `batch-${item.batchName}`;
//                 const isUpdating = updating[updateKey];
                
//                 return (
//                   <tr key={index}>
//                     <td>{item.batchName}</td>
//                     <td>
//                       {isUpdating ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : item.isAssigned ? (
//                         <Button
//                           variant="success"
//                           size="sm"
//                           onClick={() => handleBatchAccess(item.batchName, 'remove')}
//                           disabled={isUpdating}
//                         >
//                           Remove
//                         </Button>
//                       ) : (
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           onClick={() => handleBatchAccess(item.batchName, 'add')}
//                           disabled={isUpdating}
//                         >
//                           Add
//                         </Button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

















// src/components/EditUserAccess.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Spinner,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
} from "react-bootstrap";

import Select from "react-select";

import { useLocation, useNavigate } from "react-router-dom";

import {
  updateUserAccesses,
  getUsersByObjectId,
} from "../service/User.service";

import {
  GetAllDistrictBlockSchoolForAccess,
} from "../service/DistrictBlockSchool.service";

/* =========================================================
   HELPER
========================================================= */

const normalizeId = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
};

/* =========================================================
   COMPONENT
========================================================= */

export const EditUserAccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /* =======================================================
     USER DATA FROM PREVIOUS PAGE
  ======================================================= */

  const userAccessData =
    location.state?.fetchedAccessData;

  const actualUser =
    userAccessData?.data?.[0] || null;

  /* =======================================================
     LOADING / ALERT
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState({});

  const [alert, setAlert] =
    useState({
      show: false,
      message: "",
      variant: "info",
    });

  /* =======================================================
     ACCESS LEVEL
  ======================================================= */

  const [accessLevel, setAccessLevel] =
    useState("school");

  /* =======================================================
     USER ACCESS
  ======================================================= */

  const [userAccess, setUserAccess] =
    useState(null);

  const [unqObjectId, setUnqObjectId] =
    useState("");

  const [userId, setUserId] =
    useState("");

  /* =======================================================
     MASTER DISTRICT/BLOCK/SCHOOL DATA
  ======================================================= */

  const [
    dbDistrictBlockSchoolData,
    setDbDistrictBlockSchoolData,
  ] = useState([]);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [
    selectedDistrict,
    setSelectedDistrict,
  ] = useState(null);

  const [
    selectedBlock,
    setSelectedBlock,
  ] = useState(null);

  const [
    selectedSchool,
    setSelectedSchool,
  ] = useState(null);

  /* =======================================================
     BATCH
  ======================================================= */

  const allBatches = useMemo(
    () => [
      "2024-26",
      "2025-27",
      "2026-28",
      "2025-27 (HS100)-Boys",
      "2025-27 (HS100)-Girls",
      "2026-28 (HS100)-Boys",
      "2026-28 (HS100)-Girls"
    ],
    []
  );

  const [batchData, setBatchData] =
    useState([]);

  /* =======================================================
     ALERT FUNCTION
  ======================================================= */

  const showAlert = useCallback(
    (message, variant = "info") => {
      setAlert({
        show: true,
        message,
        variant,
      });

      setTimeout(() => {
        setAlert({
          show: false,
          message: "",
          variant: "info",
        });
      }, 3000);
    },
    []
  );

  /* =======================================================
     SET UPDATE STATE
  ======================================================= */

  const setItemUpdating = (
    key,
    value
  ) => {
    setUpdating((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =======================================================
     INITIALIZE USER ACCESS
  ======================================================= */

  useEffect(() => {
    if (!actualUser) {
      setLoading(false);
      return;
    }

    console.log(
      "========== EDIT USER ACCESS =========="
    );

    console.log(
      "USER:",
      actualUser
    );

    console.log(
      "ACCESS DETAILS:",
      actualUser.accessDetails
    );

    const access =
      actualUser.accessDetails || {};

    const normalizedAccess = {
      ...access,

      region: Array.isArray(
        access.region
      )
        ? access.region
        : [],

      modules: Array.isArray(
        access.modules
      )
        ? access.modules
        : [],

      batch: Array.isArray(
        access.batch
      )
        ? access.batch
        : [],
    };

    setUnqObjectId(
      normalizeId(actualUser._id)
    );

    setUserId(
      actualUser.userId || ""
    );

    setUserAccess(
      normalizedAccess
    );

    setBatchData(
      allBatches.map(
        (batchName) => ({
          batchName,

          isAssigned:
            normalizedAccess.batch.includes(
              batchName
            ),
        })
      )
    );

    setLoading(false);
  }, [
    actualUser,
    allBatches,
  ]);

  /* =======================================================
     FETCH ALL DISTRICT/BLOCK/SCHOOL DATA

     IMPORTANT:
     This uses the NEW API.
     Existing API is untouched.
  ======================================================= */

  const fetchDistrictBlockSchool =
    useCallback(async () => {
      try {
        setLoading(true);

        console.log(
          "================================"
        );

        console.log(
          "FETCHING ACCESS MASTER DATA"
        );

        console.log(
          "================================"
        );

        /*
         * Your new service is POST,
         * therefore send an empty object.
         */

        const response =
          await GetAllDistrictBlockSchoolForAccess(
            {}
          );

        console.log(
          "🔥 NEW ACCESS API RESPONSE:",
          response
        );

        /*
         * Expected response:

         {
           status: "Success",
           data: [...]
         }
        */

        if (
          !response ||
          response.status !==
            "Success"
        ) {
          console.error(
            "Invalid access master API response:",
            response
          );

          showAlert(
            response?.message ||
              "Could not load district/block/school data",
            "danger"
          );

          setDbDistrictBlockSchoolData(
            []
          );

          return;
        }

        const data =
          Array.isArray(
            response.data
          )
            ? response.data
            : [];

        console.log(
          "🔥 ACCESS MASTER DATA:",
          data
        );

        console.log(
          "🔥 TOTAL RECORDS:",
          data.length
        );

        /*
         * Print first record so we can
         * verify field names.
         */

        if (data.length > 0) {
          console.log(
            "🔥 FIRST RECORD:",
            data[0]
          );

          console.log(
            "🔥 FIRST RECORD KEYS:",
            Object.keys(data[0])
          );
        }

        setDbDistrictBlockSchoolData(
          data
        );
      } catch (error) {
        console.error(
          "ERROR FETCHING ACCESS MASTER DATA:",
          error
        );

        showAlert(
          error?.response?.data?.message ||
            error?.message ||
            "Error fetching district/block/school data",
          "danger"
        );

        setDbDistrictBlockSchoolData(
          []
        );
      } finally {
        setLoading(false);
      }
    }, [showAlert]);

  /* =======================================================
     CALL NEW API
  ======================================================= */

  useEffect(() => {
    fetchDistrictBlockSchool();
  }, [
    fetchDistrictBlockSchool,
  ]);

  /* =======================================================
     DISTRICT OPTIONS
  ======================================================= */

  const districtOptions = useMemo(() => {
    const map = new Map();

    dbDistrictBlockSchoolData.forEach(
      (item) => {
        const districtId =
          normalizeId(
            item?.districtId
          );

        if (!districtId) {
          return;
        }

        if (
          !map.has(districtId)
        ) {
          map.set(
            districtId,
            {
              value: districtId,

              label:
                item?.districtName ||
                item?.district ||
                districtId,
            }
          );
        }
      }
    );

    return Array.from(
      map.values()
    );
  }, [
    dbDistrictBlockSchoolData,
  ]);

  /* =======================================================
     BLOCK OPTIONS
  ======================================================= */

  const blockOptions = useMemo(() => {
    if (!selectedDistrict) {
      return [];
    }

    const districtId =
      normalizeId(
        selectedDistrict.value
      );

    const map = new Map();

    dbDistrictBlockSchoolData
      .filter(
        (item) =>
          normalizeId(
            item?.districtId
          ) === districtId
      )
      .forEach((item) => {
        const blockId =
          normalizeId(
            item?.blockId
          );

        if (!blockId) {
          return;
        }

        if (
          !map.has(blockId)
        ) {
          map.set(
            blockId,
            {
              value: blockId,

              label:
                item?.blockName ||
                item?.block ||
                blockId,
            }
          );
        }
      });

    return Array.from(
      map.values()
    );
  }, [
    dbDistrictBlockSchoolData,
    selectedDistrict,
  ]);

  /* =======================================================
     SCHOOL OPTIONS
  ======================================================= */

  const schoolOptions = useMemo(() => {
    if (
      !selectedDistrict ||
      !selectedBlock
    ) {
      return [];
    }

    const districtId =
      normalizeId(
        selectedDistrict.value
      );

    const blockId =
      normalizeId(
        selectedBlock.value
      );

    const map = new Map();

    dbDistrictBlockSchoolData
      .filter(
        (item) =>
          normalizeId(
            item?.districtId
          ) === districtId &&
          normalizeId(
            item?.blockId
          ) === blockId
      )
      .forEach((item) => {
        const schoolId =
          normalizeId(
            item?.schoolId
          );

        if (!schoolId) {
          return;
        }

        if (
          !map.has(schoolId)
        ) {
          map.set(
            schoolId,
            {
              value: schoolId,

              label:
                item?.schoolName ||
                item?.school ||
                schoolId,
            }
          );
        }
      });

    return Array.from(
      map.values()
    );
  }, [
    dbDistrictBlockSchoolData,
    selectedDistrict,
    selectedBlock,
  ]);

  /* =======================================================
     SCHOOL TABLE DATA
  ======================================================= */

  const schoolLevelData =
    useMemo(() => {
      const map = new Map();

      dbDistrictBlockSchoolData.forEach(
        (item) => {
          const districtId =
            normalizeId(
              item?.districtId
            );

          const blockId =
            normalizeId(
              item?.blockId
            );

          const schoolId =
            normalizeId(
              item?.schoolId
            );

          if (
            !districtId ||
            !blockId ||
            !schoolId
          ) {
            return;
          }

          /*
           * APPLY FILTERS
           */

          if (
            selectedDistrict &&
            normalizeId(
              selectedDistrict.value
            ) !== districtId
          ) {
            return;
          }

          if (
            selectedBlock &&
            normalizeId(
              selectedBlock.value
            ) !== blockId
          ) {
            return;
          }

          if (
            selectedSchool &&
            normalizeId(
              selectedSchool.value
            ) !== schoolId
          ) {
            return;
          }

          /*
           * FIND USER DISTRICT
           */

          const district =
            userAccess?.region?.find(
              (d) =>
                normalizeId(
                  d?.districtId
                ) === districtId
            );

          /*
           * FIND USER BLOCK
           */

          const block =
            district?.blockIds?.find(
              (b) =>
                normalizeId(
                  b?.blockId
                ) === blockId
            );

          /*
           * FIND USER SCHOOL
           */

          const isAssigned =
            block?.schoolIds?.some(
              (school) =>
                normalizeId(
                  school?.schoolId
                ) === schoolId
            ) || false;

          const key =
            `${districtId}-${blockId}-${schoolId}`;

          map.set(
            key,
            {
              districtId,

              districtName:
                item?.districtName ||
                item?.district ||
                districtId,

              blockId,

              blockName:
                item?.blockName ||
                item?.block ||
                blockId,

              schoolId,

              schoolName:
                item?.schoolName ||
                item?.school ||
                schoolId,

              isAssigned,
            }
          );
        }
      );

      return Array.from(
        map.values()
      );
    }, [
      dbDistrictBlockSchoolData,
      userAccess,
      selectedDistrict,
      selectedBlock,
      selectedSchool,
    ]);

  /* =======================================================
     DISTRICT TABLE DATA
  ======================================================= */

  const districtLevelData =
    useMemo(() => {
      const map = new Map();

      dbDistrictBlockSchoolData.forEach(
        (item) => {
          const districtId =
            normalizeId(
              item?.districtId
            );

          if (!districtId) {
            return;
          }

          if (
            map.has(districtId)
          ) {
            return;
          }

          const isAssigned =
            userAccess?.region?.some(
              (district) =>
                normalizeId(
                  district?.districtId
                ) === districtId
            ) || false;

          map.set(
            districtId,
            {
              districtId,

              districtName:
                item?.districtName ||
                item?.district ||
                districtId,

              isAssigned,
            }
          );
        }
      );

      return Array.from(
        map.values()
      );
    }, [
      dbDistrictBlockSchoolData,
      userAccess,
    ]);

  /* =======================================================
     FILTER HANDLERS
  ======================================================= */

  const handleDistrictFilter =
    (option) => {
      setSelectedDistrict(
        option
      );

      setSelectedBlock(
        null
      );

      setSelectedSchool(
        null
      );
    };

  const handleBlockFilter =
    (option) => {
      setSelectedBlock(
        option
      );

      setSelectedSchool(
        null
      );
    };

  const handleSchoolFilter =
    (option) => {
      setSelectedSchool(
        option
      );
    };

  const resetFilters = () => {
    setSelectedDistrict(
      null
    );

    setSelectedBlock(
      null
    );

    setSelectedSchool(
      null
    );
  };

  /* =======================================================
     CLEAN REGION
  ======================================================= */

  const cleanRegion = (
    region
  ) => {
    if (
      !Array.isArray(region)
    ) {
      return [];
    }

    return region
      .filter(
        (district) =>
          district?.districtId
      )
      .map(
        (district) => ({
          districtId:
            normalizeId(
              district.districtId
            ),

          blockIds:
            Array.isArray(
              district.blockIds
            )
              ? district.blockIds
                  .filter(
                    (block) =>
                      block?.blockId
                  )
                  .map(
                    (block) => ({
                      blockId:
                        normalizeId(
                          block.blockId
                        ),

                      schoolIds:
                        Array.isArray(
                          block.schoolIds
                        )
                          ? block.schoolIds
                              .filter(
                                (school) =>
                                  school?.schoolId
                              )
                              .map(
                                (school) => ({
                                  schoolId:
                                    normalizeId(
                                      school.schoolId
                                    ),
                                })
                              )
                          : [],
                    })
                  )
              : [],
        })
      );
  };

  /* =======================================================
     SAVE REGION
  ======================================================= */

  const saveRegion =
    async (newRegion) => {
      const cleaned =
        cleanRegion(
          newRegion
        );

      console.log(
        "========== SAVING REGION =========="
      );

      console.log(
        JSON.stringify(
          cleaned,
          null,
          2
        )
      );

      const response =
        await updateUserAccesses({
          unqObjectId,

          region: cleaned,
        });

      console.log(
        "REGION UPDATE RESPONSE:",
        response
      );

      if (
        response?.status !==
        "Success"
      ) {
        throw new Error(
          response?.message ||
            "Failed to update region access"
        );
      }

      setUserAccess(
        (previous) => ({
          ...previous,

          region:
            response?.data
              ?.region ??
            cleaned,
        })
      );

      return response;
    };

  /* =======================================================
     SCHOOL ADD / REMOVE
  ======================================================= */

  const handleSchoolAccess =
    async (
      schoolItem,
      action
    ) => {
      const districtId =
        normalizeId(
          schoolItem.districtId
        );

      const blockId =
        normalizeId(
          schoolItem.blockId
        );

      const schoolId =
        normalizeId(
          schoolItem.schoolId
        );

      if (
        !districtId ||
        !blockId ||
        !schoolId
      ) {
        showAlert(
          "Invalid district, block or school ID",
          "danger"
        );

        return;
      }

      const updateKey =
        `school-${schoolId}`;

      setItemUpdating(
        updateKey,
        true
      );

      try {
        /*
         * Clone current region
         */

        const region =
          cleanRegion(
            userAccess?.region
          );

        /*
         * FIND DISTRICT
         */

        let district =
          region.find(
            (d) =>
              normalizeId(
                d.districtId
              ) === districtId
          );

        /*
         * CREATE DISTRICT IF REQUIRED
         */

        if (!district) {
          district = {
            districtId,
            blockIds: [],
          };

          region.push(
            district
          );
        }

        /*
         * FIND BLOCK
         */

        let block =
          district.blockIds.find(
            (b) =>
              normalizeId(
                b.blockId
              ) === blockId
          );

        /*
         * CREATE BLOCK IF REQUIRED
         */

        if (!block) {
          block = {
            blockId,
            schoolIds: [],
          };

          district.blockIds.push(
            block
          );
        }

        /*
         * ADD SCHOOL
         */

        if (
          action === "add"
        ) {
          const exists =
            block.schoolIds.some(
              (school) =>
                normalizeId(
                  school.schoolId
                ) === schoolId
            );

          if (!exists) {
            block.schoolIds.push({
              schoolId,
            });
          }
        }

        /*
         * REMOVE SCHOOL
         */

        if (
          action === "remove"
        ) {
          block.schoolIds =
            block.schoolIds.filter(
              (school) =>
                normalizeId(
                  school.schoolId
                ) !== schoolId
            );
        }

        /*
         * SAVE
         */

        await saveRegion(
          region
        );

        showAlert(
          `School ${
            action === "add"
              ? "added"
              : "removed"
          } successfully`,
          "success"
        );
      } catch (error) {
        console.error(
          "School access error:",
          error
        );

        showAlert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Error updating school access",
          "danger"
        );
      } finally {
        setItemUpdating(
          updateKey,
          false
        );
      }
    };

  /* =======================================================
     DISTRICT ADD / REMOVE
  ======================================================= */

  const handleDistrictAccess =
    async (
      districtItem,
      action
    ) => {
      const districtId =
        normalizeId(
          districtItem.districtId
        );

      if (!districtId) {
        showAlert(
          "Invalid district ID",
          "danger"
        );

        return;
      }

      const updateKey =
        `district-${districtId}`;

      setItemUpdating(
        updateKey,
        true
      );

      try {
        const region =
          cleanRegion(
            userAccess?.region
          );

        const index =
          region.findIndex(
            (district) =>
              normalizeId(
                district.districtId
              ) === districtId
          );

        /*
         * ADD DISTRICT
         */

        if (
          action === "add" &&
          index === -1
        ) {
          region.push({
            districtId,

            blockIds: [],
          });
        }

        /*
         * REMOVE DISTRICT
         */

        if (
          action === "remove" &&
          index !== -1
        ) {
          region.splice(
            index,
            1
          );
        }

        await saveRegion(
          region
        );

        showAlert(
          `District ${
            action === "add"
              ? "added"
              : "removed"
          } successfully`,
          "success"
        );
      } catch (error) {
        console.error(
          "District access error:",
          error
        );

        showAlert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Error updating district access",
          "danger"
        );
      } finally {
        setItemUpdating(
          updateKey,
          false
        );
      }
    };

  /* =======================================================
     ADD ALL BLOCKS + SCHOOLS OF DISTRICT
  ======================================================= */

  const handleBulkAddDistrict =
    async (
      districtId
    ) => {
      const normalizedDistrictId =
        normalizeId(
          districtId
        );

      const updateKey =
        `bulk-${normalizedDistrictId}`;

      setItemUpdating(
        updateKey,
        true
      );

      try {
        /*
         * Get all records belonging
         * to selected district
         */

        const districtRecords =
          dbDistrictBlockSchoolData.filter(
            (item) =>
              normalizeId(
                item?.districtId
              ) ===
              normalizedDistrictId
          );

        if (
          districtRecords.length ===
          0
        ) {
          throw new Error(
            "No schools found for this district"
          );
        }

        /*
         * BLOCK MAP
         */

        const blockMap =
          new Map();

        districtRecords.forEach(
          (item) => {
            const blockId =
              normalizeId(
                item?.blockId
              );

            const schoolId =
              normalizeId(
                item?.schoolId
              );

            if (!blockId) {
              return;
            }

            if (
              !blockMap.has(
                blockId
              )
            ) {
              blockMap.set(
                blockId,
                []
              );
            }

            if (schoolId) {
              const schools =
                blockMap.get(
                  blockId
                );

              const exists =
                schools.some(
                  (school) =>
                    normalizeId(
                      school.schoolId
                    ) === schoolId
                );

              if (!exists) {
                schools.push({
                  schoolId,
                });
              }
            }
          }
        );

        /*
         * CREATE COMPLETE DISTRICT
         */

        const completeDistrict =
          {
            districtId:
              normalizedDistrictId,

            blockIds:
              Array.from(
                blockMap.entries()
              ).map(
                ([
                  blockId,
                  schools,
                ]) => ({
                  blockId,

                  schoolIds:
                    schools,
                })
              ),
          };

        /*
         * REMOVE OLD VERSION
         */

        const currentRegion =
          cleanRegion(
            userAccess?.region
          );

        const regionWithoutDistrict =
          currentRegion.filter(
            (district) =>
              normalizeId(
                district.districtId
              ) !==
              normalizedDistrictId
          );

        /*
         * ADD COMPLETE VERSION
         */

        const updatedRegion =
          [
            ...regionWithoutDistrict,

            completeDistrict,
          ];

        /*
         * ONE API REQUEST
         */

        await saveRegion(
          updatedRegion
        );

        const schoolCount =
          completeDistrict.blockIds.reduce(
            (
              total,
              block
            ) =>
              total +
              block.schoolIds
                .length,
            0
          );

        showAlert(
          `District added with ${completeDistrict.blockIds.length} blocks and ${schoolCount} schools`,
          "success"
        );
      } catch (error) {
        console.error(
          "Bulk district error:",
          error
        );

        showAlert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Error adding district",
          "danger"
        );
      } finally {
        setItemUpdating(
          updateKey,
          false
        );
      }
    };

  /* =======================================================
     BATCH ADD / REMOVE
  ======================================================= */

  const handleBatchAccess =
    async (
      batchName,
      action
    ) => {
      const updateKey =
        `batch-${batchName}`;

      setItemUpdating(
        updateKey,
        true
      );

      try {
        const currentBatches =
          Array.isArray(
            userAccess?.batch
          )
            ? userAccess.batch
            : [];

        let updatedBatches;

        if (
          action === "add"
        ) {
          updatedBatches =
            Array.from(
              new Set([
                ...currentBatches,
                batchName,
              ])
            );
        } else {
          updatedBatches =
            currentBatches.filter(
              (batch) =>
                batch !==
                batchName
            );
        }

        const response =
          await updateUserAccesses({
            unqObjectId,

            batch:
              updatedBatches,
          });

        if (
          response?.status !==
          "Success"
        ) {
          throw new Error(
            response?.message ||
              "Failed to update batch"
          );
        }

        const serverBatches =
          Array.isArray(
            response?.data?.batch
          )
            ? response.data.batch
            : updatedBatches;

        setUserAccess(
          (previous) => ({
            ...previous,

            batch:
              serverBatches,
          })
        );

        setBatchData(
          allBatches.map(
            (batchName) => ({
              batchName,

              isAssigned:
                serverBatches.includes(
                  batchName
                ),
            })
          )
        );

        showAlert(
          `Batch ${
            action === "add"
              ? "added"
              : "removed"
          } successfully`,
          "success"
        );
      } catch (error) {
        console.error(
          "Batch access error:",
          error
        );

        showAlert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Error updating batch",
          "danger"
        );
      } finally {
        setItemUpdating(
          updateKey,
          false
        );
      }
    };

  /* =======================================================
     ADD ALL BATCHES
  ======================================================= */

  const handleBulkBatchAdd =
    async () => {
      setItemUpdating(
        "bulkBatches",
        true
      );

      try {
        const response =
          await updateUserAccesses({
            unqObjectId,

            batch:
              allBatches,
          });

        if (
          response?.status !==
          "Success"
        ) {
          throw new Error(
            response?.message ||
              "Failed to update batches"
          );
        }

        const serverBatches =
          Array.isArray(
            response?.data?.batch
          )
            ? response.data.batch
            : allBatches;

        setUserAccess(
          (previous) => ({
            ...previous,

            batch:
              serverBatches,
          })
        );

        setBatchData(
          allBatches.map(
            (batchName) => ({
              batchName,

              isAssigned:
                serverBatches.includes(
                  batchName
                ),
            })
          )
        );

        showAlert(
          "All batches added successfully",
          "success"
        );
      } catch (error) {
        console.error(
          "Bulk batch error:",
          error
        );

        showAlert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Error adding batches",
          "danger"
        );
      } finally {
        setItemUpdating(
          "bulkBatches",
          false
        );
      }
    };

  /* =======================================================
     REFRESH USER ACCESS
  ======================================================= */

  const refreshUserData =
    useCallback(async () => {
      if (!unqObjectId) {
        return;
      }

      try {
        setLoading(true);

        const response =
          await getUsersByObjectId({
            _id: unqObjectId,
          });

        console.log(
          "REFRESH USER RESPONSE:",
          response
        );

        const refreshedUser =
          response?.data?.[0];

        if (!refreshedUser) {
          throw new Error(
            "User not found"
          );
        }

        const access =
          refreshedUser.accessDetails ||
          {};

        const normalizedAccess =
          {
            ...access,

            region:
              Array.isArray(
                access.region
              )
                ? access.region
                : [],

            modules:
              Array.isArray(
                access.modules
              )
                ? access.modules
                : [],

            batch:
              Array.isArray(
                access.batch
              )
                ? access.batch
                : [],
          };

        setUserAccess(
          normalizedAccess
        );

        setBatchData(
          allBatches.map(
            (batchName) => ({
              batchName,

              isAssigned:
                normalizedAccess.batch.includes(
                  batchName
                ),
            })
          )
        );

        showAlert(
          "Data refreshed successfully",
          "success"
        );
      } catch (error) {
        console.error(
          "Refresh error:",
          error
        );

        showAlert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Error refreshing data",
          "danger"
        );
      } finally {
        setLoading(false);
      }
    }, [
      unqObjectId,
      allBatches,
      showAlert,
    ]);

  /* =======================================================
     NO USER DATA
  ======================================================= */

  if (
    !userAccessData ||
    !actualUser
  ) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>
            No User Data Found
          </Alert.Heading>

          <p>
            No user access data was
            provided.
          </p>

          <Button
            variant="primary"
            onClick={() =>
              navigate(-1)
            }
          >
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading &&
    !userAccess
  ) {
    return (
      <Container className="text-center py-5">
        <Spinner
          animation="border"
          variant="primary"
        />

        <p className="mt-3">
          Loading user access...
        </p>
      </Container>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Container
      fluid
      className="py-4"
    >
      {/* ALERT */}

      {alert.show && (
        <Alert
          variant={
            alert.variant
          }
          dismissible
          onClose={() =>
            setAlert({
              show: false,
              message: "",
              variant: "info",
            })
          }
        >
          {alert.message}
        </Alert>
      )}

      {/* HEADER */}

      <Row className="mb-4">
        <Col>
          <h2>
            Edit User Access
          </h2>

          <p className="text-muted mb-0">
            User:{" "}
            <strong>
              {actualUser.name}
            </strong>{" "}
            ({userId})
          </p>
        </Col>

        <Col className="text-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={() =>
              navigate(-1)
            }
          >
            Back
          </Button>

          <Button
            variant="info"
            onClick={
              refreshUserData
            }
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />

                Refreshing...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        </Col>
      </Row>

      {/* ACCESS LEVEL */}

      <Card className="mb-4">
        <Card.Body>
          <Form.Label>
            Access Level
          </Form.Label>

          <ToggleButtonGroup
            type="radio"
            name="accessLevel"
            value={accessLevel}
            onChange={(value) =>
              setAccessLevel(
                value
              )
            }
          >
            <ToggleButton
              id="access-school"
              value="school"
              variant="outline-primary"
            >
              School Level
            </ToggleButton>

            <ToggleButton
              id="access-district"
              value="district"
              variant="outline-primary"
            >
              District Level
            </ToggleButton>
          </ToggleButtonGroup>
        </Card.Body>
      </Card>

      {/* =================================================
          SCHOOL FILTERS
      ================================================= */}

      {accessLevel ===
        "school" && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              Filters
            </h5>
          </Card.Header>

          <Card.Body>
            <Row>

              {/* DISTRICT */}

              <Col md={3}>
                <Form.Label>
                  District
                </Form.Label>

                <Select
                  options={
                    districtOptions
                  }
                  value={
                    selectedDistrict
                  }
                  onChange={
                    handleDistrictFilter
                  }
                  isClearable
                  isLoading={
                    loading
                  }
                  placeholder="Select District"
                />
              </Col>

              {/* BLOCK */}

              <Col md={3}>
                <Form.Label>
                  Block
                </Form.Label>

                <Select
                  options={
                    blockOptions
                  }
                  value={
                    selectedBlock
                  }
                  onChange={
                    handleBlockFilter
                  }
                  isClearable
                  isDisabled={
                    !selectedDistrict
                  }
                  placeholder={
                    selectedDistrict
                      ? "Select Block"
                      : "Select District First"
                  }
                />
              </Col>

              {/* SCHOOL */}

              <Col md={3}>
                <Form.Label>
                  School
                </Form.Label>

                <Select
                  options={
                    schoolOptions
                  }
                  value={
                    selectedSchool
                  }
                  onChange={
                    handleSchoolFilter
                  }
                  isClearable
                  isDisabled={
                    !selectedBlock
                  }
                  placeholder={
                    selectedBlock
                      ? "Select School"
                      : "Select Block First"
                  }
                />
              </Col>

              {/* CLEAR */}

              <Col
                md={3}
                className="d-flex align-items-end"
              >
                <Button
                  variant="outline-secondary"
                  onClick={
                    resetFilters
                  }
                >
                  Clear Filters
                </Button>
              </Col>

            </Row>
          </Card.Body>
        </Card>
      )}

      {/* =================================================
          SCHOOL TABLE
      ================================================= */}

      {accessLevel ===
      "school" ? (
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                School Level Access
              </h5>

              <Badge bg="info">
                {
                  schoolLevelData.length
                }{" "}
                schools
              </Badge>
            </div>
          </Card.Header>

          <Card.Body>

            {loading &&
            schoolLevelData.length ===
              0 ? (
              <div className="text-center py-4">
                <Spinner animation="border" />

                <p className="mt-2">
                  Loading schools...
                </p>
              </div>
            ) : (
              <Table
                striped
                bordered
                hover
                responsive
              >
                <thead>
                  <tr>
                    <th>
                      District
                    </th>

                    <th>
                      Block
                    </th>

                    <th>
                      School
                    </th>

                    <th>
                      Access
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {schoolLevelData.length >
                  0 ? (
                    schoolLevelData.map(
                      (item) => {
                        const updateKey =
                          `school-${item.schoolId}`;

                        const isUpdating =
                          updating[
                            updateKey
                          ];

                        return (
                          <tr
                            key={`${item.districtId}-${item.blockId}-${item.schoolId}`}
                          >
                            <td>
                              {
                                item.districtName
                              }
                            </td>

                            <td>
                              {
                                item.blockName
                              }
                            </td>

                            <td>
                              {
                                item.schoolName
                              }
                            </td>

                            <td>
                              {isUpdating ? (
                                <Spinner
                                  animation="border"
                                  size="sm"
                                />
                              ) : item.isAssigned ? (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() =>
                                    handleSchoolAccess(
                                      item,
                                      "remove"
                                    )
                                  }
                                >
                                  Remove
                                </Button>
                              ) : (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() =>
                                    handleSchoolAccess(
                                      item,
                                      "add"
                                    )
                                  }
                                >
                                  Add
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4"
                      >
                        No schools found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}

          </Card.Body>
        </Card>
      ) : (

        /* =================================================
           DISTRICT TABLE
        ================================================= */

        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                District Level Access
              </h5>

              <Badge bg="info">
                {
                  districtLevelData.length
                }{" "}
                districts
              </Badge>
            </div>
          </Card.Header>

          <Card.Body>
            <Table
              striped
              bordered
              hover
              responsive
            >
              <thead>
                <tr>
                  <th>
                    District
                  </th>

                  <th>
                    Access
                  </th>

                  <th>
                    Bulk Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {districtLevelData.map(
                  (item) => {
                    const updateKey =
                      `district-${item.districtId}`;

                    const bulkKey =
                      `bulk-${item.districtId}`;

                    const isUpdating =
                      updating[
                        updateKey
                      ];

                    const isBulkUpdating =
                      updating[
                        bulkKey
                      ];

                    return (
                      <tr
                        key={
                          item.districtId
                        }
                      >
                        <td>
                          {
                            item.districtName
                          }
                        </td>

                        <td>
                          {isUpdating ? (
                            <Spinner
                              animation="border"
                              size="sm"
                            />
                          ) : item.isAssigned ? (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                handleDistrictAccess(
                                  item,
                                  "remove"
                                )
                              }
                              disabled={
                                isBulkUpdating
                              }
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleDistrictAccess(
                                  item,
                                  "add"
                                )
                              }
                              disabled={
                                isBulkUpdating
                              }
                            >
                              Add
                            </Button>
                          )}
                        </td>

                        <td>
                          {!item.isAssigned && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleBulkAddDistrict(
                                  item.districtId
                                )
                              }
                              disabled={
                                isBulkUpdating
                              }
                            >
                              {isBulkUpdating ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                  />

                                  Adding...
                                </>
                              ) : (
                                "Add All Blocks & Schools"
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* =================================================
          BATCH ASSIGNMENT
      ================================================= */}

      <Card className="mt-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                Batch Assignment
              </h5>
            </Col>

            <Col className="text-end">
              <Button
                variant="primary"
                size="sm"
                onClick={
                  handleBulkBatchAdd
                }
                disabled={
                  updating.bulkBatches
                }
              >
                {updating.bulkBatches ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />

                    Adding...
                  </>
                ) : (
                  "Add All Batches"
                )}
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Table
            striped
            bordered
            hover
          >
            <thead>
              <tr>
                <th>
                  Batch
                </th>

                <th>
                  Access
                </th>
              </tr>
            </thead>

            <tbody>
              {batchData.map(
                (item) => {
                  const updateKey =
                    `batch-${item.batchName}`;

                  const isUpdating =
                    updating[
                      updateKey
                    ];

                  return (
                    <tr
                      key={
                        item.batchName
                      }
                    >
                      <td>
                        {
                          item.batchName
                        }
                      </td>

                      <td>
                        {isUpdating ? (
                          <Spinner
                            animation="border"
                            size="sm"
                          />
                        ) : item.isAssigned ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleBatchAccess(
                                item.batchName,
                                "remove"
                              )
                            }
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleBatchAccess(
                                item.batchName,
                                "add"
                              )
                            }
                          >
                            Add
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};