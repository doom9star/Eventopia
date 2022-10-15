const BACKEND_URL = "http://localhost:5000";

function alertError(message) {
  if (document.querySelector(".error-container")) {
    document.querySelector(".error-container").innerHTML = `
      <span>${message}</span>
      <span style="cursor:pointer">x</span>
    `;
  } else {
    const alertBox = document.createElement("div");
    alertBox.setAttribute("class", "error-container");
    alertBox.innerHTML = `
    <span>${message}</span>
    <span style="cursor:pointer">x</span>
  `;
    alertBox.lastElementChild.addEventListener("click", () => {
      alertBox.remove();
    });
    document.body.prepend(alertBox);
  }
}

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
