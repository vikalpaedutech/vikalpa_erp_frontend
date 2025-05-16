import React, { useState, useContext, useEffect } from "react";
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
  const { districtContext } = useContext(DistrictBlockSchoolContext);
  const { blockContext } = useContext(BlockContext);
  const { schoolContext } = useContext(SchoolContext);

  const districtContextArray = districtContext.map((d) => d.value);
  const blockContextArray = blockContext.map((b) => b.value);
  const schoolContextArray = schoolContext.map((s) => s.value);

  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
    error: null
  });

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
    longitude: null,
    latitude: null
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

  // Get user's current location
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setCoordinates(prev => ({
          ...prev,
          error: "Geolocation is not supported by your browser"
        }));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0 // force fresh location
      };

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          });
          // Update formData with coordinates
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (err) => {
          setCoordinates(prev => ({
            ...prev,
            error: `Unable to retrieve location: ${err.message}`
          }));
        },
        options
      );

      return () => navigator.geolocation.clearWatch(watchId);
    };

    getLocation();
  }, []);

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
      alert(`YOUR OTP:`, otpCode)
      const response = await axios.get(url);
      console.log("OTP sent:", otpCode, response.data);
      alert(`OTP sent to ${formData.contact1}`);
    } catch (error) {
      console.error("Failed to send OTP", error);
      //alert("Failed to send OTP, but here's your test OTP: " + otpCode);
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
    e.preventDefault();
    
    // Check if coordinates are available
    if (!coordinates.latitude || !coordinates.longitude) {
      alert("Please enable location services and refresh the page to continue. Location is required for signup.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let accessModules;

    if(formData.department === "Community"){
      accessModules = ["Academics", "Bills", "Downloads"]
    } else if (formData.department === "Academics"){
      accessModules = ["Academics", "Bills", "Downloads", "Monitoring"]
    }

    try {
      const userData = {
        ...formData,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
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
        longitude: null,
        latitude: null
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

        {coordinates.error && (
          <div className="alert alert-warning">
            {coordinates.error}. Please enable location services and refresh the page.
          </div>
        )}

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

          {/* Location status */}
          <div className="mb-3">
            <small className="text-muted">
              {coordinates.latitude && coordinates.longitude ? 
                "Location obtained successfully" : 
                "Waiting for location... Please ensure location services are enabled"}
            </small>
          </div>

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
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting || !coordinates.latitude || !coordinates.longitude}
            >
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