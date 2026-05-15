const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function comparePhones(input: object) {
  const res = await fetch(`${BASE}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Compare failed');
  return res.json();
}

export async function getBestDeals() {
  const res = await fetch(`${BASE}/api/compare/best-deals`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
}

export async function getPhones(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${BASE}/api/phones${qs}`);
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error('Signup failed');
  return res.json();
}

export async function createAlert(alert: object, token: string) {
  const res = await fetch(`${BASE}/api/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(alert),
  });
  return res.json();
}
