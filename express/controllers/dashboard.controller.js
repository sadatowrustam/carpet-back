const { Op } = require("sequelize");
const { models } = require("../../sequelize");
const { Carpet, Order, BlogVideo, GalleryImage, Banner, Admin } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

const parseQuery = ({ from, to }) => {
  if (from === "null" || !from) return { from: null, to: null };

  from = new Date(from);

  if (to === "null" || !to) {
    to = new Date(Date.now());
  } else {
    to = new Date(to);
  }

  return { from, to };
};

const returnDataOfPeriod = async (from, to) => {
  let where;

  if (from) {
    where = {
      createdAt: {
        [Op.between]: [from, to],
      },
    };
  }

  return [
    {
      name: "carpets._",
      count: await Carpet.count({ where }),
      from: from.toLocaleDateString(),
      to: to.toLocaleDateString(),
    },
    {
      name: "orders",
      count: await Order.count({ where }),
      from: from.toLocaleDateString(),
      to: to.toLocaleDateString(),
    },
    {
      name: "blog",
      count: await BlogVideo.count({ where }),
      from: from.toLocaleDateString(),
      to: to.toLocaleDateString(),
    },
    {
      name: "gallery.images",
      count: await GalleryImage.count({ where }),
      from: from.toLocaleDateString(),
      to: to.toLocaleDateString(),
    },
    {
      name: "banners",
      count: await Banner.count({ where }),
      from: from.toLocaleDateString(),
      to: to.toLocaleDateString(),
    },
    {
      name: "moderators",
      count: await Admin.count({ where }),
      from: from.toLocaleDateString(),
      to: to.toLocaleDateString(),
    },
  ];
};

const returnCountDataOfPeriod = async (from, to) => {
  let where;

  if (from) {
    where = {
      createdAt: {
        [Op.between]: [from, to],
      },
    };
  }

  return [
    {
      name: "carpets._",
      count: await Carpet.count({ where }),
      icon: ["fas", "layer-group"],
    },
    {
      name: "orders",
      count: await Order.count({ where }),
      icon: ["fas", "shopping-cart"],
    },
    {
      name: "blog",
      count: await BlogVideo.count({ where }),
      icon: ["fas", "video"],
    },
    {
      name: "gallery.images",
      count: await GalleryImage.count({ where }),
      icon: ["fas", "images"],
    },
    {
      name: "banners",
      count: await Banner.count({ where }),
      icon: ["fas", "ad"],
    },
    {
      name: "moderators",
      count: await Admin.count({ where }),
      icon: ["fas", "users-cog"],
    },
  ];
};

module.exports = {
  getAllInfo: catchAsync(async (req, res) => {
    let { from, to } = await parseQuery(req.query);

    const counts = await returnCountDataOfPeriod(from, to);

    const { days } = req.query;
    const history = [];

    if (days) {
      const dayOffset = 24 * 60 * 60 * 1000;
      let fromDate = new Date();
      let toDate = new Date();

      fromDate.setTime(fromDate.getTime() - dayOffset * days);
      toDate.setTime(fromDate.getTime() + dayOffset);

      for (let i = parseInt(days); i > 0; i--) {
        const data = await returnDataOfPeriod(fromDate, toDate);
        history.push(data);
        fromDate.setTime(fromDate.getTime() + dayOffset);
        toDate.setTime(fromDate.getTime() + dayOffset);
      }
    }

    response(res, {
      code: 200,
      status: "success",
      dataName: "data",
      data: {
        counts,
        history,
      },
    });
  }),
};
