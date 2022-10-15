const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
  } else {
    const { data: order } = await simpleFetch(
      "/order/" + params.get("id"),
      "GET"
    );

    function updateDOMStatus() {
      document.querySelector(".sub-container-212").innerHTML = `
        ${
          ["Ordered", "Seen", "Accepted"].includes(order.status)
            ? `
        <span class="status accepted ${
          order.status === "Accepted" && "order-accepted"
        }" data-name="Accepted">${
                order.status === "Accepted" ? "Accepted" : "Accept"
              }</span>
        `
            : ""
        }
        ${
          ["Accepted", "Completed"].includes(order.status)
            ? `
        <span class="status completed ${
          order.status === "Completed" && "order-completed"
        }" data-name="Completed">Completed</span>
        `
            : ""
        }
        ${
          ["Ordered", "Seen", "Rejected"].includes(order.status)
            ? `
        <span class="status rejected ${
          order.status === "Rejected" && "order-rejected"
        }" data-name="Rejected">${
                order.status === "Rejected" ? "Rejected" : "Reject"
              }</span>
        `
            : ""
        }
  `;
      document.querySelectorAll(".status").forEach((element) => {
        element.addEventListener("click", async () => {
          const status = element.dataset.name;
          if (status !== order.status) {
            simpleFetch("/order/" + params.get("id"), "PUT", {
              status,
            }).then((res) => {
              if (res.status === "SUCCESS") {
                order.status = status;
                updateDOMStatus();
              }
            });
          }
        });
      });

      if (order.invite === "Pending") {
        if (order.status === "Accepted") {
          document.querySelector(".sub-container-291").innerHTML += `
          <button class="btn btn-outlined invite-btn" style="margin-left: 32px">
            Invite
          </button>
        `;
          document
            .querySelector(".invite-btn")
            .addEventListener("click", () => {
              simpleFetch("/invitation", "POST", { oid: order._id }).then(
                (data) => {
                  if (data.status === "SUCCESS") {
                    order.invite = "Sent";
                    updateDOMStatus();
                  }
                }
              );
            });
        }
      } else if (order.invite === "Sent") {
        document.querySelector(".invite-btn")?.remove();
        document.querySelector(
          ".sub-container-291"
        ).innerHTML += `<span style="font-size: 12px; color: green; font-weight: bold">&check; &nbsp;Invited</span>`;
      }
    }

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
          <div class="sub-container-211">
            <span class="order-event-name">${order.event.name}</span>
            <span class="order-id">${order._id}</span>
          </div>
          <div class="sub-container-212"></div>
        </div>
        <div class="sub-container-22">
          <span>Customer</span>
          <div class="user-container" style="width: 150px; margin-right: auto">
            <img src="./assets/images/noProfile.jpg" alt="Customer-Profile" />
            <span>@${order.customer.name}</span>
          </div>
        </div>
        <div class="sub-container-23">
          <span>Date</span>
          <span>${order.date}</span>
        </div>
        <div class="sub-container-24">
          <span>Time</span>
          <span>${order.start_time} &nbsp;-&nbsp; ${order.end_time}</span>
        </div>
        <div class="sub-container-25">
          <span>State</span>
          <span>${order.state}</span>
        </div>
        <div class="sub-container-26">
          <span>Address</span>
          <span>${order.address}</span>
        </div>
        <div class="sub-container-27">
          <span>Contact Number</span>
          <span>${order.contact}</span>
        </div>
        <div class="sub-container-28">
          <span>Guests</span>
          <div class="sub-container-291">
            <div class="sub-container-2911">
              ${order.guests
                .map(
                  (g) =>
                    `
                    <div class="user-container">
                      <img
                      src="./assets/images/noProfile.jpg"
                      alt="Customer-Profile"
                      />
                      <span>@${g.name}</span>
                    </div>
                        `
                )
                .join("")}
            </div>
          </div>
        </div>
		${
      order.info
        ? `
		
        <div class="sub-container-29">
          <span>Information</span>
          <span>${order.info}</span>
        </div>
		`
        : ""
    }
      </div>
	`;

    updateDOMStatus();
  }
};
