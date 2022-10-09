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

    container.innerHTML = `
      <div class="sub-container-1">
        <a
          class="btn btn-outlined btn-icon"
          href="/frontend/home.html?tab=orders"
          ><</a
        >
      </div>
      <div class="sub-container-2">
        <div class="sub-container-21">
          <div class="sub-container-211">
            <span class="order-event-name">${order.event.name}</span>
            <span class="order-id">${order._id}</span>
          </div>
          <div class="sub-container-212">
            <span class="status accepted ${
              order.status === "Accepted" && "order-accepted"
            }">Accepted</span>
            <span class="status completed ${
              order.status === "Completed" && "order-completed"
            }">Completed</span>
            <span class="status rejected ${
              order.status === "Rejected" && "order-rejected"
            }">Rejected</span>
          </div>
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
          <span>${new Date(order.date).toLocaleDateString()}</span>
        </div>
        <div class="sub-container-24">
          <span>Time</span>
          <span>${new Date(
            order.start_time
          ).toLocaleTimeString()} &nbsp;-&nbsp; ${new Date(
      order.end_time
    ).toLocaleTimeString()}</span>
        </div>
        <div class="sub-container-25">
          <span>State</span>
          <span>${order.state}</span>
        </div>
        <div class="sub-container-26">
          <span>Place</span>
          <span>${order.place}</span>
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
			${
        order.invite === "Pending"
          ? `
            <button class="btn btn-outlined" style="margin-top: 16px">
              Invite
            </button>
			`
          : order.invite === "Sent"
          ? `
			<span style="font-size: 12px; color: green; font-weight: bold">&check; &nbsp;Invited</span>
			`
          : ""
      }
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

    document.querySelectorAll(".status").forEach((element) => {
      element.addEventListener("click", async () => {
        if (element.innerHTML !== order.status) {
          simpleFetch("/order", "PUT", {
            oid: params.get("id"),
            status: element.innerHTML,
          }).then((res) => {
            if (res.status === "SUCCESS") {
              document
                .querySelector(`.${order.status.toLowerCase()}`)
                .classList.remove(`order-${order.status.toLowerCase()}`);
              element.classList.add(`order-${element.innerHTML.toLowerCase()}`);
              order.status = element.innerHTML;
            }
          });
        }
      });
    });
  }
};
