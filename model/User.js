const Mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = Mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A user must give their username"],
      unique:true,
      max: [30, "Too long username ! Use less than 30 character"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please give your email address"],
      validator: [validator.isEmail, "Enter a valid email address"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Please give your password"],
      select: false,
    },
    friends:[{
      type:Mongoose.Schema.ObjectId,
      ref:"User"
    }]
  },
  {
    timeStamps: true,
  }
);

userSchema.methods.correctPassword = async function (
  userPassword,
  enteredPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12)
  next();
});

const User = Mongoose.model("User", userSchema);

module.exports = User;
