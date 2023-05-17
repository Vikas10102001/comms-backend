const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const socketServer= require('./socketServer')
let con = process.env.DATABASE_CONNECTION;
con = con.replace("<password>", process.env.DATABASE_PASSWORD);
try {
  mongoose.set("strictQuery", true);
  mongoose.connect(con).then(() => {
    console.log("DB connection successfull");
  });
} catch (er) {
  console.log(er);
}
const port = process.env.PORT || 8080;
const server=app.listen(port, () => {
  console.log(`Listening on port on ${port}`);
});
socketServer(server)
module.exports=server