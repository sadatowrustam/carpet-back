require("dotenv").config({
  path: "./config/config.env",
});

const express = require("express");
const app = express();

const { cors, corsOptions } = require("./utils/cors");
app.use(cors({
  origin:"*"
}));

const { morgan, morganOptions } = require(`./utils/loggers/morgan-logger`);
app.use(morgan(morganOptions));

const logger = require(`./utils/loggers/winston-logger`);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("./public"));

app.use("/carpets", require("./express/routes/carpet.route"));
app.use("/admins", require("./express/routes/admin.route"));
app.use("/colors", require("./express/routes/color.route"));
app.use("/currencies", require("./express/routes/currency.route"));
app.use("/sizes", require("./express/routes/size.route"));
app.use("/materials", require("./express/routes/material.route"));
app.use("/pages", require("./express/routes/page.route"));
app.use("/filters", require("./express/routes/filters.route"));
app.use("/images", require("./express/routes/image.route"));
app.use("/orders", require("./express/routes/order.route"));
app.use("/requests", require("./express/routes/request.route"));
app.use("/videos", require("./express/routes/video.route"));
app.use("/banners", require("./express/routes/banner.route"));
app.use("/gallery-images", require("./express/routes/gallery-images.route"));
app.use("/blog-videos", require("./express/routes/blog-video.route"));
app.use("/dashboard", require("./express/routes/dashboard.route"));

const catchAsync = require("./utils/catchAsync");
const response = require("./utils/response");

app.use(
  catchAsync((req, res) => {
    response(res, {
      status: "error",
      code: 404,
      message: "Could not find requested resource",
    });
  })
);

const sequelize = require("./sequelize");
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.log({
      level: "info",
      message: "Connected to database",
      label: "success",
    });
  } catch (err) {
    logger.log({
      level: "error",
      message: `Error connection: ${err}`,
      label: "error",
    });
  }
};

const initServer = async () => {
  await connectToDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.log({
      level: "info",
      message: `Listening on port http://localhost:${PORT}`,
      label: "success",
    });
  });
};

try {
  initServer();
} catch (err) {
  logger.log({
    level: "error",
    message: err,
    label: "error",
  });
}
