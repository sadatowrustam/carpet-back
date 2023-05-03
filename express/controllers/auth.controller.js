const { models } = require("../../sequelize");
const { Admin } = models;
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");

module.exports = {
  adminMiddleware: catchAsync(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.send({
        code: 401,
        message: "Unauthorized",
      });
    }
    const admin = await jwt.verify(token, "rustam");

    if (admin) {
      const adminInDatabase = await Admin.findOne({
        where: {
          username: admin.username,
        },
      });

      if (!adminInDatabase) {
        console.log(30)
        return res.send({
          status: "Unauthorized",
          code: 401,
          message: "This account has been deleted",
        });
      }

      req.admin = { username: admin.username };
      next();
    } else
      res.send({
        code: 401,
        message: "Token has expired, login again",
      });
  }),
};
