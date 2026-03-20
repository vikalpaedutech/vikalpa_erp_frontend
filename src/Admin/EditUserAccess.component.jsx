// // src/components/UsersList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Card,
//   Pagination,
//   Modal,
// } from "react-bootstrap";
// import Select from "react-select"; // ✅ react-select for multi dropdowns
// import {
//   getAllUsersWithAccess,
//   updateUserWithAccess,
// } from "../service/User.service";
// import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
// import { GetDistrictBlockSchoolByParams } from "../service/DistrictBlockSchool.service";
// import { getUsersByObjectId } from "../service/User.service";
// import { useLocation, useNavigate } from "react-router-dom";
// import { updateUserAccesses } from "../service/User.service";

// export const EditUserAccess = () => {
 

// const location = useLocation();
    
// const userAccessData = location.state?.fetchedAccessData


// console.log('Hello i am edituseraccess')
// console.log(userAccessData)









//   //Fetching district_block_schools data
//   const [dbDistrictBlockSchoolData, setDbDistrictBlockSchoolData] = useState(
//     []
//   );
//   const fetchDistrictBlockSchool = async () => {
//     try {
//       const response = await GetDistrictBlockSchoolByParams();

//       console.log(response.data);

//       setDbDistrictBlockSchoolData(response.data);
//     } catch (error) {
//       console.log("Error::::>", error);
//     }
//   };

//   useEffect(() => {
//     fetchDistrictBlockSchool();
//   }, []);
// return(
//     <Container>

//     </Container>
// )

// };






// src/components/EditUserAccess.jsx
import React, { useEffect, useState, useCallback } from "react";
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
  Badge
} from "react-bootstrap";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUserAccesses, getUsersByObjectId } from "../service/User.service";
import { GetDistrictBlockSchoolByParams } from "../service/DistrictBlockSchool.service";

