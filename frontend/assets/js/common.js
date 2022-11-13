const BACKEND_URL = "https://young-headland-78518.herokuapp.com";

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

async function getImageURI(image) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      res(target.result);
    };
    reader.onerror = () => {
      rej();
    };
    reader.readAsDataURL(image);
  });
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
