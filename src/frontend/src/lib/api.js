const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // allow cookies for refreshToken
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    let errMsg = `${method} ${path} failed: ${res.status}`;
    // Prefer backend error message if available
    if (
      data &&
      data.errors &&
      Array.isArray(data.errors) &&
      data.errors[0]?.msg
    ) {
      errMsg = data.errors[0].msg;
    } else if (data && data.message) {
      errMsg = data.message;
    } else if (data && data.msg) {
      errMsg = data.msg;
    }
    const error = new Error(errMsg);
    error.data = data;
    throw error;
  }
  return res.status === 204 ? null : data;
}

export const api = {
  contact: (payload) => request('/messages', { method: 'POST', body: payload }),
  signup: async (payload) => {
    // You may need to update this to match your backend's signup endpoint
    return request('/auth/register', { method: 'POST', body: payload });
  },
  login: async ({ email, password }) => {
    // Updated to match backend contract
    return request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },
};
