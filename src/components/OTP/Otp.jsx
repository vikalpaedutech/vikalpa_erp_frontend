//Frontend/components/OTP/Otp.jsx



import React, {useState, useEffect} from "react";

export const OTP = (number) =>{

    //Hooks
    const [isOtpSending, setIsOtpSending] = useState(false); // for loading spinner
    onst [generatedOtp, setGeneratedOtp] = useState("");   
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerifying, setIsOtpVerifying] = useState(false); // for loading spinner
      const [otpVerified, setOtpVerified] = useState(false);

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

}

