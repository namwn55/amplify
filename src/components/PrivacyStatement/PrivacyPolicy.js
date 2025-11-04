import React from "react";

function PrivacyPolicy(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy describes how we collect, use, and protect your personal information when you use our website.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Full name</li>
        <li>Email address</li>
        <li>Username and encrypted password</li>
        <li>IP address and browser/device metadata</li>
        <li>Location data (approximate, based on IP)</li>
        <li>Usage behavior and analytics data</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Why We Collect Personal Credentials</h2>
      <p className="mb-4">
        We collect personal credentials such as usernames and encrypted passwords to:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Securely authenticate users and manage access</li>
        <li>Protect user accounts from unauthorized access</li>
        <li>Detect, prevent, and investigate fraudulent activities</li>
        <li>Comply with applicable laws and regulations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
      <p className="mb-4">
        We use the information we collect to:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide and improve our services</li>
        <li>Personalize your experience</li>
        <li>Communicate with you regarding updates or support</li>
        <li>Ensure the security and integrity of our systems</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. How We Protect Your Data</h2>
      <p className="mb-4">
        We use industry-standard encryption, secure servers, and multi-layered access controls to protect your data. Passwords are stored using strong one-way encryption algorithms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p className="mb-4">
        You may request access, correction, or deletion of your personal data at any time by contacting us.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
