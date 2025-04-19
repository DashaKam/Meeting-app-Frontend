// Валидация name
const validateName = (name) => {
  return name.length >= 3;
};

// Валидация ника
const validateUserName = (username) => {
  return username.length >= 3;
};
// Валидация email
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
};

// Валидация пароля
const validatePassword = (password) => {
  return /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password);
};

export { validateName, validateUserName, validateEmail, validatePassword };