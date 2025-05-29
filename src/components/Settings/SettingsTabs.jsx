import React from "react";

export default function SettingsTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "company", label: "Company" },
    { key: "preferences", label: "Preferences" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
    { key: "user", label: "User" },
    { key: "system", label: "System" },
  ];

  return (
    <div className="tabs">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={activeTab === key ? "active" : ""}
          onClick={() => setActiveTab(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
