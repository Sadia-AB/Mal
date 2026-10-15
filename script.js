const expenseForm = document.getElementById("expense-form");
const expenseInput = document.getElementById("expense");
const amountInput = document.getElementById("amount");
const expenseList = document.getElementById("expense-list");
const totalSpent = document.getElementById("total-spent");
const budgetRemaining = document.getElementById("budget-remaining");

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

  const expense = {
    id: Date.now(),
    name: expenseName,
    amount: expenseAmount,
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

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.textContent = `£${expense.amount.toFixed(2)}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    expenseItem.appendChild(expenseName);
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

showSavedExpenses();
