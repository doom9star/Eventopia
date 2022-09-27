const BACKEND_URL = "http://localhost:5000";

async function simpleFetch(path, method, body = {}) {
  return fetch(BACKEND_URL + path, {
    method: method,
    ...(!["GET", "DELETE"].includes(method) && {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    }),
    credentials: "include",
  }).then((res) => res.json());
}

async function getUser() {
  return simpleFetch("/user", "GET");
}
