const generateFileId = require("./generateFileId");
const getFileExtension = require("./getFileExtension");

module.exports = (prefix, { originalname }) => {
  return `${prefix}-${generateFileId()}.${getFileExtension(originalname)}`;
};
