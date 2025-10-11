const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body } = {}){
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if(!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export const api = {
  contact: (payload) => request('/messages', { method:'POST', body: payload }),
  signup: async (payload) => {
    const existing = await request(`/users?email=${encodeURIComponent(payload.email)}`);
    if(existing.length) throw new Error('Email already exists');
    return request('/users', { method:'POST', body: payload });
  },
  login: async ({ email, password }) => {
    const found = await request(`/users?email=${encodeURIComponent(email)}`);
    const user = found.find(u => u.password === password);
    if(!user) throw new Error('Invalid credentials');
    return { user };
  }
};
