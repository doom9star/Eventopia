const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const data = await getUser();
  if (data.status === "ERROR") {
    window.location.replace("login.html");
  } else if (data.data.type === "Planner") {
    const orders = data.data.orders.map(
      (o) =>
        `
        <div class="sub-container-orders">
          <div class="order-container">
            <div class="order-sub-container">
              <img
                src="./assets/images/noThumbnail.png"
                alt="Order-Thumbnail"
                class="order-event-thumbnail"
              />
              <span class="order-event-name">${o.event.name}</span>
            </div>
            <span class="order-customer">@${o.customer.name}</span>
            <span class="order-timestamp">${new Date(
              o.createdAt
            ).toLocaleDateString()} <span style="font-size: 20px;"> | </span> ${new Date(
          o.createdAt
        ).toLocaleTimeString()}</span>
            <span class="order-id">${o._id}</span>
          </div>
        </div>
     `
    );

    const events = data.data.events.map(
      (e) =>
        `
        <div class="sub-container-events">
          <div class="event-container">
            <img
              src="./assets/images/noThumbnail.png"
              alt="Order-Thumbnail"
              class="event-thumbnail"
            />
            <span class="event-name">${e.name}</span>
            <div class="event-sub-container">
              <span class="event-planner-name">@${e.planner.name}</span>
              <span>₹ ${e.min_price.toLocaleString()}</span>
            </div>
          </div>
        </div>
        `
    );

    container.innerHTML = `
      <div class="sub-container-1">
        <img src="./assets/images/logo.png" alt="Eventopia-Logo" class="logo" />
        <div class="sub-container-11">
          <img
            src=${
              data.data.avatar
                ? data.data.avatar
                : "./assets/images/noProfile.jpg"
            }
            alt="Profile-Image"
            class="profile-image"
          />
          <span class="profile-name">@${data.data.name}</span>
          <button class="btn btn-outlined logout-btn">Logout</button>
        </div>
      </div>
      <div class="sub-container-2">
        <div class="sub-container-21">
          <div class="sub-container-211">
            <a
              class="tab order-tab ${
                params.get("tab") === "orders" && "active-tab"
              }"
              href="/frontend/home.html?tab=orders"
              >Orders</a
            >
            <a class="tab event-tab ${
              params.get("tab") === "events" && "active-tab"
            }" href="/frontend/home.html?tab=events"
              >Events</a
            >
          </div>
          <a class="btn btn-filled" href="/frontend/newEvent.html"
            >+ New Event</a
          >
        </div>
        ${params.get("tab") === "orders" ? orders : ""}
        ${params.get("tab") === "events" ? events : ""}
      </div>
    `;
  }

  const btnLogout = document.querySelector(".logout-btn");
  btnLogout.addEventListener("click", () => {
    simpleFetch("/auth/logout", "DELETE").then((data) => {
      if (data.status === "SUCCESS") {
        window.location.replace("index.html");
      }
    });
  });
};
