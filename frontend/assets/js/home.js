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
          <a href="home.html?tab=settings" style="display:flex; align-items:center; text-decoration:none">
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
          </a>
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
              src=${
                e.thumbnail ? e.thumbnail : "./assets/images/noThumbnail.png"
              }
              alt="Event-Thumbnail"
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
                src=${
                  o.event.thumbnail
                    ? o.event.thumbnail
                    : "./assets/images/noThumbnail.png"
                }
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
                      src=${
                        i.event.thumbnail
                          ? i.event.thumbnail
                          : "./assets/images/noThumbnail.png"
                      }
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
                      ? "<span class='order-rejected' style='padding: 2px 8px; border-radius: 100px;'>&ast;</span>"
                      : "<span></span>"
                  }
            </a>
    `
      )
      .join("");
  }

  container.innerHTML = `
      ${header}
      <input type="file" hidden accept="image/*" class="file-input"/>
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
            <a class="tab setting-tab ${
              tab === "settings" && "active-tab"
            }" href="home.html?tab=settings"
              >Settings</a
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
              <div class="invitation-container-header">
                <span>Invitation ID</span>
                <span>Event</span>
                <span>Inviter</span>
                <span>Date/Time</span>
              </div>
            ${invitations}
          `
              : ""
          }
          ${
            tab === "settings"
              ? `
            <div class="sub-container-settings">
              <div>
                <img src=${
                  res.data.avatar
                    ? res.data.avatar
                    : "./assets/images/noProfile.jpg"
                } alt="User-Avatar" class="user-avatar"/>
                <span class="delete-avatar-btn" style="visibility: ${
                  res.data.avatar ? "visible" : "hidden"
                }">x</span>
              </div>
              <input type="text" placeholder="Name" value="${
                res.data.name
              }" autofocus name="settings-name"/>
              <button class="btn btn-outlined save-btn">Save</button>
            </div>
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

  const fileInput = document.querySelector(".file-input");
  const deleteAvatarBtn = document.querySelector(".delete-avatar-btn");
  const userAvatar = document.querySelector(".user-avatar");
  const saveBtn = document.querySelector(".save-btn");

  document.querySelector(".user-avatar").addEventListener("click", () => {
    fileInput.click();
  });
  deleteAvatarBtn.addEventListener("click", () => {
    userAvatar.src = "./assets/images/noProfile.jpg";
    deleteAvatarBtn.style.visibility = "hidden";
  });
  fileInput.addEventListener("change", (e) => {
    getImageURI(e.target.files[0]).then((uri) => {
      userAvatar.src = uri;
      deleteAvatarBtn.style.visibility = "visible";
    });
  });
  saveBtn.addEventListener("click", () => {
    const body = {
      name: document.querySelector("input[name='settings-name']").value.trim(),
      avatar: userAvatar.src,
    };
    if (body.name !== res.data.name || body.avatar !== res.data.avatar) {
      simpleFetch("/user", "PUT", body).then((_res) => {
        if (_res.status === "SUCCESS") {
          window.location.reload();
        }
      });
    }
  });
};
