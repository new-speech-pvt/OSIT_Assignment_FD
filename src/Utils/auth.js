export const saveUserToLocal = (user) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

export const getUserFromLocal = () => {
  return JSON.parse(localStorage.getItem("authUser"));
};
