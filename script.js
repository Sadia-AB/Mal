const expenseForm = document.getElementById("expense-form");
const expenseInput = document.getElementById("expense");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const expenseList = document.getElementById("expense-list");
const totalSpent = document.getElementById("total-spent");
const budgetRemaining = document.getElementById("budget-remaining");
const spendingBreakdown = document.getElementById("spending-breakdown");

const budget = 1500;
let expenses = JSON.parse(localStorage.getItem("mal-expenses")) || [];

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (expenseInput.value.trim() === "") {
    alert("Please enter an expense description");
    return;
  }

  if (amountInput.value === "") {
    alert("Please enter an amount");
    return;
  }
  if (Number(amountInput.value) <= 0) {
    alert("Please enter an amount greater than £0");
    return;
  }

  const expenseName = expenseInput.value.trim();
  const expenseAmount = Number(amountInput.value);
  const expenseCategory = categoryInput.value;

  const expense = {
    id: Date.now(),
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory,
  };

  expenses.push(expense);
  localStorage.setItem("mal-expenses", JSON.stringify(expenses));

  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  totalSpent.textContent = `£${total.toFixed(2)}`;

  const remaining = budget - total;
  budgetRemaining.textContent = `£${remaining.toFixed(2)}`;

  showSavedExpenses();

  expenseForm.reset();
});

function showSavedExpenses() {
  expenseList.innerHTML = "";
  updateSpendingBreakdown();

  if (expenses.length === 0) {
    expenseList.textContent = "No expenses yet. Add one above to get started.";
    return;
  }

  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  totalSpent.textContent = `£${total.toFixed(2)}`;

  const remaining = budget - total;
  budgetRemaining.textContent = `£${remaining.toFixed(2)}`;

  expenses.forEach(function (expense) {
    const expenseItem = document.createElement("div");
    expenseItem.classList.add("expense-item");

    const expenseName = document.createElement("span");
    expenseName.classList.add("expense-name");
    expenseName.textContent = expense.name;

    const expenseCategory = document.createElement("span");
    expenseCategory.classList.add("expense-category");
    expenseCategory.textContent = expense.category || "Other";

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.textContent = `£${expense.amount.toFixed(2)}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    expenseItem.appendChild(expenseName);
    expenseItem.appendChild(expenseCategory);
    expenseItem.appendChild(expenseAmount);
    expenseItem.appendChild(deleteButton);

    expenseList.appendChild(expenseItem);

    deleteButton.addEventListener("click", function () {
      const expenseIndex = expenses.findIndex(function (item) {
        return item.id === expense.id;
      });

      expenses.splice(expenseIndex, 1);

      localStorage.setItem("mal-expenses", JSON.stringify(expenses));

      const total = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
      }, 0);

      totalSpent.textContent = `£${total.toFixed(2)}`;

      const remaining = budget - total;
      budgetRemaining.textContent = `£${remaining.toFixed(2)}`;

      showSavedExpenses();
    });
  });
}
function updateSpendingBreakdown() {
  spendingBreakdown.innerHTML = "";

  if (expenses.length === 0) {
    spendingBreakdown.textContent = "Your spending breakdown will appear here.";
    return;
  }
  const categoryTotals = {};

  expenses.forEach(function (expense) {
    const category = expense.category || "Other";

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += expense.amount;
  });
  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  const sortedCategories = Object.entries(categoryTotals).sort(function (a, b) {
    return b[1] - a[1];
  });
  sortedCategories.forEach(function (item) {
    const category = item[0];
    const amount = item[1];
    const percentage = (amount / total) * 100;

    const categoryRow = document.createElement("div");
    categoryRow.classList.add("category-row");

    const categoryDetails = document.createElement("div");
    categoryDetails.classList.add("category-details");

    const categoryName = document.createElement("span");
    categoryName.classList.add("category-name");
    categoryName.textContent = category;

    const categoryAmount = document.createElement("span");
    categoryAmount.classList.add("category-amount");
    categoryAmount.textContent = `£${amount.toFixed(2)}`;

    const categoryPercentage = document.createElement("span");
    categoryPercentage.classList.add("category-percentage");
    categoryPercentage.textContent = `${Math.round(percentage)}%`;

    categoryAmount.appendChild(categoryPercentage);

    categoryDetails.appendChild(categoryName);
    categoryDetails.appendChild(categoryAmount);

    const barBackground = document.createElement("div");
    barBackground.classList.add("category-bar-background");

    const bar = document.createElement("div");
    bar.classList.add("category-bar");
    bar.style.width = `${percentage}%`;

    barBackground.appendChild(bar);
    categoryRow.appendChild(categoryDetails);
    categoryRow.appendChild(barBackground);

    spendingBreakdown.appendChild(categoryRow);
  });
}
showSavedExpenses();
