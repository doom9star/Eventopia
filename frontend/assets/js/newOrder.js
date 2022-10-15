const container = document.querySelector(".container");
const params = new URLSearchParams(window.location.search);

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
  } else if (res.data.type === "Planner") {
    window.location.replace("home.html?tab=events");
  } else {
    const event = await simpleFetch("/event/" + params.get("id"), "GET");
    container.innerHTML = `
      <div class="sub-container-1">
        <a class="btn btn-outlined btn-icon" href="javascript:history.back()"><</a>
      </div>
      <div class="sub-container-2">
        <img src="./assets/images/noThumbnail.png" alt="Event-Thumbnail" />
        <div class="sub-container-21">
          <span>${event.data.name}</span>
          <span>@${event.data.planner.name}</span>
        </div>
      </div>
      <div class="sub-container-3">
        <input type="text" placeholder="Address" name="address" autofocus />
        <input type="number" name="contact" placeholder="Contact Number" />
        <div class="sub-container-31">
          <div>
            <input type="date" name="date" id="date" />
            <label for="date">Date</label>
          </div>
          <div>
            <label for="state">State</label>
            <select id="state">
				${event.data.states.map((s) => `<option>${s}</option>`)}
            </select>
          </div>
        </div>
        <div class="sub-container-32">
          <div>
            <input type="time" name="start_time" id="start_time" />
            <label for="start_time">Start</label>
          </div>
          <div>
            <label for="end_time">End</label>
            <input type="time" name="end_time" id="end_time" />
          </div>
        </div>
        <div class="sub-container-34">
          <label for="expiry_date">Expiry</label>
          <input type="date" name="expiry_date" id="expiry_date" />
        </div>
        <div class="sub-container-33">
          <input type="text" placeholder="Search Guests..." name="search"/>
		  <div class="search-results-container"></div>
          <div class="guests-container"></div>
        </div>
        <div class="radio-container">
          <div class="radio">
            <input type="radio" id="yes" name="invite" value="Yes"/>
            <label for="yes">Yes</label>
          </div>
          <span style="font-size: 12px">Invite</span>
          <div class="radio">
            <input type="radio" id="no" name="invite" value="No" checked/>
            <label for="no">No</label>
          </div>
        </div>
        <textarea rows="8" placeholder="Extra Information..."></textarea>
        <button class="btn btn-filled">Order</button>
      </div>
	`;

    const searchBox = document.querySelector("input[name='search']");
    const searchResultsContainer = document.querySelector(
      ".search-results-container"
    );
    const guestsContainer = document.querySelector(".guests-container");

    let guests = [];
    function addGuest(e) {
      const guest = JSON.parse(e.dataset.info);
      guests.push(guest);

      searchResultsContainer.style.display = "none";

      const guestContainer = document.createElement("div");
      guestContainer.setAttribute("data-id", guest._id);
      guestContainer.innerHTML = `
        <img src="./assets/images/noProfile.jpg" alt="Guest-Profile" />
        <span>@${guest.name}</span>
        <span>x</span>
	  `;
      guestContainer.lastElementChild.addEventListener("click", () =>
        removeGuest(guest._id)
      );
      guestsContainer.appendChild(guestContainer);

      if (guests.length === 1) guestsContainer.style.display = "grid";
      searchBox.value = "";
      searchBox.focus();
    }

    function removeGuest(gid) {
      guests = guests.filter((g) => g._id !== gid);
      document.querySelector(`[data-id='${gid}']`).remove();
      if (guests.length === 0) {
        guestsContainer.style.display = "none";
      }
    }

    searchBox.addEventListener("input", async () => {
      const query = searchBox.value.trim();
      if (query.length > 1) {
        const search_res = await simpleFetch("/user/search/" + query, "GET");
        if (search_res.data.length > 0) {
          searchResultsContainer.innerHTML = search_res.data
            .map(
              (g) => `
		  	<div data-info='${JSON.stringify(g)}'>
              <img src="./assets/images/noProfile.jpg" alt="Guest-Profile" />
              <span>@${g.name}</span>
			</div>
		`
            )
            .join("");
          searchResultsContainer.childNodes.forEach((c) =>
            c.addEventListener("click", () => addGuest(c))
          );
          searchResultsContainer.style.display = "block";
        } else {
          searchResultsContainer.style.display = "none";
        }
      } else {
        searchResultsContainer.style.display = "none";
      }
    });

    document.querySelector("button").addEventListener("click", () => {
      const body = {
        planner: event.data.planner._id,
        event: event.data._id,
        guests: guests.map((g) => g._id),
        date: document.querySelector("input[name='date']").value,
        time: `${
          document.querySelector("input[name='start_time']").value
        } &nbsp;-&nbsp; ${
          document.querySelector("input[name='end_time']").value
        }`,
        address: `${
          document.querySelector("input[name='address']").value
        } &nbsp;|&nbsp; ${document.querySelector("select").value}`,
        contact: document.querySelector("input[name='contact']").value,
        info: document.querySelector("textarea").value,
        invite:
          document.querySelector("input[name='invite']").value === "Yes"
            ? "Pending"
            : "Refused",
        expiry_date: document.querySelector("input[name='expiry_date']").value,
      };
      simpleFetch("/order", "POST", body).then((data) => {
        if (data.status === "SUCCESS") {
          window.location.href = "home.html?tab=orders";
        }
      });
    });
  }
};
