// src/components/UsersList.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Pagination,
  Modal,
} from "react-bootstrap";
import Select from "react-select"; // ✅ react-select for multi dropdowns
import {
  getAllUsersWithAccess,
  updateUserWithAccess,
} from "../service/User.service";
import DistrictBlockSchool from "../components/CentersOrSchools/DistrictBlockSchool.json";
import { GetDistrictBlockSchoolByParams } from "../service/DistrictBlockSchool.service";
import { getUsersByObjectId } from "../service/User.service";
export const UpdateUser = () => {
  // -----------------------------
  // Hooks
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // -----------------------------
  // Department -> Role mapping
  const departmentRoles = {
    Community: [
      "CC",
      "ACI",
      "Community Incharge",
      "Project Coordinator",
      "Community Manager",
      "Technician",
    ],
    Academics: ["Academic-Coordinator", "DTP", "Teacher"],
    Admin: ["Admin"],
    HR: ["HR Executive", "HR Manager"],
    Media: ["Media Manager", "Photographer"],
    Tech: ["MIS", "Data Analyst", "Tech Lead"],
    Accounts: ["Accountant"],
  };

  // -----------------------------
  // Fetch Users
  const fetchUser = async () => {
    const reqQuery = { page: page || 1 };

    if (name) reqQuery.name = name;
    if (userId) reqQuery.userId = userId;
    if (contact1) reqQuery.contact1 = contact1;
    if (contact2) reqQuery.contact2 = contact2;
    if (department) reqQuery.department = department;
    if (role) reqQuery.role = role;
    if (isActive) reqQuery.isActive = isActive;

    try {
      const response = await getAllUsersWithAccess(reqQuery);
      if (response.totalPages) setTotalPages(response.totalPages);

      //Console logging my users data.
      console.log(response.data);

      setUsers(response.data || []);
    } catch (error) {
      console.log("Error fetching data");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [page]);

  //Modal to update user details
  const [show, setShow] = useState(false);

  const [showAccessModal, setShowAccessModal] = useState(false);

  const [filteredUser, setFilteredUser] = useState([]);

  const handleClose = () => {
    setShowAccessModal(false);
    setShow(false);
  };
  const handleShow = async (id) => {
    const reqBody = {
      _id: id,
    };

    const response = await getUsersByObjectId(reqBody);

    console.log(response.data);

    setFilteredUser(response.data[0]);

    setShow(true);
  };

  const [userAllSchoolIds, setUserAllSchoolIds] = useState([]);

  const handleAccessModal = async (id) => {
    const reqBody = {
      _id: id,
    };

    const response = await getUsersByObjectId(reqBody);

    console.log(
      response.data.accessDetails?.region.flatMap((region) =>
        region.blockIds.flatMap((block) =>
          block.schoolIds.map((school) => school.schoolId)
        )
      )
    );

    setFilteredUser(response.data[0]);

    const allSchoolIds = response.data?.accessDetails?.region.flatMap(
      (region) =>
        region.blockIds.flatMap((block) =>
          block.schoolIds.map((school) => school.schoolId)
        )
    );

    const uniqueSchoolIds = [...new Set(allSchoolIds)];
    setUserAllSchoolIds(
      response.data[0].accessDetails?.region.flatMap((region) =>
        region.blockIds.flatMap((block) =>
          block.schoolIds.map((school) => school.schoolId)
        )
      )
    );

    setShowAccessModal(true);

    console.log(userAllSchoolIds);

    districtOptions();

   
  
    
  };

  //Fetching district_block_schools data
  const [dbDistrictBlockSchoolData, setDbDistrictBlockSchoolData] = useState(
    []
  );
  const fetchDistrictBlockSchool = async () => {
    try {
      const response = await GetDistrictBlockSchoolByParams();

      console.log(response.data);

      setDbDistrictBlockSchoolData(response.data);
    } catch (error) {
      console.log("Error::::>", error);
    }
  };

  useEffect(() => {
    fetchDistrictBlockSchool();
  }, []);

  let districtSelectOptions = [];
  const [districtOptioins1, setDistrictOptioins1] = useState([]);
  const districtOptions = async () => {
    console.log(userAllSchoolIds);

    filteredUser?.access?.region?.map((eachRegion, index) => {
      districtSelectOptions.push({
        label: eachRegion.districtId,
        value: eachRegion.districtId,
      });
    });

    console.log(
      filteredUser?.accessDetails?.region?.map((eachRegion, index) => {
        districtSelectOptions.push({
          label: eachRegion.districtId,
          value: eachRegion.districtId,
        });
      })
    );

    setDistrictOptioins1(districtSelectOptions);
  };

  //function to update filteredUserobject.
  const updateUserGeneralDetails = () => {
    console.log(filteredUser);
  };

  useEffect(() => {
    updateUserGeneralDetails();
  }, [filteredUser]);

  return (
    <Container fluid>
      <h1>Hello Update Users</h1>
      <hr></hr>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>User Id</th>
            <th>Name</th>
            <th>email</th>
            <th>Contact 1</th>
            <th>Contact 2</th>
            <th>Department</th>
            <th>Role</th>
            <th>Edit General</th>
            <th>Edit Access</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            <>
              {users.map((eachUser, index) => {
                return (
                  <tr key={eachUser._id}>
                    <td>{index + 1}</td>
                    <td>{eachUser.userId}</td>
                    <td>{eachUser.name}</td>
                    <td>{eachUser.email}</td>
                    <td>{eachUser.contact1}</td>
                    <td>{eachUser.contact2}</td>
                    <td>{eachUser.department}</td>
                    <td>{eachUser.role}</td>
                    <td>
                      <Button
                        id={eachUser._id}
                        onClick={(e) => handleShow(e.target.id)}
                      >
                        ✎
                      </Button>
                    </td>
                    <td>
                      <Button
                        id={eachUser._id}
                        onClick={(e) => handleAccessModal(e.target.id)}
                      >
                        ✎
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : null}
        </tbody>
      </Table>

      {/* Modal to update user */}
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{filteredUser.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>User Id</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.userId || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      userId: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.name || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      name: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={filteredUser?.email || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      email: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Contact 1</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.contact1}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      contact1: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Contact 2</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.contact2 || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      contact2: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              {/* Department dropdown */}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Department</Form.Label>
                <Select
                  options={Object.keys(departmentRoles).map((dep) => ({
                    label: dep,
                    value: dep,
                  }))}
                  value={
                    filteredUser?.department
                      ? {
                          label: filteredUser.department,
                          value: filteredUser.department,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      department: selected.value,
                      role: "", // reset role when department changes
                    });
                  }}
                />
              </Form.Group>

              {/* Role dropdown dependent on department */}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Role</Form.Label>
                <Select
                  options={
                    filteredUser?.department
                      ? departmentRoles[filteredUser.department].map(
                          (role) => ({
                            label: role,
                            value: role,
                          })
                        )
                      : []
                  }
                  value={
                    filteredUser?.role
                      ? { label: filteredUser.role, value: filteredUser.role }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      role: selected.value,
                    });
                  }}
                />
              </Form.Group>

              {/* IsActive dropdown */}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Is Active</Form.Label>
                <Select
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  value={
                    filteredUser?.isActive === true
                      ? { label: "True", value: true }
                      : filteredUser?.isActive === false
                      ? { label: "False", value: false }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      isActive: selected.value,
                    });
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>

      <>
        <Modal show={showAccessModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>User Access</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Class Id</Form.Label>

                {["9", "10"].map((eachClass) => {
                  return (
                    <>
                      <h1>{eachClass}</h1>
                      <input
                        type="checkbox"
                        value={eachClass}
                        checked={!!eachClass}
                      />
                    </>
                  );
                })}
              </Form.Group>

              <Form.Group>
                <Form.Label>District</Form.Label>

                {console.log(districtSelectOptions)}
                <Select
                  isMulti
                  options={districtOptioins1}
                  value={districtOptioins1}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Block</Form.Label>

                {console.log(districtSelectOptions)}
                <Select
                  isMulti
                  options={districtOptioins1}
                  value={districtOptioins1}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.name || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      name: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={filteredUser?.email || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      email: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Contact 1</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.contact1}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      contact1: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Contact 2</Form.Label>
                <Form.Control
                  type="text"
                  value={filteredUser?.contact2 || ""}
                  onChange={(e) => {
                    setFilteredUser({
                      ...filteredUser,
                      contact2: e.target.value,
                    });
                  }}
                />
              </Form.Group>

              {/* Department dropdown */}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Department</Form.Label>
                <Select
                  options={Object.keys(departmentRoles).map((dep) => ({
                    label: dep,
                    value: dep,
                  }))}
                  value={
                    filteredUser?.department
                      ? {
                          label: filteredUser.department,
                          value: filteredUser.department,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      department: selected.value,
                      role: "", // reset role when department changes
                    });
                  }}
                />
              </Form.Group>

              {/* Role dropdown dependent on department */}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Role</Form.Label>
                <Select
                  options={
                    filteredUser?.department
                      ? departmentRoles[filteredUser.department].map(
                          (role) => ({
                            label: role,
                            value: role,
                          })
                        )
                      : []
                  }
                  value={
                    filteredUser?.role
                      ? { label: filteredUser.role, value: filteredUser.role }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      role: selected.value,
                    });
                  }}
                />
              </Form.Group>

              {/* IsActive dropdown */}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Is Active</Form.Label>
                <Select
                  options={[
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ]}
                  value={
                    filteredUser?.isActive === true
                      ? { label: "True", value: true }
                      : filteredUser?.isActive === false
                      ? { label: "False", value: false }
                      : null
                  }
                  onChange={(selected) => {
                    setFilteredUser({
                      ...filteredUser,
                      isActive: selected.value,
                    });
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </Container>
  );
};
