window.onload = async () => {
  const data = await getUser();
  if (data.status === "ERROR") {
    window.location.replace("/frontend/login.html");
  } else {
  }
};
