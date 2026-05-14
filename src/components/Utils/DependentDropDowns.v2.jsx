// import React, {useState, useEffect, useContext} from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetDistrictBlockSchoolByParams } from "../../service/DistrictBlockSchool.service";
// import { useRouteError } from "react-router-dom";
// import { MdSentimentDissatisfied } from "react-icons/md";

// export const District_block_school = ()=>{

// //Steps
// //1 using useraccess from userData to fetch only users assigned district block schools to api.
// // 2 then showing only those district block schools data in drop down of users.
// //3 in this way we can create dynamic dependent drop down which shows only uses alloted regions.
// //4 this can be used to access users asssigned centers, districts only, to filter data

//   const { userData } = useContext(UserContext);
  
//   console.log(userData.userAccess.region)

//   const districtIds = [...new Set(userData?.userAccess?.region.map(item => item.districtId))]

//   const blockIds = [...new Set(userData?.userAccess?.region.flatMap(item => item.blockIds.map(block => block.blockId)))]

//   const schoolIds = userData?.userAccess?.region.flatMap(item => item.blockIds.flatMap(block => block.schoolIds.map(
//     school => school.schoolId
//   )))
// console.log(districtIds)


//    const fetchDistrictBlockSchoolsByUer = async () =>{

//     const reqBody = {
//         districtId: districtIds,
//         blockId: blockIds,
//         schoolId: schoolIds
//     }
//     try {
//         const response = await GetDistrictBlockSchoolByParams(reqBody)
//         console.log(response.data)
//     } catch (error) {
//         console.log('error')
//     }
//    }

//    useEffect(()=>{
//     fetchDistrictBlockSchoolsByUer()
//    },[])
// }







// import React, { useState, useEffect, useContext } from "react";
// import { UserContext } from "../contextAPIs/User.context";
// import { GetDistrictBlockSchoolByParams } from "../../service/DistrictBlockSchool.service";
// import Select from "react-select";
// import { Container, Card, Row, Col, Badge, Spinner } from "react-bootstrap";
// import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";

// export const District_block_school = () => {
//   const { userData } = useContext(UserContext);
//   const { districtContext,
//         setDistrictContext,
//         blockContext,
//         setBlockContext,
//         schoolContext,
//         setSchoolContext} =useContext (DistrictBlockSschoolContextV2)
  
//   // State variables
//   const [loading, setLoading] = useState(false);
//   const [allData, setAllData] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [blocks, setBlocks] = useState([]);
//   const [schools, setSchools] = useState([]);
  
//   // Selected values
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedBlock, setSelectedBlock] = useState(null);
//   const [selectedSchool, setSelectedSchool] = useState(null);
  
//   // Extract IDs from userAccess
//   const districtIds = [...new Set(userData?.userAccess?.region.map(item => item.districtId))];
//   const blockIds = [...new Set(userData?.userAccess?.region.flatMap(item => 
//     item.blockIds.map(block => block.blockId)
//   ))];
//   const schoolIds = [...new Set(userData?.userAccess?.region.flatMap(item => 
//     item.blockIds.flatMap(block => 
//       block.schoolIds.map(school => school.schoolId)
//     )
//   ))];
  
//   // Fetch district, block, school data
//   const fetchDistrictBlockSchoolsByUser = async () => {
//     setLoading(true);
//     const reqBody = {
//       districtId: districtIds,
//       blockId: blockIds,
//       schoolId: schoolIds
//     };
    
//     try {
//       const response = await GetDistrictBlockSchoolByParams(reqBody);
//       console.log("Fetched Data:", response.data);
//       setAllData(response.data);
      
//       // Extract unique districts from the response
//       const uniqueDistricts = [];
//       const districtMap = new Map();
      
//       response.data.forEach(item => {
//         if (!districtMap.has(item.districtId)) {
//           districtMap.set(item.districtId, {
//             value: item.districtId,
//             label: item.districtName,
//             districtName: item.districtName
//           });
//           uniqueDistricts.push({
//             value: item.districtId,
//             label: item.districtName,
//             districtName: item.districtName
//           });
//         }
//       });
      
//       setDistricts(uniqueDistricts);
      
