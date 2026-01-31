// Save user
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get user
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("user");
};
