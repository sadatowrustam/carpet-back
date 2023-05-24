const { models } = require("../../sequelize");
const { Admin, AdminToken } = models;

const catchAsync = require("../../utils/catchAsync");
const { validateAdmin } = require("../../utils/validate");
const AppError=require("../../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { machineId } = require("node-machine-id");
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const createAdminToken = async (payload) => {
  const JWTExpireDate = "3 days";

  return jwt.sign(payload, "rustam", {
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

    const admin = await Admin.findOne()

    res.send({
      status: "success",
      code: 200,
      dataName: "data",
      admin
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

  editModerator: catchAsync(async (req, res,next) => {
    const { username,newPassword,newPasswordConfirm,password} = req.body;
    console.log(108,req.body)    
    const admin=await Admin.findOne();
    if (password && newPassword) {
      if (!(await bcrypt.compare(password, admin.password))) {
          return next(new AppError('Your current password is not correct', 401));
      }

      if (newPassword !== newPasswordConfirm) {
          return next(new AppError('New passwords are not the same', 400));
      }

      await admin.update({
          password: await bcrypt.hash(newPassword, 12),
      });
  }
    await admin.update({username})
    return res.send( {
      status: "success",
      code: 200,
    });
  }),

  login: catchAsync(async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
      throw new Error("Username is required");
    }
    let admin = await Admin.findOne({
      where: { username },
      include: "adminTokens",
    });
    if (!admin) {
      return res.status(401).send({
        code: 401,
        message: "Username or password is invalid",
      });
    }

    const passwordIsValid = await bcrypt.compare(password, admin.password);

    if (!passwordIsValid) {
      console.log(180)
      return res.send({
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
