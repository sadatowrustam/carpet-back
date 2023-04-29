const {
  isAlphanumeric,
  isLength,
  isEmpty,
  isInt,
  isEmail,
} = require("validator");

const { models } = require("../sequelize");
const { Size, Color, Material } = models;
const AppError=require("./appError")
module.exports = {
  validateAdmin: (username, password) => {
    if (!username) {
      throw new Error("No username provided");
    }

    if (!password) {
      throw new Error("No password provided");
    }

    if (!isAlphanumeric(username)) {
      throw new Error("Username must be alphanumeric");
    }

    if (!isLength(username, { min: 3, max: 25 })) {
      throw new Error("Username's length must be between 3 and 25 chars");
    }

    if (!isLength(password, { min: 6, max: 25 })) {
      throw new Error("Password's length must be between 6 and 25 chars");
    }
  },

  validateColor: async (name, hex,next) => {
    const HEXRegex = new RegExp(/^#[0-9a-f]{3,6}$/i);

    if (!name || isEmpty(name)) {
      return next(new AppError("Name is required",400))
    }

    if (!hex || isEmpty(hex)) {
      return next(new AppError("Hex is required",400))
    }

    if (!hex.match(HEXRegex)) {
      return next(new AppError("Must be Hex fornat",400))

    }

    const existingColorName = await Color.findOne({ where: { name } });
    if (existingColorName) {
      return next(new AppError("Existing color name",400))
    }

    const existingColorHex = await Color.findOne({ where: { hex } });
    if (existingColorHex) {
      return next(new AppError("Existing hex",400))
    }
  },

  validateSize: async (width, height,next) => {
    width = width.toString();
    height = height.toString();

    if (!width || isEmpty(width)) {
      return next(new AppError("Width is required",400))
    }

    if (!height || isEmpty(height)) {
      return next(new AppError("Height is required",400))
    }

    if (!isInt(width)) {
      return next(new AppError("Width value type must be integer",400))
    }

    if (!isInt(height)) {
      return next(new AppError("Height value type must be integer",400))
    }

    const existingSize = await Size.findOne({
      where: {
        width: width,
        height: height,
      },
    });

    if (existingSize) {
      return next(new AppError("Existing",400))

    }
  },

  validateMaterial: async (name,next) => {
    if (!name || isEmpty(name)) {
      return next(new AppError("Name is required"))
    }

    const existingMaterial = await Material.findOne({ where: { name } });

    if (existingMaterial) {
      return next(new AppError("Duplicate material"))
    }
  },

  validateOrder: (firstName, lastName, phoneNumber, email, country) => {
    if (isEmpty(firstName)) {
      throw new Error("First name is required");
    }

    if (isEmpty(lastName)) {
      throw new Error("Last name is required");
    }

    if (isEmpty(phoneNumber)) {
      throw new Error("Phone number is required");
    }

    if (isEmpty(email)) {
      throw new Error("Phone number is required");
    } else if (!isEmail(email)) {
      throw new Error("Email is invalid");
    }

    if (isEmpty(country)) {
      throw new Error("Country required");
    }
  },

  validateRequest: (firstName, lastName, email, message) => {
    if (isEmpty(firstName)) {
      throw new Error("No first name provided");
    }

    if (isEmpty(lastName)) {
      throw new Error("No last name provided");
    }

    if (isEmpty(email)) {
      throw new Error("No email provided");
    } else if (!isEmail(email)) {
      throw new Error("Email format is invalid");
    }

    if (isEmpty(message)) {
      throw new Error("No message provided");
    }
  },
};
