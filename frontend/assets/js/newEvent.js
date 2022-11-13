const container = document.querySelector(".container");

window.onload = async () => {
  const res = await getUser();
  if (res.status === "ERROR") {
    window.location.replace("login.html");
  } else if (res.data.type === "Customer") {
    window.location.replace("home.html?tab=events");
  } else {
    container.innerHTML = `
      <div class="sub-container-1">
        <a class="btn btn-outlined btn-icon" href="javascript:history.back()"><</a>
      </div>
      <div class="sub-container-2">
        <input type="file" hidden accept="image/*" class="file-input"/>
        <div class="sub-container-23">
          <button class="btn btn-outlined upload-btn">Upload</button>
        </div>
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
              value="Online"
            />
            <label for="online">Online</label>
          </div>
          <div class="radio">
            <input type="radio" id="offline" name="type" value="Offline" checked/>
            <label for="offline">Offline</label>
          </div>
        </div>
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
        />
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
  const subContainer23 = document.querySelector(".sub-container-23");

  const btnCreate = document.querySelector(".create-btn");
  const btnAdd = document.querySelector(".add-btn");

  const fileInput = document.querySelector(".file-input");

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
      thumbnail: document.querySelector("img")?.src || "",
      description: document.querySelector("textarea").value,
      type: document.querySelector("input[name='type']:checked").value,
      price: parseInt(document.querySelector("input[name='price']").value) || 0,
      states: Array.from(document.querySelectorAll(".sub-container-221")).map(
        (sc5) => {
          return `${sc5.children[0].value}, ${sc5.children[1].value}`;
        }
      ),
    };
    simpleFetch("/event", "POST", body).then((res) => {
      if (res.status === "SUCCESS") {
        window.location.href = "home.html?tab=events";
      } else {
        alertError(res.data.message);
      }
    });
  });

  document.querySelector(".upload-btn").addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    getImageURI(e.target.files[0]).then((uri) => {
      subContainer23.innerHTML = `
        <div class="event-thumbnail-container">
          <img src="${uri}" alt="Event-Thumbnail" />
          <span class="delete-thumbnail-btn">x</span>
        </div>
      `;
      document
        .querySelector(".delete-thumbnail-btn")
        .addEventListener("click", () => {
          subContainer23.innerHTML = `
          <button class="btn btn-outlined upload-btn">Upload</button>
        `;
          document
            .querySelector(".upload-btn")
            .addEventListener("click", () => {
              fileInput.click();
            });
        });
    });
  });
};
