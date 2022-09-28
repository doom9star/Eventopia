const btnLogout = document.querySelector(".logout-btn");

window.onload = async () => {
  const data = await getUser();
  if (data.status === "ERROR") {
    window.location.replace("login.html");
  }

  btnLogout.addEventListener("click", () => {
    simpleFetch("/auth/logout", "DELETE").then((data) => {
      if (data.status === "SUCCESS") {
        window.location.replace("index.html");
      }
    });
  });
};

// const params = new URLSearchParams(window.location.search);
