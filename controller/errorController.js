const errorController = (er, req, res, next) => {
  console.log(er);
  res.status(500).json({
    status: "error",
    error: er.message,
  });
};

module.exports = errorController;
