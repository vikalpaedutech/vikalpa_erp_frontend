// // //This will have the dashboard of bills. 
// // //Using this admin can download and update the status of bills as paid, or bulk approve and
// // //...rejection can be done from here


// BillDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Table, Image, Form, Row, Col, Button, Pagination } from "react-bootstrap";
import Select from "react-select";
import { UserContext } from "../contextAPIs/User.context";
import {
  SchoolContext,
  BlockContext,
  DistrictBlockSchoolContext,
  ClassContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";
import { getAllBillsWithUserDetails, 
  deleteBill,
  updateBillVerificationAndApprovalStatus
 } from "../../service/Bills.services";

// CSV Export Utility
const exportToCsv = (rows) => {
  const csvContent = [
    [
      "S.No",
      "Bill ID",
      "Bill Upload Date",
      "User ID",
      "Name",
      "Role",
      "Purpose Of Expense",
      "Expense Type",
      "Expense Amount",
      "Bill Image URL",
      "District(s)",
      "School(s)",
      "Bill Date",
      "Status",
    ],
    ...rows.map((r, index) => [
      index + 1,
      r._id,
      r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "",
      r.userId,
      r.userDetails?.name || "N/A",
      r.role,
      r.purposeOfExpense || "N/A",
      r.expenseType || "N/A",
      r.expenseAmount || "N/A",
      r.fileUrl || "N/A",
      [...new Set(r.regionDetails?.map((d) => d.districtName) || [])].join(", ") || "N/A",
      [...new Set(r.regionDetails?.map((d) => d.centerName) || [])].join(", ") || "N/A",
      r.expenseDate ? new Date(r.expenseDate).toISOString().split("T")[0] : "",
      r.status,
    ]),
  ]
    .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")) 
    .join("\n");

  const filename = `bills_${new Date().toISOString().split("T")[0]}.csv`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const BillDashboard = () => {
  // Context apis
  const { userData } = useContext(UserContext);
  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext } = useContext(SchoolContext);
  const { classContext } = useContext(ClassContext);

  // Default date range for current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 2).toISOString().split("T")[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0+1).toISOString().split("T")[0];

  // State
  const [billsData, setBillsData] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // New state for verification functionality
  const [selectedBills, setSelectedBills] = useState([]);
  const [bulkStatus, setBulkStatus] = useState(null);
  const [bulkRemark, setBulkRemark] = useState(null);
  const [individualStatus, setIndividualStatus] = useState({});
  const [individualRemark, setIndividualRemark] = useState({});
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState({});

  // React Select options
  const verification_options = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  const accountant_verification_options = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  const approval_remark = [
    { value: 'Okay', label: 'Okay' },
    { value: 'Duplicate', label: 'Duplicate' },
    { value: 'Wrong Bill Uploaded', label: 'Wrong Bill Uploaded' },
  ];

  const rejection_options = [
    { value: 'Bill Not Clear', label: 'Bill Not Clear' },
    { value: 'Duplicate', label: 'Duplicate' },
    { value: 'Wrong Bill Uploaded', label: 'Wrong Bill Uploaded' },
  ];

  // Fetch bills
  const FetchAllBillsData = async () => {
    let roles;
    if (userData?.role==="Community Manager"){
      roles = ["CC", "ACI"]
    } else if (userData?.ROLE === "Accountant"){
      roles = ["CC", "ACI", "Community Manager", "Community Incharge", 
        "Teacher", "DTP", "Project Coordinator", "Tech", "Videographer",
        "Editor", "Academic Coordinator", 'Media Manager'
      ]
    } else {
      roles = ["CC", "ACI", "Community Manager", "Community Incharge", 
        "Teacher", "DTP", "Project Coordinator", "Tech", "Videographer",
        "Editor", "Academic Coordinator"
      ]
    }

    const reqBody = {
      roles: roles,
      startDate: startDate,
      endDate: endDate,
    }

    try {
      const data = await getAllBillsWithUserDetails(reqBody);
      setBillsData(data.data || []);
      console.log(data);
    } catch (error) {
      console.log("Error fetching bills data", error.message);
    }
  };

  useEffect(() => {
    FetchAllBillsData();
  }, [startDate, endDate]);

  // Handle bill deletion
  const handleBillDelete = async (id) => {
    const formData = {
      _id: id
    }

    try {
      const response = await deleteBill(formData);
      FetchAllBillsData();
    } catch (error) {
      alert('Bill not deleted! An error occurred');
    }
  };

  // Handle individual status submission
  const handleBillStatusSubmission = async (billId) => {
    const status = individualStatus[billId];
    const remark = individualRemark[billId];

    if (!status || !remark) {
      alert('Please select both status and remark');
      return;
    }

    let reqBody;

    if (userData?.role === "ACI") {
      reqBody = {
        checkingStatus: "Verification",
        billObjectId: billId,
        status: status.value,
        approvedOrVerifiedBy: userData?._id,
        verification: {
          verifiedBy: userData?._id,
          verifiedAt: new Date(),
          comments: remark.value,
        }
      }
    } else if (userData?.role === "Community Manager" || userData?.role === "Admin" || userData?.role === "Accountant") {
      reqBody = {
        checkingStatus: "Approval",
        billObjectId: billId,
        status: status.value,
        approvedOrVerifiedBy: userData?._id,
        approval: {
          approvedBy: userData?._id,
          approvedAt: new Date(),
          comments: remark.value,
        }
      }
    }
    try {
      const response = await updateBillVerificationAndApprovalStatus(reqBody);
      FetchAllBillsData();
      console.log(response.data);
    } catch (error) {
      alert('Error occurred while updating status');
    }
  };

  // Handle bulk submission
  const handleBulkSubmission = async () => {
    if (selectedBills.length <= 0) {
      alert("Select Bills");
      return;
    }

    if (!bulkStatus || !bulkRemark) {
      alert("Please select both status and remark for bulk action");
      return;
    }

    const approvalReqBody = selectedBills.map(billId => {
      if (userData?.role === "ACI") {
        return {
          checkingStatus: "Verification",
          billObjectId: billId,
          status: bulkStatus.value,
          approvedOrVerifiedBy: userData?._id,
          verification: {
            verifiedBy: userData?._id,
            verifiedAt: new Date(),
            comments: bulkRemark.value,
          }
        }
      } else if (userData?.role === "Community Manager" || userData?.role === "Admin") {
        return {
          checkingStatus: "Approval",
          billObjectId: billId,
          status: bulkStatus.value,
          approvedOrVerifiedBy: userData?._id,
          approval: {
            approvedBy: userData?._id,
            approvedAt: new Date(),
            comments: bulkRemark.value,
          }
        }
      } else if (userData?.role === "Accountant") {
        return {
          checkingStatus: "Payment",
          billObjectId: billId,
          status: bulkStatus.value,
          approvedOrVerifiedBy: userData?._id,
          payment: {
            paidBy: userData?._id,
            paidAt: new Date(),
            comments: bulkRemark.value,
          }
        }
      }
      return null;
    });

    try {
      for (let i = 0; i < approvalReqBody.length; i++) {
        if (approvalReqBody[i]) {
          const response = await updateBillVerificationAndApprovalStatus(approvalReqBody[i]);
        }
      }
      FetchAllBillsData();
      setSelectedBills([]);
      setBulkStatus(null);
      setBulkRemark(null);
      alert('Bulk submission completed successfully');
    } catch (error) {
      alert('Error occurred during bulk submission');
    }
  };

  // Handle individual status change
  const handleIndividualStatusChange = (billId, selectedOption) => {
    setIndividualStatus(prev => ({
      ...prev,
      [billId]: selectedOption
    }));
    
    // Reset remark when status changes
    setIndividualRemark(prev => ({
      ...prev,
      [billId]: null
    }));
  };

  // Handle individual remark change
  const handleIndividualRemarkChange = (billId, selectedOption) => {
    setIndividualRemark(prev => ({
      ...prev,
      [billId]: selectedOption
    }));
    
    // Enable submit button for this bill
    setSubmitButtonDisabled(prev => ({
      ...prev,
      [billId]: false
    }));
  };

  // Apply filters
  const filteredData = billsData.filter((bill) => {
    const districtNames = bill.regionDetails?.map((d) => d.districtName) || [];
    return (
      (roleFilter === "All" || bill.role === roleFilter) &&
      (statusFilter === "All" || bill.status === statusFilter) &&
      (districtFilter === "All" || districtNames.includes(districtFilter))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Unique district and school lists for filters
  const uniqueDistricts = [
    ...new Set(billsData.flatMap((bill) => bill.regionDetails?.map((d) => d.districtName) || [])),
  ];
  const uniqueSchools = [
    ...new Set(billsData.flatMap((bill) => bill.regionDetails?.map((d) => d.centerName) || [])),
  ];

  // Clear filters
  const clearFilters = () => {
    setRoleFilter("All");
    setStatusFilter("All");
    setDistrictFilter("All");
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
  };

  return (
    <Container fluid className="mt-4">
      <Card className="shadow-sm p-3">
        <h3 className="mb-3">Bills Dashboard</h3>

        {/* Bulk Submission Controls */}
        {(userData?.role === "Community Manager" || userData?.role === "ACI" || userData?.role === "Admin" || userData?.role === "Accountant") && (
          <Row className="mb-3">
            <Col md={12}>
              <Card className="bg-light">
                <Card.Body>
                  <h5>Bulk Submission</h5>
                  <Row>
                    <Col md={3}>
                      <Form.Label>Bulk Status</Form.Label>
                      <Select
                        options={userData?.role === "Accountant" ? accountant_verification_options : verification_options}
                        value={bulkStatus}
                        onChange={setBulkStatus}
                        placeholder="Select Status"
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Label>Bulk Remark</Form.Label>
                      <Select
                        options={bulkStatus?.value === 'Approved' || bulkStatus?.value === 'Paid' ? approval_remark : rejection_options}
                        value={bulkRemark}
                        onChange={setBulkRemark}
                        placeholder="Select Remark"
                        isDisabled={!bulkStatus}
                      />
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                      <Button 
                        onClick={handleBulkSubmission}
                        disabled={!bulkStatus || !bulkRemark || selectedBills.length === 0}
                      >
                        Bulk Submit ({selectedBills.length} selected)
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters */}
        <Row className="mb-3">
          <Col md={2}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Filter by Role</Form.Label>
              {userData?.role === "Community Manager" ? (
                <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="ACI">ACI</option>
                <option value="CC">CC</option>
              </Form.Select>
              ):(<Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="ACI">ACI</option>
                <option value="CC">CC</option>
                <option value="Teacher">Teacher</option>
                <option value="Editor">Editor</option>
                <option value="Community Manager">Community Manager</option>
                <option value="Videographer">Videographer</option>
                <option value="DTP">DTP</option>
                <option value="Project Coordinator">Project Coordinator</option>
                <option value="Academic Coordinator">Academic Coordinator</option>
              </Form.Select>)}
              
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Filter by Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
                <option value="Paid">Paid</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>Filter by District</Form.Label>
              <Form.Select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="All">All</option>
                {uniqueDistricts.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end mt-3">
            <Button
              variant="success"
              onClick={() => exportToCsv(filteredData)}
              className="me-2"
            >
              Export CSV
            </Button>
            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              {(userData?.role === "Community Manager" || userData?.role === "ACI" || userData?.role === "Admin" || userData?.role === "Accountant") && (
                <th>Select</th>
              )}
              <th>S.No</th>
              <th>Bill ID</th>
              <th>Upload Date</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Bill Image</th>
              <th>Bill Date</th>
              <th>Status</th>
              {(userData?.role === "Community Manager" || userData?.role === "ACI" || userData?.role === "Admin") && (
                <>
                  <th>Verification Status</th>
                  <th>Remark</th>
                  <th>Submit</th>
                  <th>Delete</th>
                </>
              )}
              {userData?.role === "Accountant" && (
                <>
                  <th>Payment Status</th>
                  <th>Remark</th>
                  <th>Submit</th>
                  <th>Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((bill, index) => (
                <tr key={bill._id}>
                  {(userData?.role === "Community Manager" || userData?.role === "ACI" || userData?.role === "Admin" || userData?.role === "Accountant") && (
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedBills.includes(bill._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBills([...selectedBills, bill._id]);
                          } else {
                            setSelectedBills(selectedBills.filter(id => id !== bill._id));
                          }
                        }}
                      />
                    </td>
                  )}
                  <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td>{bill._id}</td>
                  <td>{bill.createdAt ? new Date(bill.createdAt).toISOString().split("T")[0] : ""}</td>
                  <td>{bill.userId}</td>
                  <td>{bill.userDetails?.name || "N/A"}</td>
                  <td>{bill.role}</td>
                  <td>
                    {bill.fileUrl ? (
                      <a
                        href={bill.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={bill.fileUrl}
                          alt="Bill"
                          thumbnail
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {bill.expenseDate
                      ? new Date(bill.expenseDate).toISOString().split("T")[0]
                      : ""}
                  </td>
                  <td>{bill.status}</td>
                  
                  {(userData?.role === "Community Manager" || userData?.role === "ACI" || userData?.role === "Admin") && (
                    <>
                      <td>
                        <Select
                          options={verification_options}
                          value={individualStatus[bill._id] || null}
                          onChange={(selectedOption) => handleIndividualStatusChange(bill._id, selectedOption)}
                          placeholder="Select Status"
                        />
                      </td>
                      <td>
                        <Select
                          options={individualStatus[bill._id]?.value === 'Approved' ? approval_remark : rejection_options}
                          value={individualRemark[bill._id] || null}
                          onChange={(selectedOption) => handleIndividualRemarkChange(bill._id, selectedOption)}
                          placeholder="Select Remark"
                          isDisabled={!individualStatus[bill._id]}
                        />
                      </td>
                      <td>
                        <Row>
                          <Col>
                            <Button
                              size="sm"
                              onClick={() => handleBillStatusSubmission(bill._id)}
                              disabled={!individualStatus[bill._id] || !individualRemark[bill._id]}
                            >
                              Submit
                            </Button>
                          </Col>

                        </Row>
                      </td>
                      <td>
                         <Row>
                          
                          <Col>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleBillDelete(bill._id)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </td>
                    </>
                  )}
                  {userData?.role === "Accountant" && (
                    <>
                      <td>
                        <Select
                          options={accountant_verification_options}
                          value={individualStatus[bill._id] || null}
                          onChange={(selectedOption) => handleIndividualStatusChange(bill._id, selectedOption)}
                          placeholder="Select Status"
                        />
                      </td>
                      <td>
                        <Select
                          options={individualStatus[bill._id]?.value === 'Paid' ? approval_remark : rejection_options}
                          value={individualRemark[bill._id] || null}
                          onChange={(selectedOption) => handleIndividualRemarkChange(bill._id, selectedOption)}
                          placeholder="Select Remark"
                          isDisabled={!individualStatus[bill._id]}
                        />
                      </td>
                      <td>
                        <Row>
                          <Col>
                            <Button
                              size="sm"
                              onClick={() => handleBillStatusSubmission(bill._id)}
                              disabled={!individualStatus[bill._id] || !individualRemark[bill._id]}
                            >
                              Submit
                            </Button>
                          </Col>

                        </Row>
                      </td>
                      <td>
                         <Row>
                          
                          <Col>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleBillDelete(bill._id)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={(userData?.role === "Community Manager" || userData?.role === "ACI" || userData?.role === "Admin" || userData?.role === "Accountant") ? 13 : 9} className="text-center">
                  No bills found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-3">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        )}
      </Card>
    </Container>
  );
};
