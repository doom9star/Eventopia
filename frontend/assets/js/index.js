const subContainer121 = document.querySelector(".sub-container-121");

window.onload = async () => {
  const res = await getUser();
  if (res.status === "SUCCESS") {
    subContainer121.innerHTML = `
    <a class="btn btn-filled home-btn" href="home.html?tab=${
      res.data.type === "Customer" ? "events" : "orders"
    }">Home</a>
	`;
  } else {
    subContainer121.innerHTML = `
    <a class="btn btn-outlined login-btn" href="login.html">Login</a>
    <a class="btn btn-filled register-btn" href="register.html">Register</a>
	`;
  }
};
