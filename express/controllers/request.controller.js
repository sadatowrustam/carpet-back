const { models } = require("../../sequelize");
const { Request } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");
const sendHTMLEmail = require("../../utils/sendHTMLEmail");

const { validateRequest } = require("../../utils/validate");

module.exports = {
  createRequest: catchAsync(async (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    await validateRequest(firstName, lastName, email, message);

    const request = await Request.create({
      firstName,
      lastName,
      email,
      message,
    });

    sendHTMLEmail(
      "./templates/request.html",
      request,
      `Request [${request.id}] from turkmencarpets.kz`,
      "maryam@marusgroup.kz"
    );

    response(res, {
      status: "success",
      code: 200,
      dataName: "request",
      data: request,
      message: "Your request has successfully sent",
    });
  }),

  getRequests: catchAsync(async (req, res) => {
    const { offset, limit } = req.query;

    const { rows, count } = await Request.findAndCountAll({
      limit,
      offset,
      subQuery: false,
    });

    response(res, {
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        requests: rows,
        count,
      },
    });
  }),

  deleteRequest: catchAsync(async (req, res) => {
    const { id } = req.params;

    const request = await Request.findOne({ where: { id } });

    if (!request) {
      throw new Error(`Couldn't find request with id ${id}`);
    }

    await Request.destroy({ where: { id } });

    response(res, {
      status: "success",
      message: `Successfully deleted request with id ${id}`,
    });
  }),
};
