const container = document.querySelector(".container");

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
  } else if (res.data.type === "Customer") {
    window.location.replace("home.html");
  } else {
    container.innerHTML = `
      <div class="sub-container-1">
        <a class="btn btn-outlined btn-icon" href="/frontend/home.html?tab=orders"><</a>
      </div>
      <div class="sub-container-2">
        <input type="text" name="name" placeholder="Name" autofocus />
        <textarea
          rows="8"
          placeholder="Something about your event..."
        ></textarea>
        <div class="radio-container">
          <div class="radio">
            <input
              type="radio"
              id="online"
              name="type"
              value="online"
              checked
            />
            <label for="online">Online</label>
          </div>
          <div class="radio">
            <input type="radio" id="offline" name="type" value="offline" />
            <label for="offline">Offline</label>
          </div>
        </div>
        <div class="sub-container-21">
          <input
            type="number"
            name="min_price"
            placeholder="Minimum Price (₹)"
            autofocus
            style="margin-right: 10px; width: 40%"
          />
          <input
            type="number"
            name="max_price"
            placeholder="Maximum Price (₹)"
            autofocus
            style="width: 40%"
          />
        </div>
        <div class="sub-container-22">
          <div class="sub-container-221">
            <input type="text" placeholder="State" style="width: 30%" />
            <input type="text" placeholder="Country" style="width: 30%" />
            <button class="btn btn-outlined add-btn btn-icon">+</button>
          </div>
        </div>
        <button class="btn btn-filled create-btn">Create</button>
      </div>
    `;
  }

  const subContainer4 = document.querySelector(".sub-container-22");
  const btnCreate = document.querySelector(".create-btn");
  const btnAdd = document.querySelector(".add-btn");

  btnAdd.addEventListener("click", () => {
    const div = document.createElement("div");
    div.setAttribute("class", "sub-container-221");
    div.innerHTML = `
      <input type="text" placeholder="State" style="width: 30%" />
      <input type="text" placeholder="Country" style="width: 30%" />
    `;
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "-";
    deleteBtn.setAttribute("class", "btn btn-outlined delete-btn btn-icon");
    deleteBtn.onclick = () => div.remove();
    div.appendChild(deleteBtn);

    subContainer4.appendChild(div);
    div.children[0].select();
    div.scrollIntoView({ behavior: "smooth" });
  });

  btnCreate.addEventListener("click", () => {
    const body = {
      name: document.querySelector("input[name='name']").value,
      description: document.querySelector("textarea").value,
      type: document.querySelector("input[name='type']:checked").value,
      min_price: document.querySelector("input[name='min_price']").value,
      max_price: document.querySelector("input[name='max_price']").value,
      states: Array.from(document.querySelectorAll(".sub-container-221")).map(
        (sc5) => {
          return `${sc5.children[0].value}, ${sc5.children[1].value}`;
        }
      ),
    };
    simpleFetch("/event", "POST", body).then((res) => {
      if (res.status === "SUCCESS") {
        window.location.href = "/frontend/home.html" + "?type=" + res.data.type;
      }
    });
  });
};
