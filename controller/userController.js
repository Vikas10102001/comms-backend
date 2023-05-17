const User = require("../model/User");
const catchAsync = require("../utils/catchAsync");

//getUser
exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});

