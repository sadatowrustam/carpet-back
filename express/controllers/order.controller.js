const { models } = require("../../sequelize");
const AppError = require("../../utils/appError");
const { Order, CarpetOrder, Carpet } = models;

const catchAsync = require("../../utils/catchAsync");

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
        sizeId:carpets[i].sizes[carpets[i].sizeActive].id
      });
    }

    const order = await Order.findOne({ where: { id: newOrder.id } });
    res.send({
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
      order:[["createdAt","DESC"]]
    });

    res.send({
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

    return res.send({
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

    res.send({
      status: "success",
      code: 200,
      message: `Successfully changed status of order with id ${id} to ${status}`,
    });
  }),

  deleteOrder: catchAsync(async (req, res,next) => {
    const { id } = req.params;
    console.log(121)
    const order = await Order.findOne({ where: { id } });

    if (!order) {
      return next(new AppError("ORder not found",404));
    }

    await order.destroy({});

    return res.send({
      status: "success",
      code: 200,
      message: `Successfully deleted order with id ${id}`,
    });
  }),
};
