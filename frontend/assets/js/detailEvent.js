const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
  } else {
    const event = await simpleFetch("/event/" + params.get("id"), "GET");
    const isCustomer = res.data.type === "Customer";

    container.innerHTML = `
      <div class="sub-container-1">
        <a
          class="btn btn-outlined btn-icon"
          href="/frontend/home.html?tab=events"
          ><</a
        >
      </div>
      <div class="sub-container-2">
        <div class="sub-container-21">
          <img src="./assets/images/noThumbnail.png" alt="Event-Thumbnail" />
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
            <span class="event-price">₹ ${event.data.min_price.toLocaleString()} - ₹ ${event.data.max_price.toLocaleString()}</span>
            <button class="btn btn-filled">Order</button>
          </div>
        </div>
      </div>
    `;
  }
};
