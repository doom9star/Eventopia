const dotenv = require("dotenv");
const path = require("path");
const app = require("./app");

dotenv.config({ path: path.join(__dirname, "../.env") });

app.listen(process.env.PORT, () => {
  console.log(`server has started running!`);
});
