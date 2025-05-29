import React from "react";
import "../../styles/overviewCards.css";

const OverviewCards = () => {
  const data = [
    { title: "Total Deliveries", value: 1287 },
    { title: "Pending Deliveries", value: 134 },
    { title: "Delivered Today", value: 76 },
    { title: "Cancelled Orders", value: 12 },
  ];

  return (
    <div className="overview-cards">
      {data.map((item, index) => (
        <div key={index} className="card">
          <h3>{item.title}</h3>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
