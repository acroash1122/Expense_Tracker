import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const userId = localStorage.getItem('userId');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await axios.get(`http://localhost:5000/api/transactions/summary/${userId}`);
      setSummary(res.data);
    };
    fetchSummary();
  }, [userId]);

  if (!summary) return <p className="text-center mt-10">Loading analytics...</p>;

  const pieData = {
    labels: Object.keys(summary.categoryStats),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(summary.categoryStats),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }
    ]
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">💹 Analytics Dashboard</h2>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        <p><strong>Total Income:</strong> Rs. {summary.income}</p>
        <p><strong>Total Expense:</strong> Rs. {summary.expense}</p>
        <p><strong>Balance:</strong> Rs. {summary.balance}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Category-wise Expenses</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default Analytics;
