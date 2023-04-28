module.exports = (res, { status, code, dataName, data, message }) => {
  const response = {
    status,
    code,
    [dataName || "data"]: data,
    message,
  };

  code ? res.status(code).send(response) : res.send(response);
};
