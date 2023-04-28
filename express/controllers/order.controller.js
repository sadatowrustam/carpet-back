const { models } = require("../../sequelize");
const { Order, CarpetOrder, Carpet } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");
const sendHTMLEmail = require("../../utils/sendHTMLEmail");

const { validateOrder } = require("../../utils/validate");

module.exports = {
  createOrder: catchAsync(async (req, res) => {
    const fullUrl = req.protocol + "://" + req.get("host");

    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      country,
      city,
      address,
      comment,
      carpets,
      paymentType,
      deliveryType,
    } = req.body;

    await validateOrder(
      firstName,
      lastName,
      phoneNumber,
      email,
      country,
      city,
      address,
      comment,
      paymentType,
      deliveryType
    );

    const newOrder = await Order.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      city,
      address,
      comment,
      paymentType,
      deliveryType,
    });

    for (let i = 0; i < carpets.length; i++) {
      await CarpetOrder.create({
        orderId: newOrder.id,
        carpetId: carpets[i].id,
        count: carpets[i].count,
      });
    }

    const order = await Order.findOne({ where: { id: newOrder.id } });
    order.baseURL = fullUrl;

    const attachments = [];

    order.carpets.forEach((carpet) => {
      for (let i = 0; i < carpet.images.length; i++) {
        attachments.push({
          filename: `image-${i}.png`,
          path: `${fullUrl}${carpet.images[i].url}`,
          cid: `image-${i}`,
        });
      }
    });

    sendHTMLEmail(
      "./templates/order.html",
      order,
      `Order [${order.id}] from turkmencarpets.kz`,
      "maryam@marusgroup.kz",
      attachments
    );

    response(res, {
      status: "success",
      code: 200,
      dataName: "order",
      data: order,
      message: "Successfully created order",
    });
  }),

  getOrders: catchAsync(async (req, res) => {
    const { limit, offset } = req.query;

    const { rows, count } = await Order.findAndCountAll({
      limit,
      offset,
      subQuery: false,
    });

    response(res, {
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        orders: rows,
        count,
      },
    });
  }),

  getOrderById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id } });

    if (!order) {
      throw new Error(`Couldn't find order with id ${id}`);
    }

    response(res, {
      status: "success",
      code: 200,
      dataName: "order",
      data: order,
    });
  }),

  changeOrderById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const { status } = req.body;

    const statuses = ["pending", "accepted", "rejected"];
    if (!statuses.includes(status)) {
      throw new Error(`Invalid status type. Can be ${statuses}`);
    }

    const order = await Order.findOne({ where: { id } });

    if (!order) {
      throw new Error(`Couldn't find order with id ${id}`);
    }

    await Order.update({ status }, { where: { id } });

    response(res, {
      status: "success",
      code: 200,
      message: `Successfully changed status of order with id ${id} to ${status}`,
    });
  }),

  deleteOrder: catchAsync(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id } });

    if (!order) {
      throw new Error(`Couldn't find order with id ${id}`);
    }

    await Order.destroy({ where: { id } });

    response(res, {
      status: "success",
      code: 200,
      message: `Successfully deleted order with id ${id}`,
    });
  }),
};
