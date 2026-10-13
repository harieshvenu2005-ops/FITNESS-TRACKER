const API_BASE = '/api'; // import.meta.env.DEV ? '/api' : 'http://localhost:4000/api';

let authToken: string | null = localStorage.getItem('auth_token');
export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

function headers() {
  const h: Record<string,string> = { 'Content-Type': 'application/json' };
  if (authToken) {
    h['Authorization'] = `Bearer ${authToken}`;
  }
  return h;
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: headers() });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function post<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
