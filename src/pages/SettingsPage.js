import React, { useState } from "react";
import "../styles/SettingsPage.css"
import SettingsTabs from "../components/Settings/SettingsTabs";
import ProfileSettings from "../components/Settings/ProfileSettings";
import CompanySettings from "../components/Settings/CompanySettings";
import PreferencesSettings from "../components/Settings/PreferencesSettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import SecuritySettings from "../components/Settings/SecuritySettings";
import UserComponent from "../components/Settings/UserComponent";
import SystemSettings from "../components/Settings/SystemSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    theme: "light",
    language: "en",
    currency: "INR",
    timeZone: "Asia/Kolkata",
    emailNotif: true,
    smsNotif: false,
    twoFA: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings Saved", formData);
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">
      <h2>System Settings</h2>
      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <form className="settings-form" onSubmit={handleSubmit}>
        {activeTab === "profile" && (
          <ProfileSettings formData={formData} handleChange={handleChange} />
        )} 
        {activeTab === "company" && (
          <CompanySettings formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "preferences" && (
          <PreferencesSettings formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "notifications" && (
          <NotificationSettings formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "security" && (
          <SecuritySettings formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "user" && (
          <UserComponent formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "system" && <SystemSettings />}

        <div className="settings-actions">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="reset-btn" onClick={() => window.location.reload()}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
