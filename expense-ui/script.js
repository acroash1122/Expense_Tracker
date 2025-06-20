document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transactionForm');
  const message = document.getElementById('message');
  const tableBody = document.querySelector('#transactionsTable tbody');

  // ✅ Get userId from localStorage and validate it
  const userId = localStorage.getItem('userId');
  const isValidUserId = userId && userId !== 'null' && userId !== '' && userId.length >= 12;

  if (!isValidUserId) {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    alert("⚠️ Please login first to view transactions.");
    window.location.href = "/login";
    return;
  }

  console.log("✅ Valid userId detected:", userId);

  // ✅ Render Pie Chart
  function renderPieChart(data) {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    if (window.categoryChart instanceof Chart) {
      window.categoryChart.destroy();
    }

    const categories = Object.keys(data);
    const amounts = Object.values(data);

    if (amounts.every(value => value === 0)) {
      console.log("⚠️ No data to display in chart.");
      return;
    }

    window.categoryChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          label: 'Category-wise Spending',
          data: amounts,
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
  }

  // ✅ Load and Render Transactions
  async function renderTransactions(filter = 'all') {
    try {
      console.log("🔍 Fetching transactions for:", userId);

      const response = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
      const txns = response.data;

      const filteredTxns = filter === 'all' ? txns : txns.filter(t => t.type === filter);
      tableBody.innerHTML = '';

      filteredTxns.forEach((txn) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${txn.title}</td>
          <td>${txn.amount}</td>
          <td style="text-align: center;">
            <span style="
              padding: 4px 8px;
              background-color: ${txn.type === 'income' ? '#c8f7c5' : '#ffd6d6'};
              color: ${txn.type === 'income' ? '#2e7d32' : '#c62828'};
              border-radius: 6px;
              font-weight: bold;
              font-size: 0.9rem;">
              ${txn.type}
            </span>
          </td>
          <td style="text-align: center;">${txn.date || '—'}</td>
          <td style="text-align: center;">
            <button onclick="deleteTransaction('${txn._id}')" style="
              background-color: #e74c3c;
              color: white;
              border: none;
              padding: 6px 10px;
              border-radius: 4px;
              cursor: pointer;">
              Delete
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // ✅ Summary stats
      let totalIncome = 0, totalExpense = 0;
      const categoryStats = {};

      txns.forEach(txn => {
        if (txn.type === 'income') {
          totalIncome += txn.amount;
        } else {
          totalExpense += txn.amount;
        }

        // Track category spending
        if (!categoryStats[txn.category]) categoryStats[txn.category] = 0;
        categoryStats[txn.category] += txn.amount;
      });

      document.getElementById('totalIncome').textContent = `Rs. ${totalIncome}`;
      document.getElementById('totalExpense').textContent = `Rs. ${totalExpense}`;
      document.getElementById('netBalance').textContent = `Rs. ${totalIncome - totalExpense}`;

      renderPieChart(categoryStats);

    } catch (err) {
      console.error("❌ Failed to load transactions:", err.response?.data || err.message);
    }
  }

  // ✅ Delete transaction via API
  async function deleteTransaction(txnId) {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${txnId}`);
      renderTransactions(); // Reload after delete
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  }

  // ✅ Filter buttons
  window.deleteTransaction = deleteTransaction;
  window.filterTransactions = function (type) {
    renderTransactions(type);
  };

  // ✅ Add new transaction via API
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = form.title.value.trim();
    const amount = parseFloat(form.amount.value);
    const type = form.type.value;

    if (!title || isNaN(amount)) {
      message.textContent = "Please fill all fields correctly.";
      message.style.color = "red";
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/transactions/add', {
        title,
        amount,
        type,
        userId
      });

      message.textContent = "✅ Transaction added!";
      message.style.color = "green";
      form.reset();
      renderTransactions();
    } catch (err) {
      console.error("Failed to add transaction", err);
      message.textContent = "❌ Failed to add.";
      message.style.color = "red";
    }
  });

  // ✅ Initial Load
  renderTransactions();
});