//       // Extract all blocks initially (will be filtered by district selection)
//       const allUniqueBlocks = [];
//       const blockMap = new Map();
      
//       response.data.forEach(item => {
//         if (!blockMap.has(item.blockId)) {
//           blockMap.set(item.blockId, {
//             value: item.blockId,
//             label: item.blockName,
//             blockName: item.blockName,
//             districtId: item.districtId
//           });
//           allUniqueBlocks.push({
//             value: item.blockId,
//             label: item.blockName,
//             blockName: item.blockName,
//             districtId: item.districtId
//           });
//         }
//       });
      
//       setBlocks(allUniqueBlocks);
      
//       // Extract all schools initially (will be filtered by district and block selection)
//       const allUniqueSchools = [];
//       const schoolMap = new Map();
      
//       response.data.forEach(item => {
//         if (!schoolMap.has(item.schoolId)) {
//           schoolMap.set(item.schoolId, {
//             value: item.schoolId,
//             label: item.schoolName,
//             schoolName: item.schoolName,
//             blockId: item.blockId,
//             districtId: item.districtId
//           });
//           allUniqueSchools.push({
//             value: item.schoolId,
//             label: item.schoolName,
//             schoolName: item.schoolName,
//             blockId: item.blockId,
//             districtId: item.districtId
//           });
//         }
//       });
      
//       setSchools(allUniqueSchools);
      
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Get filtered blocks based on selected district
//   const getFilteredBlocks = () => {
//     if (!selectedDistrict) return blocks;
//     return blocks.filter(block => block.districtId === selectedDistrict.value);
//   };
  
//   // Get filtered schools based on selected district and block
//   const getFilteredSchools = () => {
//     if (!selectedDistrict) return schools;
//     if (!selectedBlock) return schools.filter(school => school.districtId === selectedDistrict.value);
//     return schools.filter(school => 
//       school.districtId === selectedDistrict.value && 
//       school.blockId === selectedBlock.value
//     );
//   };
  
//   // Handle district change
//   const handleDistrictChange = (selectedOption) => {
//     setSelectedDistrict(selectedOption);
//     setSelectedBlock(null);
//     setSelectedSchool(null);
//   };
  
//   // Handle block change
//   const handleBlockChange = (selectedOption) => {
//     setSelectedBlock(selectedOption);
//     setSelectedSchool(null);
//   };
  
//   // Handle school change
//   const handleSchoolChange = (selectedOption) => {
//     setSelectedSchool(selectedOption);
//     console.log("Selected School Details:", selectedOption);
//   };
  
//   // Reset all selections
//   const handleReset = () => {
//     setSelectedDistrict(null);
//     setSelectedBlock(null);
//     setSelectedSchool(null);
//   };
  
//   useEffect(() => {
//     if (districtIds.length > 0) {
//       fetchDistrictBlockSchoolsByUser();
//     }
//   }, []);
  
//   // Custom styles for React Select
//   const customStyles = {
//     control: (base, state) => ({
//       ...base,
//       borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
//       boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
//       '&:hover': {
//         borderColor: '#86b7fe'
//       }
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
//       color: state.isSelected ? 'white' : '#212529',
//       '&:active': {
//         backgroundColor: '#0d6efd'
//       }
//     })
//   };
  
//   return (
//     <Container className="mt-4 mb-4">
//       <Card className="shadow-sm">
//         <Card.Header className="bg-primary text-white">
//           <h4 className="mb-0">District, Block & School Selector</h4>
//         </Card.Header>
        
//         <Card.Body>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3">Loading your assigned regions...</p>
//             </div>
//           ) : (
//             <>
//               {/* All Three Dropdowns in One Row - Responsive */}
//               <Row className="g-3 mb-4">
//                 {/* District Dropdown */}
//                 <Col xs={12} md={4}>
//                   <label className="fw-bold mb-2">
//                     District <span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     options={districts}
//                     value={selectedDistrict}
//                     onChange={handleDistrictChange}
//                     placeholder="Select district..."
//                     isClearable
//                     styles={customStyles}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     isDisabled={districts.length === 0}
//                   />
//                   {districts.length === 0 && !loading && (
//                     <small className="text-muted d-block mt-1">No districts assigned</small>
//                   )}
//                 </Col>
                
