const { models } = require("../../sequelize");
const AppError = require("../../utils/appError");
const { Request } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");
const sendHTMLEmail = require("../../utils/sendHTMLEmail");

const { validateRequest } = require("../../utils/validate");
const nodemailer=require("nodemailer")
module.exports = {
  createRequest: catchAsync(async (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    const request = await Request.create({
      firstName,
      lastName:"?",
      email,
      message,
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
          user: 'mailsendergeekspace@gmail.com',
          pass: 'vidiruegloavrcko',
      },
  });
  const mailOptions = {
      from: 'mailsendergeekspace@gmail.com',
      to: 'rustamsadatov0@gmail.com',
      subject: 'Biri "Carpet" administratsiýasy bilen habarlaşmak isleýär',
      text: `ADY: ${firstName},\nEMAIL: ${email},\n HATY: ${message}`,
  };
  await transporter.sendMail(mailOptions);
    return res.send({
      status: "success",
      code: 200,
      data: request,
    });
  }),

  getRequests: catchAsync(async (req, res) => {
    const { offset, limit } = req.query;

    const { rows, count } = await Request.findAndCountAll({
      limit,
      offset,
      subQuery: false,
    });

    return res.send({
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        requests: rows,
        count,
      },
    });
  }),
  getOneRequest: catchAsync(async (req, res,next) => {
    const { id } = req.params;

    const request = await Request.findOne({ where: { id } });

    if (!request) {
      return next(new AppError("Request not found",404))
    }

    return res.send({
      status: "success",
      request
    });
  }),
  deleteRequest: catchAsync(async (req, res) => {
    const { id } = req.params;

    const request = await Request.findOne({ where: { id } });

    if (!request) {
      throw new Error(`Couldn't find request with id ${id}`);
    }

    await Request.destroy({ where: { id } });

    return res.send({
      status: "success",
      message: `Successfully deleted request with id ${id}`,
    });
  }),
};
