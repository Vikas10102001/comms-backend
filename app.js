const express = require("express");
const cors = require("cors");
const errorController = require("./controller/errorController");
const userRouter=require("./routes/userRoutes")
const friendInvitationRouter=require("./routes/friendInvitaionRoutes")
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/users",userRouter)
app.use("/api/v1/friend-invitations",friendInvitationRouter)
app.use(errorController)
module.exports = app;