export const EditUserAccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userAccessData = location.state?.fetchedAccessData;

  // States
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({}); // Track which item is being updated
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [accessLevel, setAccessLevel] = useState("school");
  
  // User's current access data
  const [userAccess, setUserAccess] = useState(null);
  const [unqObjectId, setUnqObjectId] = useState("");
  const [userId, setUserId] = useState("");
  
  // DB data for all districts, blocks, schools
  const [dbDistrictBlockSchoolData, setDbDistrictBlockSchoolData] = useState([]);
  
  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  
  // Filter options
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  
  // Processed data for display
  const [schoolLevelData, setSchoolLevelData] = useState([]);
  const [districtLevelData, setDistrictLevelData] = useState([]);
  const [classData, setClassData] = useState([]);

  // Show alert message
  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  }, []);

  // Refresh user data from server
  const refreshUserData = useCallback(async () => {
    if (!unqObjectId) return;
    
    try {
      const response = await getUsersByObjectId({ _id: unqObjectId });
      if (response.status === "Success" && response.data?.[0]) {
        const newUserAccess = response.data[0].accessDetails;
        setUserAccess(newUserAccess);
        
        // Update class data
        const allClasses = ["9", "10", "11", "12"];
        const userClasses = newUserAccess?.classId || [];
        setClassData(
          allClasses.map(className => ({
            className,
            isAssigned: userClasses.includes(className)
          }))
        );
        
        showAlert("Data refreshed successfully", "success");
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      showAlert("Error refreshing data", "danger");
    }
  }, [unqObjectId, showAlert]);

  // Parse user access data
  useEffect(() => {
    if (userAccessData?.data?.[0]) {
      const user = userAccessData.data[0];
      setUserAccess(user.accessDetails);
      setUnqObjectId(user._id);
      setUserId(user.userId);
      
      // Initialize class data
      const allClasses = ["9", "10", "11", "12"];
      const userClasses = user.accessDetails?.classId || [];
      setClassData(
        allClasses.map(className => ({
          className,
          isAssigned: userClasses.includes(className)
        }))
      );
    }
  }, [userAccessData]);

  // Fetch district-block-school data
  const fetchDistrictBlockSchool = async () => {
    setLoading(true);
    try {
      const response = await GetDistrictBlockSchoolByParams();
      setDbDistrictBlockSchoolData(response.data);
    } catch (error) {
      console.log("Error::::>", error);
      showAlert("Error fetching district data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistrictBlockSchool();
  }, [showAlert]);

  // Process school-level data
  useEffect(() => {
    if (dbDistrictBlockSchoolData.length > 0 && userAccess) {
      processSchoolLevelData();
    }
  }, [dbDistrictBlockSchoolData, userAccess, selectedDistrict, selectedBlock, selectedSchool]);

  // Process district-level data
  useEffect(() => {
    if (dbDistrictBlockSchoolData.length > 0 && userAccess) {
      processDistrictLevelData();
    }
  }, [dbDistrictBlockSchoolData, userAccess]);

  // Create filter options
  useEffect(() => {
    createFilterOptions();
  }, [dbDistrictBlockSchoolData, selectedDistrict, selectedBlock]);

  const processSchoolLevelData = () => {
    const schoolMap = new Map();
    
    dbDistrictBlockSchoolData.forEach(item => {
      const districtId = item.districtId;
      const districtName = item.districtName;
      const blockId = item.blockId;
      const blockName = item.blockName;
      const schoolId = item.centerId;
      const schoolName = item.centerName;

      // Check if this school is assigned to user
      let isAssigned = false;
      
      if (userAccess?.region) {
        const district = userAccess.region.find(d => d.districtId === districtId);
        if (district) {
          const block = district.blockIds?.find(b => b.blockId === blockId);
          if (block) {
            const school = block.schoolIds?.find(s => s.schoolId === schoolId);
            if (school) {
              isAssigned = true;
            }
          }
        }
      }

      // Apply filters
      if (selectedDistrict && selectedDistrict.value !== districtId) return;
      if (selectedBlock && selectedBlock.value !== blockId) return;
      if (selectedSchool && selectedSchool.value !== schoolId) return;

      const key = `${districtId}-${blockId}-${schoolId}`;
      schoolMap.set(key, {
        districtId,
        districtName,
        blockId,
        blockName,
        schoolId,
        schoolName,
        isAssigned
      });
    });

    setSchoolLevelData(Array.from(schoolMap.values()));
  };

  const processDistrictLevelData = () => {
    const districtMap = new Map();
    
    // Get all unique districts from DB
    const districts = [...new Set(dbDistrictBlockSchoolData.map(item => item.districtId))];
    
    districts.forEach(districtId => {
      const firstItem = dbDistrictBlockSchoolData.find(item => item.districtId === districtId);
      const districtName = firstItem?.districtName || districtId;
      
      // Check if district is assigned
      let isAssigned = false;
      if (userAccess?.region) {
        isAssigned = userAccess.region.some(d => d.districtId === districtId);
      }

      districtMap.set(districtId, {
        districtId,
        districtName,
        isAssigned
      });
    });

    setDistrictLevelData(Array.from(districtMap.values()));
  };

  const createFilterOptions = () => {
    // District options
    const districts = [...new Map(
      dbDistrictBlockSchoolData.map(item => [
        item.districtId, 
        { value: item.districtId, label: item.districtName }
      ])
    ).values()];
    setDistrictOptions(districts);

    // Block options
    if (selectedDistrict) {
      const blocks = [...new Map(
        dbDistrictBlockSchoolData
          .filter(item => item.districtId === selectedDistrict.value)
          .map(item => [item.blockId, { value: item.blockId, label: item.blockName }])
      ).values()];
      setBlockOptions(blocks);
    } else {
      setBlockOptions([]);
    }

    // School options
    if (selectedDistrict && selectedBlock) {
      const schools = dbDistrictBlockSchoolData
        .filter(item => 
          item.districtId === selectedDistrict.value && 
          item.blockId === selectedBlock.value
        )
        .map(item => ({
          value: item.centerId,
          label: item.centerName
        }));
      setSchoolOptions(schools);
    } else {
      setSchoolOptions([]);
    }
  };

  const handleDistrictFilter = (option) => {
    setSelectedDistrict(option);
    setSelectedBlock(null);
    setSelectedSchool(null);
  };

  const handleBlockFilter = (option) => {
    setSelectedBlock(option);
    setSelectedSchool(null);
  };

  const handleSchoolFilter = (option) => {
    setSelectedSchool(option);
  };

  const resetFilters = () => {
    setSelectedDistrict(null);
    setSelectedBlock(null);
    setSelectedSchool(null);
  };

  // Handle school add/remove with immediate UI update
  const handleSchoolAccess = async (schoolItem, action) => {
    const updateKey = `school-${schoolItem.schoolId}`;
    setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
    try {
      const requestBody = {
        unqObjectId,
        ...(action === 'add' ? {
          addSchool: {
            districtId: schoolItem.districtId,
            blockId: schoolItem.blockId,
            schoolId: schoolItem.schoolId
          }
        } : {
          removeSchool: {
            districtId: schoolItem.districtId,
            blockId: schoolItem.blockId,
            schoolId: schoolItem.schoolId
          }
        })
      };

      const response = await updateUserAccesses(requestBody);
      
      if (response.status === "Success") {
        // Update local state immediately
        setUserAccess(prev => ({
          ...prev,
          region: response.data.region
        }));
        
        showAlert(`School ${action === 'add' ? 'added' : 'removed'} successfully`, "success");
      }
    } catch (error) {
      console.error("Error updating school access:", error);
      showAlert("Error updating school access", "danger");
    } finally {
      setUpdating(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  // Handle district add/remove with immediate UI update
  const handleDistrictAccess = async (districtItem, action) => {
    const updateKey = `district-${districtItem.districtId}`;
    setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
    try {
      const requestBody = {
        unqObjectId,
        ...(action === 'add' ? {
          addDistrict: {
            districtId: districtItem.districtId
          }
        } : {
          removeDistrict: {
            districtId: districtItem.districtId
          }
        })
      };

      const response = await updateUserAccesses(requestBody);
      
      if (response.status === "Success") {
        // Update local state immediately
        setUserAccess(prev => ({
          ...prev,
          region: response.data.region
        }));
        
        showAlert(`District ${action === 'add' ? 'added' : 'removed'} successfully`, "success");
      }
    } catch (error) {
      console.error("Error updating district access:", error);
      showAlert("Error updating district access", "danger");
    } finally {
      setUpdating(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  // Handle bulk district add
  const handleBulkAddDistrict = async (districtId) => {
    const updateKey = `bulk-${districtId}`;
    setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
    try {
      // Get all blocks and schools in this district
      const districtSchools = dbDistrictBlockSchoolData.filter(
        item => item.districtId === districtId
      );

      // First add the district
      await updateUserAccesses({
        unqObjectId,
        addDistrict: { districtId }
      });

      // Add all unique blocks
      const blocks = [...new Set(districtSchools.map(item => item.blockId))];
      for (const blockId of blocks) {
        await updateUserAccesses({
          unqObjectId,
          addBlock: { districtId, blockId }
        });
      }

      // Add all schools
      for (const school of districtSchools) {
        await updateUserAccesses({
          unqObjectId,
          addSchool: {
            districtId,
            blockId: school.blockId,
            schoolId: school.centerId
          }
        });
      }

      // Refresh data after all operations
      await refreshUserData();
      
      showAlert("District added successfully with all blocks and schools", "success");
    } catch (error) {
      console.error("Error in bulk add district:", error);
      showAlert("Error in bulk add district", "danger");
    } finally {
      setUpdating(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  // Handle class add/remove with immediate UI update
  const handleClassAccess = async (className, action) => {
    const updateKey = `class-${className}`;
    setUpdating(prev => ({ ...prev, [updateKey]: true }));
    
    try {
      const currentClasses = userAccess?.classId || [];
      let updatedClasses;

      if (action === 'add') {
        updatedClasses = [...currentClasses, className];
      } else {
        updatedClasses = currentClasses.filter(c => c !== className);
      }

      const requestBody = {
        unqObjectId,
        classId: updatedClasses
      };

      const response = await updateUserAccesses(requestBody);
      
      if (response.status === "Success") {
        // Update local state immediately
        setUserAccess(prev => ({
          ...prev,
          classId: response.data.classId
        }));
        
        // Update class data
        setClassData(prev =>
          prev.map(item =>
            item.className === className
              ? { ...item, isAssigned: action === 'add' }
              : item
          )
        );
        
        showAlert(`Class ${action === 'add' ? 'added' : 'removed'} successfully`, "success");
      }
    } catch (error) {
      console.error("Error updating class access:", error);
      showAlert("Error updating class access", "danger");
    } finally {
      setUpdating(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  // Handle bulk class add
  const handleBulkClassAdd = async () => {
    setUpdating(prev => ({ ...prev, bulkClasses: true }));
    
    try {
      const requestBody = {
        unqObjectId,
        classId: ["9", "10", "11", "12"]
      };

      const response = await updateUserAccesses(requestBody);
      
      if (response.status === "Success") {
        // Update local state immediately
        setUserAccess(prev => ({
          ...prev,
          classId: response.data.classId
        }));
        
        // Update all class data
        setClassData(prev =>
          prev.map(item => ({ ...item, isAssigned: true }))
        );
        
        showAlert("All classes added successfully", "success");
      }
    } catch (error) {
      console.error("Error adding all classes:", error);
      showAlert("Error adding all classes", "danger");
    } finally {
      setUpdating(prev => ({ ...prev, bulkClasses: false }));
    }
  };

  if (loading && !userAccess) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2>Edit User Access</h2>
          <p className="text-muted">
            User: {userAccessData?.data?.[0]?.name} ({userId})
          </p>
        </Col>
        <Col className="text-end">
          <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
            Back
          </Button>
          <Button variant="info" onClick={refreshUserData} disabled={updating.bulkClasses}>
            Refresh Data
          </Button>
        </Col>
      </Row>

      {/* Access Level Toggle */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Label>Access Level</Form.Label>
              <ToggleButtonGroup
                type="radio"
                name="accessLevel"
                value={accessLevel}
                onChange={(val) => setAccessLevel(val)}
              >
                <ToggleButton id="tbg-radio-1" value="school" variant="outline-primary">
                  School Level Access
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value="district" variant="outline-primary">
                  District Level Access
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Filters */}
      {accessLevel === "school" && (
        <Card className="mb-4">
          <Card.Header>
            <h5>Filters</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Label>District</Form.Label>
                <Select
                  options={districtOptions}
                  value={selectedDistrict}
                  onChange={handleDistrictFilter}
                  isClearable
                  placeholder="Select District"
                />
              </Col>
              <Col md={3}>
                <Form.Label>Block</Form.Label>
                <Select
                  options={blockOptions}
                  value={selectedBlock}
                  onChange={handleBlockFilter}
                  isClearable
                  placeholder="Select Block"
                  isDisabled={!selectedDistrict}
                />
              </Col>
              <Col md={3}>
                <Form.Label>School</Form.Label>
                <Select
                  options={schoolOptions}
                  value={selectedSchool}
                  onChange={handleSchoolFilter}
                  isClearable
                  placeholder="Select School"
                  isDisabled={!selectedBlock}
                />
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* School Level Access Table */}
      {accessLevel === "school" ? (
        <Card className="mb-4">
          <Card.Header>
            <h5>School Level Access</h5>
            <Badge bg="info">{schoolLevelData.length} schools found</Badge>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Block</th>
                  <th>School</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {schoolLevelData.length > 0 ? (
                  schoolLevelData.map((item, index) => {
                    const updateKey = `school-${item.schoolId}`;
                    const isUpdating = updating[updateKey];
                    
                    return (
                      <tr key={index}>
                        <td>{item.districtName}</td>
                        <td>{item.blockName}</td>
                        <td>{item.schoolName}</td>
                        <td>
                          {isUpdating ? (
                            <Spinner animation="border" size="sm" />
                          ) : item.isAssigned ? (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleSchoolAccess(item, 'remove')}
                              disabled={isUpdating}
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleSchoolAccess(item, 'add')}
                              disabled={isUpdating}
                            >
                              Add
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No schools found matching the filters
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        /* District Level Access Table */
        <Card className="mb-4">
          <Card.Header>
            <h5>District Level Access</h5>
            <Badge bg="info">{districtLevelData.length} districts found</Badge>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Access</th>
                  <th>Bulk Actions</th>
                </tr>
              </thead>
              <tbody>
                {districtLevelData.map((item, index) => {
                  const updateKey = `district-${item.districtId}`;
                  const bulkKey = `bulk-${item.districtId}`;
                  const isUpdating = updating[updateKey];
                  const isBulkUpdating = updating[bulkKey];
                  
                  return (
                    <tr key={index}>
                      <td>{item.districtName}</td>
                      <td>
                        {isUpdating ? (
                          <Spinner animation="border" size="sm" />
                        ) : item.isAssigned ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleDistrictAccess(item, 'remove')}
                            disabled={isUpdating || isBulkUpdating}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDistrictAccess(item, 'add')}
                            disabled={isUpdating || isBulkUpdating}
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
                            onClick={() => handleBulkAddDistrict(item.districtId)}
                            disabled={isBulkUpdating}
                          >
                            {isBulkUpdating ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
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
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Class Assignment Section */}
      <Card>
        <Card.Header>
          <Row>
            <Col>
              <h5>Class Assignment</h5>
            </Col>
            <Col className="text-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleBulkClassAdd}
                disabled={updating.bulkClasses}
              >
                {updating.bulkClasses ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  "Add All Classes"
                )}
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Class</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {classData.map((item, index) => {
                const updateKey = `class-${item.className}`;
                const isUpdating = updating[updateKey];
                
                return (
                  <tr key={index}>
                    <td>Class {item.className}</td>
                    <td>
                      {isUpdating ? (
                        <Spinner animation="border" size="sm" />
                      ) : item.isAssigned ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleClassAccess(item.className, 'remove')}
                          disabled={isUpdating}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleClassAccess(item.className, 'add')}
                          disabled={isUpdating}
                        >
                          Add
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};