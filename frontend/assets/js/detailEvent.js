const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
  } else {
    const event = await simpleFetch("/event/" + params.get("id"), "GET");

    container.innerHTML = `
      <div class="sub-container-1">
        <a
          class="btn btn-outlined btn-icon"
          href="javascript:history.back()"
          ><</a
        >
      </div>
      <div class="sub-container-2">
        <div class="sub-container-21">
          <img src=${
            event.data.thumbnail
              ? event.data.thumbnail
              : "./assets/images/noThumbnail.png"
          } alt="Event-Thumbnail" />
        </div>
        <div class="sub-container-22">
          <div class="sub-container-221">
            <span class="event-name">${event.data.name}</span>
            <span class="event-type">${event.data.type}</span>
          </div>
          <span class="event-planner-name">@${event.data.planner.name}</span>
          <span class="event-description">${event.data.description}</span
          >
          <div class="sub-container-222">
            ${event.data.states.map((s) => `<span>${s}</span>`).join("")}
          </div>
          <div class="sub-container-223">
            <span class="event-price">₹ ${event.data.price.toLocaleString()}</span>
            ${
              res.data.type === `Customer`
                ? `<a class="btn btn-filled" href="newOrder.html?id=${event.data._id}">Order</a>`
                : ``
            }
          </div>
        </div>
      </div>
    `;
  }
};
