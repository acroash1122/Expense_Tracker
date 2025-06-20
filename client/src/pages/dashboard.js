// src/pages/dashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import '../styles/dashboard.css'; 
import axios from 'axios';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';


const Dashboard = () => {
  
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', type: 'income' });
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const isValidUserId = userId && userId !== 'null' && userId.length >= 12;

  useEffect(() => {
    if (!isValidUserId) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      alert("⚠️ Please login first.");
      navigate('/login');
    } else {
      fetchTransactions();
    }
  }, [navigate, userId]);

  useEffect(() => {
    renderPieChart();
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Failed to load transactions:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const { title, amount, type } = form;

    if (!title || isNaN(amount)) {
      setMessage("❌ Please fill all fields correctly.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/transactions/add', {
        title,
        amount,
        type,
        userId,
      });

      setMessage("✅ Transaction added!");
      setForm({ title: '', amount: '', type: 'income' });
      fetchTransactions();
    } catch (err) {
      setMessage("❌ Failed to add transaction.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("❌ Delete failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderPieChart = () => {
    const categoryStats = {};
    transactions.forEach(txn => {
      if (!categoryStats[txn.category]) categoryStats[txn.category] = 0;
      categoryStats[txn.category] += txn.amount;
    });

    const ctx = document.getElementById('categoryChart')?.getContext('2d');
    if (!ctx) return;

    if (window.categoryChart instanceof Chart) {
      window.categoryChart.destroy();
    }

    window.categoryChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(categoryStats),
        datasets: [{
          data: Object.values(categoryStats),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56',
            '#4BC0C0', '#9966FF', '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  };

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      

      <h1 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">💼 Expense Dashboard</h1>

            <div className="summary-container">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p>Rs. {income}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expense</h3>
          <p>Rs. {expense}</p>
        </div>
        <div className="summary-card balance">
          <h3>Net Balance</h3>
          <p>Rs. {income - expense}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">➕ Add New Transaction</h2>
        <div className="bg-white p-6 rounded-md shadow-md mb-10 border border-gray-200">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row sm:items-center gap-4"></form></div>
      <form onSubmit={handleAdd} className="transaction-form">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="flex-1 p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
          className="flex-1 p-3 border border-gray-300 rounded"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-3 border border-gray-300 rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Add
        </button>
      </form>

      {message && (
        <p className="message-box">{message}</p>
        )}

            <div className="filter-buttons">
      <button
        onClick={() => setFilter('all')}
        className={filter === 'all' ? 'active-filter' : ''}
      >
        All
      </button>
      <button
        onClick={() => setFilter('income')}
        className={filter === 'income' ? 'active-filter' : ''}
      >
        Income
      </button>
      <button
        onClick={() => setFilter('expense')}
        className={filter === 'expense' ? 'active-filter' : ''}
      >
        Expense
      </button>
    </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 All Transactions</h2>
      <div className="overflow-x-auto bg-white rounded shadow-md mb-8">
        <table className="min-w-full text-sm text-left transaction-table">
            
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-center">Category</th>
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((txn) => (
              <tr key={txn._id}>
                <td className="px-4 py-2">{txn.title}</td>
                <td className="px-4 py-2 text-right">Rs. {txn.amount}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-white ${txn.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {txn.type}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">{txn.category || '—'}</td>
                <td className="px-4 py-2 text-center">{txn.date?.slice(0, 10) || '—'}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(txn._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="logout-container">
      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </div>
      <div className="mt-10 bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">📊 Spending Breakdown by Category</h2>
        <div className="chart-container">
          <canvas id="categoryChart" className="w-full h-auto" />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
