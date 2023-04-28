const {
  isAlphanumeric,
  isLength,
  isEmpty,
  isInt,
  isEmail,
} = require("validator");

const { models } = require("../sequelize");
const { Size, Color, Material } = models;

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

  validateColor: async (name, hex) => {
    const HEXRegex = new RegExp(/^#[0-9a-f]{3,6}$/i);

    if (!name || isEmpty(name)) {
      throw new Error("Color cannot be without name");
    }

    if (!hex || isEmpty(hex)) {
      throw new Error("Color cannot be without code");
    }

    if (!hex.match(HEXRegex)) {
      throw new Error(
        "Color must be in hexadecimal format (#xxxxxx) or (#xxx)"
      );
    }

    const existingColorName = await Color.findOne({ where: { name } });
    if (existingColorName) {
      throw new Error("Color name duplicate");
    }

    const existingColorHex = await Color.findOne({ where: { hex } });
    if (existingColorHex) {
      throw new Error("Color hex duplicate");
    }
  },

  validateSize: async (width, height) => {
    width = width.toString();
    height = height.toString();

    if (!width || isEmpty(width)) {
      throw new Error("Width is required");
    }

    if (!height || isEmpty(height)) {
      throw new Error("Height is required");
    }

    if (!isInt(width)) {
      throw new Error("Width value type must be integer");
    }

    if (!isInt(height)) {
      throw new Error("Height value type must be integer");
    }

    const existingSize = await Size.findOne({
      where: {
        width: width,
        height: height,
      },
    });

    if (existingSize) {
      throw new Error(`Size duplicate`);
    }
  },

  validateMaterial: async (name) => {
    if (!name || isEmpty(name)) {
      throw new Error("Material name is required");
    }

    const existingMaterial = await Material.findOne({ where: { name } });

    if (existingMaterial) {
      throw new Error("Duplicate material");
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
