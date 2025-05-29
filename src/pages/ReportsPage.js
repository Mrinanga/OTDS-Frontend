import React, { useState } from 'react';
import '../styles/Reports.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const reportTabs = [
    { key: 'sales', label: 'Sales Report' },
    { key: 'courier', label: 'Courier Status' },
    { key: 'agents', label: 'Agent Performance' },
    { key: 'billing', label: 'Billing Summary' },
  ];

  const sampleData = {
    sales: [
      { id: 1, date: '2025-05-10', orderId: '#1001', amount: 500, status: 'Delivered' },
      { id: 2, date: '2025-05-11', orderId: '#1002', amount: 700, status: 'Pending' },
    ],
    courier: [
      { id: 1, trackingId: 'TRX1001', zone: 'Zone A', status: 'In Transit', updated: '1 hour ago' },
      { id: 2, trackingId: 'TRX1002', zone: 'Zone B', status: 'Delivered', updated: 'Today' },
    ],
    agents: [
      { id: 1, name: 'Rahul Sharma', deliveries: 30, successRate: 95 },
      { id: 2, name: 'Priya Verma', deliveries: 25, successRate: 92 },
    ],
    billing: [
      { id: 1, invoiceId: 'INV1001', date: '2025-05-09', total: 1200, paid: 'Yes' },
      { id: 2, invoiceId: 'INV1002', date: '2025-05-12', total: 850, paid: 'No' },
    ]
  };

  const handleExport = (type) => {
    alert(`${type.toUpperCase()} export triggered! (mock)`);
  };

  const filteredData = sampleData[activeTab].filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const chartData =
    activeTab === 'sales'
      ? sampleData.sales.map((item) => ({
          name: item.orderId,
          Amount: item.amount,
        }))
      : activeTab === 'agents'
      ? sampleData.agents.map((agent) => ({
          name: agent.name,
          Deliveries: agent.deliveries,
        }))
      : [];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports</h2>
        <div className="filters">
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          <input
            type="text"
            placeholder="Search in reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => handleExport('csv')}>Export CSV</button>
          <button onClick={() => handleExport('print')}>Print</button>
        </div>
      </div>

      <div className="tabs">
        {reportTabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={Object.keys(chartData[0])[1]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="report-table">
        {filteredData.length === 0 ? (
          <p className="no-results">No data found for this report.</p>
        ) : (
          <table>
            <thead>
              <tr>
                {Object.keys(filteredData[0]).map((key) => (
                  <th key={key}>{key.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  {Object.values(item).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;