const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const data = await getUser();
  if (data.status === "ERROR") {
    window.location.replace("login.html");
    return;
  }

  const header = `
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
  `;

  const events = data.data.events
    .map(
      (e) =>
        `
          <a class="event-container" href="detailEvent.html?id=${e._id}">
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
          </a>
        `
    )
    .join("");

  const tab = params.get("tab");

  const orders = data.data.orders
    .map(
      (o) =>
        `
      <a class="order-container" href="${
        data.data.type === "Planner"
          ? `detailOrder.html?id=${o._id}`
          : "javascript:;"
      }">
            <div class="order-sub-container">
              <img
                src="./assets/images/noThumbnail.png"
                alt="Order-Thumbnail"
                class="order-event-thumbnail"
              />
              <span class="order-event-name">${o.event.name}</span>
            </div>
            <span class="order-customer">@${
              typeof o.customer === "object" ? o.customer.name : o.planner.name
            }</span>
            <span class="order-timestamp">${new Date(
              o.createdAt
            ).toLocaleDateString()} <span style="font-size: 20px;"> | </span> ${new Date(
          o.createdAt
        ).toLocaleTimeString()}</span>
            <span class="order-id">${o._id}</span>
            <span class="order-status order-${o.status.toLowerCase()}">${
          o.status
        }</span>
      </a>
     `
    )
    .join("");

  container.innerHTML = `
      ${header}
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
              tab === "events" && "active-tab"
            }" href="/frontend/home.html?tab=events"
              >Events</a
            >
          </div>
          ${
            data.data.type === "Planner"
              ? `
          <a class="btn btn-filled" href="/frontend/newEvent.html"
            >+ New Event</a
          >
            `
              : ""
          }
        </div>

        <div class="sub-container-orders">
          ${tab === "orders" ? orders : ""}
        </div>

        <div class="sub-container-events">
          ${tab === "events" ? events : ""}
        </div>
      </div>
    `;

  const btnLogout = document.querySelector(".logout-btn");
  btnLogout.addEventListener("click", () => {
    simpleFetch("/auth/logout", "DELETE").then((data) => {
      if (data.status === "SUCCESS") {
        window.location.replace("index.html");
      }
    });
  });
};
