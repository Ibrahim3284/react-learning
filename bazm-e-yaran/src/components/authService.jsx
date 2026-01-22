export async function login(username, password) {
  const res = await fetch("http://localhost:8086/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken;
}