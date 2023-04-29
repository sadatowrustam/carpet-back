const { models } = require("../../sequelize");
const { Material } = models;
const AppError=require(".././../utils/appError")
const catchAsync = require("../../utils/catchAsync");

const { validateMaterial } = require("../../utils/validate");

module.exports = {
  createMaterial: catchAsync(async (req, res,next) => {
    const name = JSON.stringify(req.body);
    await validateMaterial(name,next);

    const material = await Material.create({ name });
    res.send({
      status: "success",
      code: 201,
      data: material,
    });
  }),

  getMaterials: catchAsync(async (req, res,next) => {
    const materials = await Material.findAll();
    return res.send({
      status: "success",
      code: 200,
      data: materials,
    });
  }),
  getMaterial: catchAsync(async (req, res,next) => {
    const { id } = req.params;

    const material = await Material.findOne({
      where: {
        id,
      },
    });
    if(!material) return next(new AppError("Material not found",404))
    return res.send({
      code: 200,
      status: "success",
      material
    });
  }),
  changeMaterial: catchAsync(async (req, res,next) => {
    const { id } = req.params;

    const material = await Material.findOne({ where: { id } });

    if (!material) {
      if(!material) return next(new AppError("Material not found",404))

    }
    const name = JSON.stringify(req.body);
    await validateMaterial(name);

    await Material.update({ name }, { where: { id } });

    return res.send({
      status: "success",
      code: 200,
      message: `Successfully change material with id ${id}`,
    });
  }),

  deleteMaterial: catchAsync(async (req, res,next) => {
    const { id } = req.params;

    const material = await Material.findOne({
      where: {
        id,
      },
    });
    if(!material) return next(new AppError("Material not found",404))


    await Material.destroy({
      where: {
        id,
      },
    });

    return res.send({
      code: 200,
      status: "success",
      message: `Successfully deleted size with id ${id}`,
    });
  }),
};
