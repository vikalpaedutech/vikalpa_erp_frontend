import React, { useState, useContext } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { createUser } from "../../service/User.service.js";
import Select from "react-select";
import axios from "axios";

// Context APIs
import {
  DistrictBlockSchoolContext,
  BlockContext,
  SchoolContext,
} from "../contextAPIs/DependentDropdowns.contextAPI";

import {
  DistrictBlockSchool,
  District,
} from "../DependentDropDowns/DistrictBlockSchool.component.jsx";

// Spinner Loader Component
import Spinner from 'react-bootstrap/Spinner';

const UserSignup = () => {


  
  //It gets the current coordinates of the user at the tiime of signup for attendance purpose
  let lat;
  let lng;
  navigator.geolocation.getCurrentPosition(
    (position) => {

       lat = position.coords.latitude;
        lng = position.coords.longitude;
      // send to backend
      console.log(lat, lng)
      
    },
    (err) => console.error(err),
    { enableHighAccuracy: true }
  );

  //____________________________________________________________________



  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext } = useContext(SchoolContext);

  const districtContextArray = districtContext.map((d) => d.value);
  const blockContextArray = blockContext.map((b) => b.value);
  const schoolContextArray = schoolContext.map((s) => s.value);

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    contact1: "",
    contact2: "",
    department: "",
    role: "",
    assignmentLevel: "School",
    isAdmin: false,
    assignedDistricts: [],
    assignedBlocks: [],
    assignedSchools: [],
    districtIds: [],
    blockIds: [],
    schoolIds: [],
    classId: [],
    studentId: "",
    permission: { create: false, read: false, update: false, delete: false },
    accessModules: [],
    isActive: true,
    profileImage: "",
    longitude: lng,
    latitude: lat
  });

  const [roles, setRoles] = useState({});
  const [classOfStudent, setClassOfStudent] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // OTP State
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false); // for loading spinner
  const [isOtpVerifying, setIsOtpVerifying] = useState(false); // for loading spinner

  const deptAndRole = [
    { Operations: ["Manager", "T.L", "Coordinator"] },
    { Community: ["Manager", "T.L", "ACI", "CC"] },
    {
      Academics: [
        "Teacher",
        "Academic-Coordinator",
        "DTP",
        "Presenter",
        "T.L.",
        "Manager",
      ],
    },
    { Media: ["Manager", "T.L.", "Editor", "Designer"] },
    { Tech: ["MIS", "Tech Lead",] },
  ];

  const classOptions = [
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];






  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "department") {
      const selectedDept = deptAndRole.find((dept) => dept[value]);
      if (selectedDept) {
        setRoles({ [value]: "" });
        setFormData((prev) => ({
          ...prev,
          department: value,
          role: "",
        }));
      }
    }

    if (name === "role") {
      setRoles({ [formData.department]: value });
    }
  };

  const handleClassChange = (selectedOptions) => {
    const selectedClasses = selectedOptions.map((option) => option.value);
    setClassOfStudent(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      classId: selectedClasses,
    }));
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

  const sendOTP = async () => {
    setIsOtpSending(true);  // show loader
    const otpCode = generateOTP();
    setGeneratedOtp(otpCode);
    setOtpSent(true);

    const message = `Dear user, your OTP for Vikalpa Account Sign-up is: ${otpCode}. Please do not share it with anyone. Vikalpa.`;

    const url = `http://sms.gooadvert.com/api/mt/SendSMS?APIKey=e3744d6493af43768cc71287368c1293&senderid=VIKLPA&channel=Trans&DCS=0&flashsms=0&number=91${formData.contact1}&text=${encodeURIComponent(
      message
    )}&route=5&PEId=1401539030000072375`;

    try {
      alert(otpCode)
      const response = await axios.get(url);
      console.log("OTP sent:", otpCode, response.data);
      alert(`OTP sent to ${formData.contact1}`);
    } catch (error) {
      console.error("Failed to send OTP", error);
      alert("Failed to send OTP, but here’s your test OTP: " + otpCode);
    } finally {
      setIsOtpSending(false);  // hide loader
    }
  };

  const verifyOTP = () => {
    setIsOtpVerifying(true); // show loader
    if (otp === generatedOtp) {
      alert("OTP verified successfully!");
      setOtpVerified(true);
    } else {
      alert("Incorrect OTP. Please try again.");
    }
    setIsOtpVerifying(false); // hide loader
  };

  const handleSubmit = async (e) => {

    if(lat === "" ||  lng === ""){
      alert("please refresh the page and allow location")
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

  let accessModules;

  if(formData.department === "Community"){
    accessModules = ["Academics", "Bills", "Downloads"]
  } 

    try {
      const userData = {
        ...formData,
        longitude: lng,
    latitude: lat,
    accessModules: accessModules,
        assignedDistricts: districtContextArray,
        assignedBlocks: blockContextArray,
        assignedSchools: schoolContextArray,
        districtIds: districtContextArray,
        blockIds: blockContextArray,
        schoolIds: schoolContextArray,
        classId: Array.isArray(formData.classId) ? formData.classId : [],
      };
console.log(userData)
      const response = await createUser(userData);
      console.log("User created successfully:", response);
      alert("User created successfully!");

      // Reset form
      setFormData({
        userId: "",
        name: "",
        email: "",
        password: "",
        contact1: "",
        contact2: "",
        department: "",
        role: "",
        assignmentLevel: "School",
        isAdmin: false,
        assignedDistricts: [],
        assignedBlocks: [],
        assignedSchools: [],
        districtIds: [],
        blockIds: [],
        schoolIds: [],
        classId: [],
        studentId: "",
        permission: { create: false, read: false, update: false, delete: false },
        accessModules: [],
        isActive: false,
        profileImage: "",
      });
      setRoles({});
      setClassOfStudent([]);
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error.response?.data?.message || "Failed to create user");
      alert(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="parent-user-signup" fluid style={{ minHeight: "100vh" }}>
      <div className="signup-form-child">
        <div className="user-signup-head-text">
          <h1>Vikalpa Foundation</h1>
          <h2>ERP-Signup</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Form className="signup-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {deptAndRole.map((dept, index) => {
                const deptName = Object.keys(dept)[0];
                return (
                  <option key={index} value={deptName}>
                    {deptName}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              {deptAndRole
                .find((dept) => dept[formData.department])
                ?.[formData.department]?.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>User ID / Employee ID</Form.Label>
            <Form.Control
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {Object.values(roles).includes("CC") ? (
            <>
              <DistrictBlockSchool />
              <Form.Group className="mb-3">
                <Form.Label>Class (multi-select)</Form.Label>
                <Select
                  isMulti
                  name="classId"
                  options={classOptions}
                  onChange={handleClassChange}
                  value={classOfStudent}
                />
              </Form.Group>
            </>
          ) : Object.values(roles).includes("ACI") ? (
            <District />
          ) : null}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Primary Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="contact1"
              value={formData.contact1}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Whatsapp Number</Form.Label>
            <Form.Control
              type="text"
              name="contact2"
              value={formData.contact2}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Send OTP Button with Spinner */}
          {!otpSent && formData.contact1.length === 10 && (
            <Button variant="warning" onClick={sendOTP} disabled={isOtpSending}>
              {isOtpSending ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Send OTP"
              )}
              <span className="visually-hidden">Loading...</span>
            </Button>
          )}

          {/* Verify OTP Button with Spinner */}
          {otpSent && !otpVerified && (
            <>
              <Form.Group className="mb-3 mt-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
              <Button variant="info" onClick={verifyOTP} disabled={isOtpVerifying}>
                {isOtpVerifying ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Verify OTP"
                )}
                <span className="visually-hidden">Loading...</span>
              </Button>
            </>
          )}

          {/* Resend OTP Button */}
          {otpSent && !otpVerified && (
            <Button variant="link" onClick={sendOTP}>
              Resend OTP
            </Button>
          )}

          {otpVerified && (
            <Form.Group className="mb-3 mt-3">
              <Form.Label>Create Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          {otpVerified && (
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          )}
        </Form>

        <hr />
        <p>
          Already have an account?{" "}
          <Card.Link href="/user-signin">Sign In</Card.Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
