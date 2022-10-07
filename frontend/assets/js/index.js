const subContainer2 = document.querySelector(".sub-container-2");

window.onload = async () => {
  const data = await getUser();
  if (data.status === "SUCCESS") {
    subContainer2.innerHTML = `
    <a class="btn btn-filled home-btn" href="home.html?tab=${
      data.data.type === "Customer" ? "events" : "orders"
    }">Home</a>
	`;
  } else {
    subContainer2.innerHTML = `
    <a class="btn btn-outlined login-btn" href="login.html">Login</a>
    <a class="btn btn-filled register-btn" href="register.html">Register</a>
	`;
  }
};
