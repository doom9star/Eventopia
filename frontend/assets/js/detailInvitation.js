const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
  } else {
    const invitation = await simpleFetch(
      "/invitation/" + params.get("id"),
      "GET"
    );
    container.innerHTML = `
      <div class="sub-container-1">
        <a class="btn btn-outlined btn-icon" href="javascript:history.back()"
          ><</a
        >
      </div>
      <div class="sub-container-2">
        <div class="sub-container-21">
          <span class="invitation-title">⚙| &nbsp;${
            invitation.data.event.name
          }</span>
          <span class="invitation-inviter">@${
            invitation.data.inviter.name
          }</span>
        </div>
        <img
          src="./assets/images/noThumbnail.png"
          alt="Invitation-Thumbnail"
          class="invitation-thumbnail"
        />
        <div class="sub-container-22">
          <span>${invitation.data.date}</span>
          <span>${invitation.data.time}</span>
        </div>
        <span class="invitation-state">${
          invitation.data.address.split("|")[1]
        }</span>
        <span class="invitation-address">${
          invitation.data.address.split("|")[0]
        }</span
        >
        <span class="invitation-description">${
          invitation.data.description
        }</span
        >
      </div>
      <div style="padding-top: 32px"></div>
	`;
  }
};