//                 {/* Block Dropdown */}
//                 <Col xs={12} md={4}>
//                   <label className="fw-bold mb-2">
//                     Block
//                   </label>
//                   <Select
//                     options={getFilteredBlocks()}
//                     value={selectedBlock}
//                     onChange={handleBlockChange}
//                     placeholder="Select block..."
//                     isClearable
//                     styles={customStyles}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     isDisabled={!selectedDistrict || getFilteredBlocks().length === 0}
//                   />
//                   {selectedDistrict && getFilteredBlocks().length === 0 && (
//                     <small className="text-muted d-block mt-1">No blocks found</small>
//                   )}
//                 </Col>
                
//                 {/* School Dropdown */}
//                 <Col xs={12} md={4}>
//                   <label className="fw-bold mb-2">
//                     School
//                   </label>
//                   <Select
//                     options={getFilteredSchools()}
//                     value={selectedSchool}
//                     onChange={handleSchoolChange}
//                     placeholder="Select school..."
//                     isClearable
//                     styles={customStyles}
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     isDisabled={!selectedDistrict || getFilteredSchools().length === 0}
//                   />
//                   {selectedDistrict && getFilteredSchools().length === 0 && (
//                     <small className="text-muted d-block mt-1">No schools found</small>
//                   )}
//                 </Col>
//               </Row>
              
//               {/* Reset Button */}
//               {(selectedDistrict || selectedBlock || selectedSchool) && (
//                 <Row className="mb-4">
//                   <Col md={12}>
//                     <button 
//                       className="btn btn-outline-secondary w-100"
//                       onClick={handleReset}
//                     >
//                       Clear All Selections
//                     </button>
//                   </Col>
//                 </Row>
//               )}
              
//               {/* Selected Information Display */}
//               {selectedSchool && (
//                 <Card className="mt-3 bg-light">
//                   <Card.Body>
//                     <h6 className="mb-3">Selected Information:</h6>
//                     <Row className="g-2">
//                       <Col xs={12} md={4}>
//                         <Badge bg="primary" className="mb-2">District</Badge>
//                         <p className="mb-0">{selectedDistrict?.label}</p>
//                         <small className="text-muted">ID: {selectedDistrict?.value}</small>
//                       </Col>
//                       <Col xs={12} md={4}>
//                         <Badge bg="success" className="mb-2">Block</Badge>
//                         <p className="mb-0">{selectedBlock?.label || 'Not selected'}</p>
//                         {selectedBlock && <small className="text-muted">ID: {selectedBlock?.value}</small>}
//                       </Col>
//                       <Col xs={12} md={4}>
//                         <Badge bg="info" className="mb-2">School</Badge>
//                         <p className="mb-0">{selectedSchool?.label}</p>
//                         <small className="text-muted">ID: {selectedSchool?.value}</small>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               )}
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };













