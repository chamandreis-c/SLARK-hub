document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const id = document.getElementById("employeeId").value.trim().toUpperCase();
  const password = document.getElementById("password").value;
  const employee = employees.find(person => person.id === id);
  const error = document.getElementById("loginError");

  // Registered accounts are the only accounts accepted by this system.
  const registeredPasswords = JSON.parse(localStorage.getItem("registeredPasswords") || "{}");
  const validPassword = employee && employee.registeredAccount && registeredPasswords[id] === password;

  if (employee && validPassword) {
    App.currentUser = employee;
    sessionStorage.setItem("currentEmployee", JSON.stringify(employee));
    error.textContent = "";
    App.showApp();
  } else {
    error.textContent = "Invalid Employee ID or password. Please register first if you do not have an account.";
  }
});

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const department = document.getElementById("registerDepartment").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const error = document.getElementById("registerError");

  if (!name || !email || !department || !password) {
    error.textContent = "Please complete all fields.";
    return;
  }
  if (password.length < 6) {
    error.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (password !== confirmPassword) {
    error.textContent = "Passwords do not match.";
    return;
  }
  if (employees.some(person => person.email.toLowerCase() === email)) {
    error.textContent = "An account with this email already exists.";
    return;
  }

  const registered = employees.filter(person => person.registeredAccount);
  const highestId = registered.reduce((max, person) => {
    const match = person.id.match(/^EMP(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  const employeeId = "EMP" + String(highestId + 1).padStart(3, "0");
  const account = {
    id: employeeId,
    name,
    position: "Employee",
    department,
    email,
    phone: "Not provided",
    location: "Not specified",
    role: "Employee",
    registeredAccount: true
  };

  employees.push(account);
  App.saveRegisteredEmployees();
  const passwords = JSON.parse(localStorage.getItem("registeredPasswords") || "{}");
  passwords[employeeId] = password;
  localStorage.setItem("registeredPasswords", JSON.stringify(passwords));

  alert("Account created successfully! Your Employee ID is " + employeeId + ". You can now sign in.");
  document.getElementById("employeeId").value = employeeId;
  document.getElementById("password").value = "";
  document.getElementById("registerForm").reset();
  App.showAuthForm("login");
});
