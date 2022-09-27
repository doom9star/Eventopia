const mainContainer = document.querySelector(".container");

window.onload = async () => {
  const data = await getUser();
  if (data.status === "SUCCESS") {
    window.location.replace("/frontend/home.html" + "?type=" + data.data.type);
  } else {
    mainContainer.innerHTML = `
      <div class="sub-container">
        <a href="/frontend/index.html"><img src="./assets/images/logo.png" alt="Eventopia-Logo" /></a>
        <input type="text" placeholder="Name" autofocus />
        <div class="radio-container">
          <div class="radio">
            <input
              type="radio"
              id="customer"
              name="type"
              value="customer"
              checked
            />
            <label for="customer">Customer</label>
          </div>
          <div class="radio">
            <input type="radio" id="planner" name="type" value="planner" />
            <label for="planner">Planner</label>
          </div>
        </div>
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button class="btn btn-filled">Register</button>
      </div>
    `;
  }

  const btnRegister = document.querySelector("button");

  btnRegister.addEventListener("click", () => {
    simpleFetch("/auth/register", "POST", {
      name: document.querySelector('input[type="text"]').value,
      password: document.querySelector('input[type="password"]').value,
      type: document.querySelector('input[name="type"]:checked').value,
    }).then((data) => {
      if (data.status === "SUCCESS") {
        window.location.replace(
          "/frontend/home.html" + "?type=" + data.data.type
        );
      }
    });
  });
};