import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextAPIs/User.context";
import { GetDistrictBlockSchoolByParams } from "../../service/DistrictBlockSchool.service";
import Select from "react-select";
import { Container, Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import { DistrictBlockSschoolContextV2 } from "../contextAPIs/DependentDropdowns.contextAPI";

export const District_block_school = () => {
  const { userData } = useContext(UserContext);
  const { 
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext
  } = useContext(DistrictBlockSschoolContextV2);
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // Selected values for dropdown display
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  
  // Extract IDs from userAccess
  const districtIds = [...new Set(userData?.userAccess?.region.map(item => item.districtId))];
  const blockIds = [...new Set(userData?.userAccess?.region.flatMap(item => 
    item.blockIds.map(block => block.blockId)
  ))];
  const schoolIds = [...new Set(userData?.userAccess?.region.flatMap(item => 
    item.blockIds.flatMap(block => 
      block.schoolIds.map(school => school.schoolId)
    )
  ))];
  
  // Fetch district, block, school data
  const fetchDistrictBlockSchoolsByUser = async () => {
    setLoading(true);
    const reqBody = {
      districtId: districtIds,
      blockId: blockIds,
      schoolId: schoolIds
    };
    
    try {
      const response = await GetDistrictBlockSchoolByParams(reqBody);
      console.log("Fetched Data:", response.data);
      setAllData(response.data);
      
      // Extract unique districts from the response
      const uniqueDistricts = [];
      const districtMap = new Map();
      
      response.data.forEach(item => {
        if (!districtMap.has(item.districtId)) {
          districtMap.set(item.districtId, {
            value: item.districtId,
            label: item.districtName,
            districtName: item.districtName,
            districtId: item.districtId
          });
          uniqueDistricts.push({
            value: item.districtId,
            label: item.districtName,
            districtName: item.districtName,
            districtId: item.districtId
          });
        }
      });
      
      setDistricts(uniqueDistricts);
      
      // Extract all blocks initially (will be filtered by district selection)
      const allUniqueBlocks = [];
      const blockMap = new Map();
      
      response.data.forEach(item => {
        if (!blockMap.has(item.blockId)) {
          blockMap.set(item.blockId, {
            value: item.blockId,
            label: item.blockName,
            blockName: item.blockName,
            districtId: item.districtId,
            blockId: item.blockId
          });
          allUniqueBlocks.push({
            value: item.blockId,
            label: item.blockName,
            blockName: item.blockName,
            districtId: item.districtId,
            blockId: item.blockId
          });
        }
      });
      
      setBlocks(allUniqueBlocks);
      
      // Extract all schools initially (will be filtered by district and block selection)
      const allUniqueSchools = [];
      const schoolMap = new Map();
      
      response.data.forEach(item => {
        if (!schoolMap.has(item.schoolId)) {
          schoolMap.set(item.schoolId, {
            value: item.schoolId,
            label: item.schoolName,
            schoolName: item.schoolName,
            blockId: item.blockId,
            districtId: item.districtId,
            schoolId: item.schoolId
          });
          allUniqueSchools.push({
            value: item.schoolId,
            label: item.schoolName,
            schoolName: item.schoolName,
            blockId: item.blockId,
            districtId: item.districtId,
            schoolId: item.schoolId
          });
        }
      });
      
      setSchools(allUniqueSchools);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get filtered blocks based on selected district
  const getFilteredBlocks = () => {
    if (!selectedDistrict) return blocks;
    return blocks.filter(block => block.districtId === selectedDistrict.value);
  };
  
  // Get filtered schools based on selected district and block
  const getFilteredSchools = () => {
    if (!selectedDistrict) return schools;
    if (!selectedBlock) return schools.filter(school => school.districtId === selectedDistrict.value);
    return schools.filter(school => 
      school.districtId === selectedDistrict.value && 
      school.blockId === selectedBlock.value
    );
  };
  
  // Handle district change
  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedBlock(null);
    setSelectedSchool(null);
    
    // Store in context and log
    if (selectedOption) {
      const districtData = {
        districtId: selectedOption.districtId,
        districtName: selectedOption.districtName
      };
      setDistrictContext(districtData);
      console.log("Selected District:", districtData);
    } else {
      setDistrictContext(null);
      console.log("District cleared");
    }
    
    // Clear block and school contexts when district changes
    setBlockContext(null);
    setSchoolContext(null);
  };
  
  // Handle block change
  const handleBlockChange = (selectedOption) => {
    setSelectedBlock(selectedOption);
    setSelectedSchool(null);
    
    // Store in context and log
    if (selectedOption) {
      const blockData = {
        blockId: selectedOption.blockId,
        blockName: selectedOption.blockName
      };
      setBlockContext(blockData);
      console.log("Selected Block:", blockData);
    } else {
      setBlockContext(null);
      console.log("Block cleared");
    }
    
    // Clear school context when block changes
    setSchoolContext(null);
  };
  
  // Handle school change
  const handleSchoolChange = (selectedOption) => {
    setSelectedSchool(selectedOption);
    
    // Store in context and log
    if (selectedOption) {
      const schoolData = {
        schoolId: selectedOption.schoolId,
        schoolName: selectedOption.schoolName
      };
      setSchoolContext(schoolData);
      console.log("Selected School:", schoolData);
    } else {
      setSchoolContext(null);
      console.log("School cleared");
    }
  };
  
  // Reset all selections
  const handleReset = () => {
    setSelectedDistrict(null);
    setSelectedBlock(null);
    setSelectedSchool(null);
    setDistrictContext(null);
    setBlockContext(null);
    setSchoolContext(null);
    console.log("All selections cleared");
  };
  
  useEffect(() => {
    if (districtIds.length > 0) {
      fetchDistrictBlockSchoolsByUser();
    }
  }, []);
  
  // Log current context values whenever they change
  useEffect(() => {
    console.log("Current Context Values:", {
      district: districtContext,
      block: blockContext,
      school: schoolContext
    });
  }, [districtContext, blockContext, schoolContext]);
  
  // Custom styles for React Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      '&:active': {
        backgroundColor: '#0d6efd'
      }
    })
  };
  
  return (
    <Container className="mt-4 mb-4" fluid>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">District, Block & School</h4>
        </Card.Header>
        
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your assigned regions...</p>
            </div>
          ) : (
            <>
              {/* All Three Dropdowns in One Row - Responsive */}
              <Row className="g-3 mb-4">
                {/* District Dropdown */}
                <Col xs={12} md={4}>
                  <label className="fw-bold mb-2">
                    District <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={districts}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    placeholder="Select district..."
                    isClearable
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={districts.length === 0}
                  />
                  {districts.length === 0 && !loading && (
                    <small className="text-muted d-block mt-1">No districts assigned</small>
                  )}
                </Col>
                
                {/* Block Dropdown */}
                <Col xs={12} md={4}>
                  <label className="fw-bold mb-2">
                    Block
                  </label>
                  <Select
                    options={getFilteredBlocks()}
                    value={selectedBlock}
                    onChange={handleBlockChange}
                    placeholder="Select block..."
                    isClearable
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={!selectedDistrict || getFilteredBlocks().length === 0}
                  />
                  {selectedDistrict && getFilteredBlocks().length === 0 && (
                    <small className="text-muted d-block mt-1">No blocks found</small>
                  )}
                </Col>
                
                {/* School Dropdown */}
                <Col xs={12} md={4}>
                  <label className="fw-bold mb-2">
                    School
                  </label>
                  <Select
                    options={getFilteredSchools()}
                    value={selectedSchool}
                    onChange={handleSchoolChange}
                    placeholder="Select school..."
                    isClearable
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={!selectedDistrict || getFilteredSchools().length === 0}
                  />
                  {selectedDistrict && getFilteredSchools().length === 0 && (
                    <small className="text-muted d-block mt-1">No schools found</small>
                  )}
                </Col>
              </Row>
              
              {/* Reset Button */}
              {(selectedDistrict || selectedBlock || selectedSchool) && (
                <Row className="mb-4">
                  <Col md={12}>
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={handleReset}
                    >
                      Clear All Selections
                    </button>
                  </Col>
                </Row>
              )}
              
              {/* Selected Information Display */}
              
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};







