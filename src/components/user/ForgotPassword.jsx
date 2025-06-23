import React, { useState } from "react";
import { Button, Form, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { patchUserByContact, patchUserById } from "../../service/User.service";
import { useLocation, useNavigate } from "react-router-dom";

export const ForgotPassword = () => {


    const navigate = useNavigate();

  const [contact1, setContact1] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [pin, setPin] = useState("");

  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [isPinUpdating, setIsPinUpdating] = useState(false);
  const [error, setError] = useState(null);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  };

  const sendOTP = async () => {
 
    setIsOtpSending(true);
    const otpCode = generateOTP();
    setGeneratedOtp(otpCode);
    setOtpSent(true);

     const message = `Dear user, your OTP for Vikalpa Account Sign-up is: ${otpCode}. Please do not share it with anyone. Vikalpa.`;

    const url = `http://sms.gooadvert.com/api/mt/SendSMS?APIKey=e3744d6493af43768cc71287368c1293&senderid=VIKLPA&channel=Trans&DCS=0&flashsms=0&number=91${contact1}&text=${encodeURIComponent(message)}&route=5&PEId=1401539030000072375`;

    try {
      await axios.get(url);
      alert(`OTP sent to ${contact1}`);
    } catch (err) {
      console.error("OTP send error", err);
      alert("Otp Sent on your number"); // + otpCode
    } finally {
      setIsOtpSending(false);
    }
  };

  const verifyOTP = () => {
    setIsOtpVerifying(true);
    if (otp === generatedOtp) {
      alert("OTP verified!");
      setOtpVerified(true);
    } else {
      alert("Incorrect OTP. Try again.");
    }
    setIsOtpVerifying(false);
  };

  // Dummy function to be replaced with real PATCH API call
  const updateUserPin = async () => {
   
    setIsPinUpdating(true);
    setError(null);
    try {

        const payLoad = {
            password: pin
        }
        
      // Replace this with your actual PATCH call
      // Example:
      // await axios.patch(`http://localhost:8000/api/users/update-pin`, { contact1, pin });

     const response = await patchUserByContact(contact1, payLoad)
      console.log("PATCH API CALLED => ", { contact1, pin });
      alert("PIN updated successfully!");
        
      navigate('/')

      setContact1("");
      setOtp("");
      setGeneratedOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setPin("");
    } catch (err) {
      console.error(err);
      setError("Failed to update PIN.");
    } finally {
      setIsPinUpdating(false);
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };

  return (
    <div className="forgot-password-container" style={{ minHeight: "100vh", padding: "2rem" }}>
      <div className="forgot-password-form">
        <h2>Forgot PIN</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {!otpSent && (
          <Form.Group className="mb-3">
            <Form.Label>Enter Registered Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={contact1}
              onChange={(e) => setContact1(e.target.value)}
              maxLength={10}
              required
            />
            <Button
              variant="warning"
              className="mt-2"
              onClick={sendOTP}
              disabled={contact1.length !== 10 || isOtpSending}
            >
              {isOtpSending ? <Spinner animation="border" size="sm" /> : "Send OTP"}
            </Button>
          </Form.Group>
        )}

        {otpSent && !otpVerified && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>
            <Button variant="info" onClick={verifyOTP} disabled={isOtpVerifying}>
              {isOtpVerifying ? <Spinner animation="border" size="sm" /> : "Verify OTP"}
            </Button>
            <Button variant="link" onClick={sendOTP}>Resend OTP</Button>
          </>
        )}

        {otpVerified && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Enter New 4-digit PIN</Form.Label>
              <Form.Control
                type="text"
                value={pin}
                onChange={handlePinChange}
                maxLength={4}
                placeholder="Enter 4-digit numeric PIN"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={updateUserPin}
              disabled={pin.length !== 4 || isPinUpdating}
            >
              {isPinUpdating ? "Updating..." : "Set PIN"}
            </Button>
          </>
        )}

        <hr />
        <p>
          Remember your PIN? <Card.Link href="/">Login</Card.Link>
        </p>
      </div>
    </div>
  );
};
