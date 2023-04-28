const { models } = require("../../sequelize");
const { Material } = models;

const catchAsync = require("../../utils/catchAsync");
const response = require("../../utils/response");

const { validateMaterial } = require("../../utils/validate");

module.exports = {
  createMaterial: catchAsync(async (req, res) => {
    const name = JSON.stringify(req.body.name);

    await validateMaterial(name);

    const material = await Material.create({ name });

    response(res, {
      status: "success",
      code: 200,
      dataName: "material",
      data: material,
      message: `Successfully created material with name: ${name}`,
    });
  }),

  getMaterials: catchAsync(async (req, res) => {
    const materials = await Material.findAll();

    response(res, {
      status: "success",
      code: 200,
      dataName: "materials",
      data: materials,
    });
  }),

  changeMaterial: catchAsync(async (req, res) => {
    const { id } = req.params;

    const material = await Material.findOne({ where: { id } });

    if (!material) {
      throw new Error(`Couldn't find material with id ${id}`);
    }

    const { name } = req.body;

    await validateMaterial(name);

    await Material.update({ name }, { where: { id } });

    response(res, {
      status: "success",
      code: 200,
      message: `Successfully change material with id ${id}`,
    });
  }),

  deleteMaterial: catchAsync(async (req, res) => {
    const { id } = req.params;

    const material = await Material.findOne({
      where: {
        id,
      },
    });

    if (!material) {
      response(res, {
        code: 404,
        status: "Not found",
        message: `Couldn't find a material with id ${id}`,
      });
    }

    await Material.destroy({
      where: {
        id,
      },
    });

    response(res, {
      code: 200,
      status: "success",
      message: `Successfully deleted size with id ${id}`,
    });
  }),
};
