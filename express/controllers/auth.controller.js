const { models } = require("../../sequelize");
const { Admin } = models;

const response = require("../../utils/response");
const catchAsync = require("../../utils/catchAsync");

const jwt = require("jsonwebtoken");

module.exports = {
  adminMiddleware: catchAsync(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      response(res, {
        code: 401,
        message: "Unauthorized",
      });
    }

    const admin = await jwt.verify(token, process.env.JWT_SECRET);

    if (admin) {
      const adminInDatabase = await Admin.findOne({
        where: {
          username: admin.username,
        },
      });

      if (!adminInDatabase) {
        response(res, {
          status: "Unauthorized",
          code: 401,
          message: "This account has been deleted",
        });
        return;
      }

      req.admin = { username: admin.username };
      next();
    } else
      response(res, {
        code: 401,
        message: "Token has expired, login again",
      });
  }),
};
