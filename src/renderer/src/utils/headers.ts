export function userAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };
}

export function hubAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("deviceToken")}`,
  };
}