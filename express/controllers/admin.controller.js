const { models } = require("../../sequelize");
const { Admin, AdminToken } = models;

const catchAsync = require("../../utils/catchAsync");
const { validateAdmin } = require("../../utils/validate");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { machineId } = require("node-machine-id");
const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

const createAdminToken = async (payload) => {
  const JWTExpireDate = "3 days";

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWTExpireDate,
  });
};

const updateAdminTokens = async (admin) => {
  const id = await machineId();
  console.log("update token",id)
  // const tokens = admin.adminTokens;
  const token = await createAdminToken({ username: admin.username });

  // const sameMachineToken = tokens.find((token) => token.machineId === id);

  // if (sameMachineToken) {
  //   await AdminToken.update(
  //     { token },
  //     { where: { machineId: sameMachineToken.machineId } }
  //   );
  // } else {
  //   await AdminToken.create({
  //     token,
  //     machineId: id,
  //     adminId: admin.id,
  //   });
  // }

  return token;
};

const validateUsernameDuplicate = async (username) => {
  const admin = await Admin.findOne({ where: { username } });
  return !!admin;
};

module.exports = {
  getAdmins: catchAsync(async (req, res) => {
    const { limit, offset } = req.query;

    const { rows, count } = await Admin.findAndCountAll({
      where: { role: "moderator" },
      subQuery: false,
      limit,
      offset,
    });

    res.send({
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        moderators: rows,
        count,
      },
    });
  }),

  createAdmin: catchAsync(async (req, res) => {
    const { username, password, permissions } = req.body;

    await validateAdmin(username, password);

    const usernameIsDuplicated = await validateUsernameDuplicate(username);
    if (usernameIsDuplicated) {
      throw new Error(
        "Username is existing in database already. Try another username"
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const moderator = await Admin.create({
      username,
      password: hashedPassword,
      permissions,
    });

    res.send({
      status: "success",
      code: 200,
      dataName: "moderator",
      data: moderator,
      message: "Moderator created successfully",
    });
  }),

  getModeratorById: catchAsync(async (req, res) => {
    const { id } = req.params;

    const moderator = await Admin.findOne({ where: { id } });

    if (!moderator) {
      throw new Error(`Couldn't find moderator with id ${id}`);
    }

    res.send({
      status: "success",
      code: 200,
      dataName: "moderator",
      data: moderator,
    });
  }),

  editModerator: catchAsync(async (req, res) => {
    const { id } = req.params;

    const moderator = await Admin.findOne({ where: { id } });

    if (!moderator) {
      throw new Error(`Couldn't find moderator with id ${id}`);
    }

    const { username, permissions } = req.body;

    const usernameIsDuplicated = await validateUsernameDuplicate(username);
    if (usernameIsDuplicated && username !== moderator.username) {
      throw new Error(
        "Username is existing in database already. Try another username"
      );
    }

    await Admin.update(
      {
        username,
        permissions,
      },
      { where: { id } }
    );

    res.send( {
      status: "success",
      code: 200,
      message: "Moderator updated successfully",
    });
  }),

  login: catchAsync(async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
      throw new Error("Username is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    let admin = await Admin.findOne({
      where: { username },
      include: "adminTokens",
    });

    if (!admin) {
      console.log(170)
      res.send({
        code: 401,
        message: "Username or password is invalid",
      });
    }

    const passwordIsValid = await bcrypt.compare(password, admin.password);

    if (!passwordIsValid) {
      console.log(180)
      res.send({
        code: 401,
        message: "Username or password is invalid",
      });
    }

    const token = await updateAdminTokens(admin);

    admin = await Admin.findOne({
      where: {
        id: admin.id,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    res.send({
      code: 200,
      dataName: "data",
      data: {
        admin,
        token,
      },
      message: "Authenticated successfully",
    });
  }),

  deleteAdmin: catchAsync(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findOne({
      where: {
        id,
      },
    });

    if (!admin) {
      res.send({
        code: 404,
        status: "Not found",
        message: `Couldn't find an admin with id ${id}`,
      });
    }

    await Admin.destroy({
      where: {
        id,
      },
    });

    res.send({
      code: 200,
      status: "success",
      dataName: "adminId",
      data: id,
      message: `Successfully deleted moderator with id ${id}`,
    });
  }),
};
