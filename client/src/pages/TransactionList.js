import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err.message);
      }
    };
    fetchTransactions();
  }, [userId]);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Title</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Type</th>
              <th className="p-2">Category</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn._id} className="border-t">
                <td className="p-2">{txn.title}</td>
                <td className="p-2">Rs. {txn.amount}</td>
                <td className="p-2 text-sm text-white">
                  <span className={`px-2 py-1 rounded ${txn.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {txn.type}
                  </span>
                </td>
                <td className="p-2">{txn.category}</td>
                <td className="p-2">{new Date(txn.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;
