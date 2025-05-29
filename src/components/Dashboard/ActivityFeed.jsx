import React from "react";
import "../../styles/ActivityFeed.css"; // Import your CSS styles
const ActivityFeed = () => {
  const activities = [
    { id: 1, text: "Package #12345 delivered to Guwahati", time: "2 mins ago" },
    { id: 2, text: "Shipment #78901 picked up from Delhi Hub", time: "10 mins ago" },
    { id: 3, text: "Order #45678 delayed due to weather", time: "30 mins ago" },
  ];

  return (
    <ul className="activity-list">
      {activities.map(activity => (
        <li key={activity.id}>
          <strong>{activity.text}</strong>
          <span>{activity.time}</span>
        </li>
      ))}
    </ul>
  );
};

export default ActivityFeed;
