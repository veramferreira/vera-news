exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request: invalid data type!" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "username not found!" });
  } else {
    next(err);
  }
};

exports.otherErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