//District-School

export const District_School = () => {
  const { userData } = useContext(UserContext);
  const { 
    districtContext,
    setDistrictContext,
    schoolContext,
    setSchoolContext
  } = useContext(DistrictBlockSschoolContextV2);
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // Selected values for dropdown display
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  
  // Extract IDs from userAccess
  const districtIds = [...new Set(userData?.userAccess?.region.map(item => item.districtId))];
  const schoolIds = [...new Set(userData?.userAccess?.region.flatMap(item => 
    item.blockIds.flatMap(block => 
      block.schoolIds.map(school => school.schoolId)
    )
  ))];
  
  // Fetch district and school data
  const fetchDistrictAndSchoolsByUser = async () => {
    setLoading(true);
    const reqBody = {
      districtId: districtIds,
      schoolId: schoolIds
    };
    
    try {
      const response = await GetDistrictBlockSchoolByParams(reqBody);
      console.log("Fetched Data:", response.data);
      setAllData(response.data);
      
      // Extract unique districts from the response and sort A to Z
      const uniqueDistricts = [];
      const districtMap = new Map();
      
      response.data.forEach(item => {
        if (!districtMap.has(item.districtId)) {
          districtMap.set(item.districtId, {
            value: item.districtId,
            label: item.districtName,
            districtName: item.districtName,
            districtId: item.districtId
          });
          uniqueDistricts.push({
            value: item.districtId,
            label: item.districtName,
            districtName: item.districtName,
            districtId: item.districtId
          });
        }
      });
      
      // Sort districts alphabetically by name
      const sortedDistricts = uniqueDistricts.sort((a, b) => 
        a.districtName.localeCompare(b.districtName)
      );
      setDistricts(sortedDistricts);
      
      // Extract all schools initially (will be filtered by district selection)
      const allUniqueSchools = [];
      const schoolMap = new Map();
      
      response.data.forEach(item => {
        if (!schoolMap.has(item.schoolId)) {
          schoolMap.set(item.schoolId, {
            value: item.schoolId,
            label: item.schoolName,
            schoolName: item.schoolName,
            districtId: item.districtId,
            schoolId: item.schoolId
          });
          allUniqueSchools.push({
            value: item.schoolId,
            label: item.schoolName,
            schoolName: item.schoolName,
            districtId: item.districtId,
            schoolId: item.schoolId
          });
        }
      });
      
      // Sort schools alphabetically by name
      const sortedSchools = allUniqueSchools.sort((a, b) => 
        a.schoolName.localeCompare(b.schoolName)
      );
      setSchools(sortedSchools);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get filtered schools based on selected district
  const getFilteredSchools = () => {
    if (!selectedDistrict) return [];
    return schools.filter(school => school.districtId === selectedDistrict.value);
  };
  
  // Handle district change
  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedSchool(null);
    
    // Store in context and log
    if (selectedOption) {
      const districtData = {
        districtId: selectedOption.districtId,
        districtName: selectedOption.districtName
      };
      setDistrictContext(districtData);
      console.log("Selected District:", districtData);
    } else {
      setDistrictContext(null);
      console.log("District cleared");
    }
    
    // Clear school context when district changes
    setSchoolContext(null);
  };
  
  // Handle school change
  const handleSchoolChange = (selectedOption) => {
    setSelectedSchool(selectedOption);
    
    // Store in context and log
    if (selectedOption) {
      const schoolData = {
        schoolId: selectedOption.schoolId,
        schoolName: selectedOption.schoolName
      };
      setSchoolContext(schoolData);
      console.log("Selected School:", schoolData);
    } else {
      setSchoolContext(null);
      console.log("School cleared");
    }
  };
  
  // Reset all selections
  const handleReset = () => {
    setSelectedDistrict(null);
    setSelectedSchool(null);
    setDistrictContext(null);
    setSchoolContext(null);
    console.log("All selections cleared");
  };
  
  useEffect(() => {
    if (districtIds.length > 0) {
      fetchDistrictAndSchoolsByUser();
    }
  }, []);
  
  // Log current context values whenever they change
  useEffect(() => {
    console.log("Current Context Values:", {
      district: districtContext,
      school: schoolContext
    });
  }, [districtContext, schoolContext]);
  
  // Custom styles for React Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      '&:active': {
        backgroundColor: '#0d6efd'
      }
    })
  };
  
  return (
    <Container className="mt-4 mb-4" fluid>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">District & School</h4>
        </Card.Header>
        
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your assigned regions...</p>
            </div>
          ) : (
            <>
              {/* Two Dropdowns in One Row - Responsive */}
              <Row className="g-3 mb-4">
                {/* District Dropdown */}
                <Col xs={12} md={6}>
                  <label className="fw-bold mb-2">
                    Select District <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={districts}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    placeholder="Choose district..."
                    isClearable
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={districts.length === 0}
                  />
                  {districts.length === 0 && !loading && (
                    <small className="text-muted d-block mt-1">No districts assigned</small>
                  )}
                </Col>
                
                {/* School Dropdown */}
                <Col xs={12} md={6}>
                  <label className="fw-bold mb-2">
                    Select School
                  </label>
                  <Select
                    options={getFilteredSchools()}
                    value={selectedSchool}
                    onChange={handleSchoolChange}
                    placeholder="Choose school..."
                    isClearable
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={!selectedDistrict || getFilteredSchools().length === 0}
                  />
                  {selectedDistrict && getFilteredSchools().length === 0 && (
                    <small className="text-muted d-block mt-1">No schools found for selected district</small>
                  )}
                </Col>
              </Row>
              
              {/* Reset Button */}
              {(selectedDistrict || selectedSchool) && (
                <Row className="mb-4">
                  <Col md={12}>
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={handleReset}
                    >
                      Clear All Selections
                    </button>
                  </Col>
                </Row>
              )}
              
              
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

















export const School_drop_down = () => {
  const { userData } = useContext(UserContext);
  const { 
    schoolContext,
    setSchoolContext
  } = useContext(DistrictBlockSschoolContextV2);
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  
  // Selected value for dropdown display
  const [selectedSchool, setSelectedSchool] = useState(null);
  
  // Extract school IDs from userAccess
  const schoolIds = [...new Set(userData?.userAccess?.region.flatMap(item => 
    item.blockIds.flatMap(block => 
      block.schoolIds.map(school => school.schoolId)
    )
  ))];
  
  // Fetch schools data
  const fetchSchoolsByUser = async () => {
    setLoading(true);
    const reqBody = {
      schoolId: schoolIds
    };
    
    try {
      const response = await GetDistrictBlockSchoolByParams(reqBody);
      console.log("Fetched Schools Data:", response.data);
      
      // Extract unique schools from the response and sort A to Z
      const uniqueSchools = [];
      const schoolMap = new Map();
      
      response.data.forEach(item => {
        if (!schoolMap.has(item.schoolId)) {
          schoolMap.set(item.schoolId, {
            value: item.schoolId,
            label: item.schoolName,
            schoolName: item.schoolName,
            schoolId: item.schoolId
          });
          uniqueSchools.push({
            value: item.schoolId,
            label: item.schoolName,
            schoolName: item.schoolName,
            schoolId: item.schoolId
          });
        }
      });
      
      // Sort schools alphabetically by name
      const sortedSchools = uniqueSchools.sort((a, b) => 
        a.schoolName.localeCompare(b.schoolName)
      );
      setSchools(sortedSchools);
      
    } catch (error) {
      console.error("Error fetching schools data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle school change
  const handleSchoolChange = (selectedOption) => {
    setSelectedSchool(selectedOption);
    
    // Store in context and log
    if (selectedOption) {
      const schoolData = {
        schoolId: selectedOption.schoolId,
        schoolName: selectedOption.schoolName
      };
      setSchoolContext(schoolData);
      console.log("Selected School:", schoolData);
    } else {
      setSchoolContext(null);
      console.log("School cleared");
    }
  };
  
  // Reset selection
  const handleReset = () => {
    setSelectedSchool(null);
    setSchoolContext(null);
    console.log("School selection cleared");
  };
  
  useEffect(() => {
    if (schoolIds.length > 0) {
      fetchSchoolsByUser();
    }
  }, []);
  
  // Log current context value whenever it changes
  useEffect(() => {
    console.log("Current School Context:", schoolContext);
  }, [schoolContext]);
  
  // Custom styles for React Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      '&:active': {
        backgroundColor: '#0d6efd'
      }
    })
  };
  
  return (
    <Container className="mt-4 mb-4" fluid>
      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading schools...</p>
            </div>
          ) : (
            <>
              {/* Single School Dropdown */}
              <Row className="mb-4">
                <Col xs={12}>
                  <label className="fw-bold mb-2">
                    Select School <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={schools}
                    value={selectedSchool}
                    onChange={handleSchoolChange}
                    placeholder="Choose school..."
                    isClearable
                    isSearchable
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={schools.length === 0}
                  />
                  {schools.length === 0 && !loading && (
                    <small className="text-muted d-block mt-1">No schools assigned to you</small>
                  )}
                  {schools.length > 0 && (
                    <small className="text-muted d-block mt-1">
                      Total {schools.length} school(s) available
                    </small>
                  )}
                </Col>
              </Row>
              
              {/* Reset Button */}
              {selectedSchool && (
                <Row className="mb-4">
                  <Col md={12}>
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={handleReset}
                    >
                      Clear Selection
                    </button>
                  </Col>
                </Row>
              )}
              
             
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};









export const Batch_drop_down = () => {
  const { userData } = useContext(UserContext);
  const { 
    batchContext,
    setBatchContext
  } = useContext(DistrictBlockSschoolContextV2);
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  
  // Selected value for dropdown display
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Extract batch values from userAccess
  const batchValues = userData?.userAccess?.batch || [];
  
  // Prepare batch options for dropdown
  const prepareBatchOptions = () => {
    const options = batchValues.map(batch => ({
      value: batch,
      label: batch,
      batchName: batch
    }));
    
    // Sort batches alphabetically
    return options.sort((a, b) => a.label.localeCompare(b.label));
  };
  
  // Handle batch change
  const handleBatchChange = (selectedOption) => {
    setSelectedBatch(selectedOption);
    
    // Store in context and log
    if (selectedOption) {
      const batchData = {
        batch: selectedOption.value,
        batchName: selectedOption.label
      };
      setBatchContext(batchData);
      console.log("Selected Batch:", batchData);
    } else {
      setBatchContext(null);
      console.log("Batch cleared");
    }
  };
  
  // Reset selection
  const handleReset = () => {
    setSelectedBatch(null);
    setBatchContext(null);
    console.log("Batch selection cleared");
  };
  
  useEffect(() => {
    if (batchValues.length > 0) {
      setLoading(true);
      
      // Prepare dropdown options
      const options = prepareBatchOptions();
      setBatches(options);
      
      // If only one batch value, auto-select it
      if (batchValues.length === 1) {
        const singleBatch = options[0];
        setSelectedBatch(singleBatch);
        
        // Auto-store in context
        const batchData = {
          batch: singleBatch.value,
          batchName: singleBatch.label
        };
        setBatchContext(batchData);
        console.log("Auto-selected single batch:", batchData);
      }
      
      setLoading(false);
    } else {
      setBatches([]);
      setSelectedBatch(null);
      setBatchContext(null);
    }
  }, [batchValues]); // Re-run when userData changes
  
  // Log current context value whenever it changes
  useEffect(() => {
    if (batchContext) {
      console.log("Current Batch Context:", batchContext);
    }
  }, [batchContext]);
  
  // Custom styles for React Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#86b7fe'
      },
      backgroundColor: state.isDisabled ? '#e9ecef' : 'white'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#e7f1ff' : 'white',
      color: state.isSelected ? 'white' : '#212529',
      '&:active': {
        backgroundColor: '#0d6efd'
      }
    }),
    singleValue: (base, state) => ({
      ...base,
      color: '#212529'
    })
  };
  
  return (
    <Container className="mt-4 mb-4" fluid>
      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading batches...</p>
            </div>
          ) : (
            <>
              {/* Single Batch Dropdown */}
              <Row className="mb-4">
                <Col xs={12}>
                  <label className="fw-bold mb-2">
                    Select Batch 
                    {batchValues.length > 1 && <span className="text-danger">*</span>}
                    {batchValues.length === 1 && <span className="text-muted ms-2">(Auto-selected)</span>}
                  </label>
                  <Select
                    options={batches}
                    value={selectedBatch}
                    onChange={handleBatchChange}
                    placeholder={batchValues.length === 1 ? "Batch auto-selected" : "Choose batch..."}
                    isClearable={batchValues.length > 1} // Only clearable if multiple options
                    isSearchable
                    isDisabled={batchValues.length === 0 || batchValues.length === 1} // Disable if no batches or single batch
                    styles={customStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                  {batchValues.length === 0 && (
                    <small className="text-muted d-block mt-1">No batches assigned to you</small>
                  )}
                  {batchValues.length === 1 && (
                    <small className="text-muted d-block mt-1">
                      Only one batch available. Auto-selected: {batchValues[0]}
                    </small>
                  )}
                  {batchValues.length > 1 && (
                    <small className="text-muted d-block mt-1">
                      Total {batchValues.length} batch(es) available
                    </small>
                  )}
                </Col>
              </Row>
              
              {/* Reset Button - Only show if multiple batches and something is selected */}
              {selectedBatch && batchValues.length > 1 && (
                <Row className="mb-4">
                  <Col md={12}>
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={handleReset}
                    >
                      Clear Selection
                    </button>
                  </Col>
                </Row>
              )}
              
             
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};