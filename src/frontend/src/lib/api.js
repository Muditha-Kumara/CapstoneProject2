const BASE_URL = import.meta.env.VITE_API_URL || '';

let accessToken = null;

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
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

export function setApiAccessToken(token) {
  accessToken = token;
}

export const api = {
  contact: (payload) =>
    request('/messages', { method: 'POST', body: payload, auth: true }),
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
  refresh: async () => {
    // Calls backend to refresh access token using httpOnly cookie
    const result = await request('/auth/refresh-token', { method: 'POST' });
    if (result && result.accessToken) {
      setApiAccessToken(result.accessToken);
    }
    return result;
  },
  logout: async () => {
    // Calls backend to clear refresh token cookie
    await request('/auth/logout', { method: 'POST' });
    setApiAccessToken(null);
  },
  createFoodRequest: async (payload) => {
    return request('/requests', { method: 'POST', body: payload });
  },
  getRequestsByUser: async ({ userId, limit = 20 }) => {
    const params = new URLSearchParams({ userId, limit });
    return request(`/requests?${params.toString()}`, { method: 'GET' });
  },
  // Donor endpoints
  getDonorStats: async () => {
    return request('/donor/stats', { method: 'GET', auth: true });
  },
  getTransactionHistory: async ({ limit = 20, offset = 0 } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    return request(`/donor/transactions?${params.toString()}`, {
      method: 'GET',
      auth: true,
    });
  },
  getDeliveredDonations: async ({ limit = 20, offset = 0 } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    return request(`/donor/deliveries?${params.toString()}`, {
      method: 'GET',
      auth: true,
    });
  },
  getDonorFeedback: async ({ limit = 10 } = {}) => {
    const params = new URLSearchParams({ limit });
    return request(`/donor/feedback?${params.toString()}`, {
      method: 'GET',
      auth: true,
    });
  },
  getDonorBalance: async () => {
    return request('/donor/balance', { method: 'GET', auth: true });
  },
  processDonation: async (payload) => {
    return request('/donor/donate', {
      method: 'POST',
      body: payload,
      auth: true,
    });
  },
  // Provider endpoints
  getAvailableRequests: async ({ limit = 20, offset = 0 } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    return request(`/provider/requests?${params.toString()}`, {
      method: 'GET',
      auth: true,
    });
  },
  getProviderOrders: async ({ limit = 20, offset = 0, status } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    if (status) params.append('status', status);
    return request(`/provider/orders?${params.toString()}`, {
      method: 'GET',
      auth: true,
    });
  },
  getProviderStats: async () => {
    return request('/provider/stats', { method: 'GET', auth: true });
  },
  acceptRequest: async (payload) => {
    return request('/provider/accept', {
      method: 'POST',
      body: payload,
      auth: true,
    });
  },
  updateOrderStatus: async (payload) => {
    return request('/provider/order/status', {
      method: 'PUT',
      body: payload,
      auth: true,
    });
  },
  cancelOrder: async (payload) => {
    return request('/provider/order/cancel', {
      method: 'POST',
      body: payload,
      auth: true,
    });
  },
  // Add other authenticated endpoints here
};
