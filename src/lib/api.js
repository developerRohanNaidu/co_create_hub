// utils/apiRequest.js
const BASE_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, method = "GET", body = null, isFormData = false) {
  try {
    const token = localStorage.getItem("token"); // JWT token
    const headers = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : null,
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    return { success: false, message: "Network error" };
  }
}

/**
 * Multipart/form-data request wrapper
 * @param {string} endpoint API endpoint
 * @param {FormData} formData FormData object
 * @param {string} method HTTP method (default POST)
 */
export async function multipartRequest(endpoint, formData, method = "POST") {
  try {
    const token = localStorage.getItem("token");
    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers, // don't set Content-Type → browser will auto-set boundary
      body: formData,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Multipart Request Error:", error);
    return { success: false, message: "Network error" };
  }
}
