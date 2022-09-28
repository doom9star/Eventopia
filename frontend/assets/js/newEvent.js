window.onload = async () => {
  const data = await getUser();
  if (data.status === "ERROR") {
    window.location.replace("login.html");
  } else {
  }
};
