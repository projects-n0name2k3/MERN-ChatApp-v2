export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  if (re.test(email)) {
    return true;
  }
  return "Please enter a valid email";
};

export const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9]{6,20}$/;
  if (re.test(username)) {
    return true;
  }
  return "Username must be between 6 and 20 characters long and contain only letters and numbers";
};

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  if (re.test(password)) {
    return true;
  }
  return "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number";
};
