import React, { useState } from 'react';
import axios from 'axios';

const AddTransaction = () => {
  const [form, setForm] = useState({ title: '', amount: '', type: 'expense', category: '' });
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');// Save this during login later

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        
      await axios.post('http://localhost:5000/api/transactions/add', { ...form, userId });
      setMessage('Transaction added!');
      setForm({ title: '', amount: '', type: 'expense' });
    } catch (err) {
      setMessage('Failed to add transaction');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange}
          className="w-full border p-2 rounded mb-3" required />

        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange}
          className="w-full border p-2 rounded mb-3" required />

        <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded mb-3">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>


        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700">
          Add
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default AddTransaction;
