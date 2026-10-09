const BASE_URL = 'https://agendamentos.spaincentral.cloudapp.azure.com/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('access');
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
      return fetch(`${BASE_URL}${path}`, { ...options, headers });
    } else {
      localStorage.clear();
      window.location.href = '/';
      return;
    }
  }

  return response;
}

async function tryRefresh() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return false;
  const res = await fetch(`${BASE_URL}/auth/renovar/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('access', data.access);
    return true;
  }
  return false;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (path, body) =>
    request(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
