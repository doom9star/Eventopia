const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
    return;
  }
  const tab = params.get("tab");
  let events = [],
    orders = [],
    invitations = [];

  const header = `
      <div class="sub-container-1">
        <img src="./assets/images/logo.png" alt="Eventopia-Logo" class="logo" />
        <div class="sub-container-11">
          <img
            src=${
              res.data.avatar
                ? res.data.avatar
                : "./assets/images/noProfile.jpg"
            }
            alt="Profile-Image"
            class="profile-image"
          />
          <span class="profile-name">@${res.data.name}</span>
          <button class="btn btn-outlined logout-btn">Logout</button>
        </div>
      </div>
  `;

  if (tab === "events") {
    events = await simpleFetch("/event", "GET");
    events = events.data
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
              <span>₹ ${e.price.toLocaleString()}</span>
            </div>
          </a>
        `
      )
      .join("");
  } else if (tab === "orders") {
    orders = await simpleFetch("/order/many/" + res.data.type, "GET");
    orders = orders.data
      .map(
        (o) =>
          `
      <a class="order-container" href="${
        res.data.type === "Planner"
          ? `detailOrder.html?id=${o._id}`
          : "javascript:;"
      }">
            <span class="order-id">${o._id}</span>
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
            <span class="order-status order-${o.status.toLowerCase()}">${
            o.status
          }</span>
      </a>
     `
      )
      .join("");
  } else if (tab === "invitations") {
    invitations = await simpleFetch("/invitation", "GET");
    invitations = invitations.data
      .map(
        (i) =>
          `
            <a class="invitation-container" href="detailInvitation.html?id=${
              i._id
            }">
                  <span class="invitation-id">${i._id}</span>
                  <div class="invitation-sub-container">
                    <img
                      src="./assets/images/noThumbnail.png"
                      alt="Invitation-Thumbnail"
                      class="invitation-event-thumbnail"
                    />
                    <span class="invitation-event-name">${i.event.name}</span>
                  </div>
                  <span class="invitation-sender">@${i.inviter.name}</span>
                  <span class="order-timestamp">${new Date(
                    i.createdAt
                  ).toLocaleDateString()} <span style="font-size: 20px;"> | </span> ${new Date(
            i.createdAt
          ).toLocaleTimeString()}</span>
                  ${
                    !i.read
                      ? "<span class='order-rejected' style='padding: 2px 8px; border-radius: 100px;'>new</span>"
                      : "<span></span>"
                  }
            </a>
    `
      )
      .join("");
  }

  container.innerHTML = `
      ${header}
      <div class="sub-container-2">
        <div class="sub-container-21">
          <div class="sub-container-211">
            <a
              class="tab order-tab ${tab === "orders" && "active-tab"}"
              href="home.html?tab=orders"
              >Orders</a
            >
            <a class="tab event-tab ${
              tab === "events" && "active-tab"
            }" href="home.html?tab=events"
              >Events</a
            >
            <a class="tab invitation-tab ${
              tab === "invitations" && "active-tab"
            }" href="home.html?tab=invitations"
              >Invitations</a
            >
          </div>
          ${
            res.data.type === "Planner"
              ? `
          <a class="btn btn-filled" href="newEvent.html"
            >+ New Event</a
          >
            `
              : ""
          }
        </div>

          ${
            tab === "orders"
              ? `
                  <div class="sub-container-orders">
                    <div class="order-container-header">
                      <span>Order ID</span>
                      <span>Event</span>
                      <span>${
                        res.data.type === "Customer" ? "Planner" : "Customer"
                      }</span>
                      <span>Date/Time</span>
                      <span>Status</span>
                    </div>
                    ${orders}
                  </div>
          `
              : ""
          }

          ${
            tab === "events"
              ? `
        <div class="sub-container-events">
          ${events}
        </div>
          `
              : ""
          }

          ${
            tab === "invitations"
              ? `
                  <div class="sub-container-invitations">
                    <div class="invitation-container-header">
                      <span>Invitation ID</span>
                      <span>Event</span>
                      <span>Inviter</span>
                      <span>Date/Time</span>
                    </div>
                  </div>
                  ${invitations}
          `
              : ""
          }

      </div>
    `;

  const btnLogout = document.querySelector(".logout-btn");
  btnLogout.addEventListener("click", () => {
    simpleFetch("/auth/logout", "DELETE").then((res) => {
      if (res.status === "SUCCESS") {
        window.location.replace("index.html");
      }
    });
  });
};
