const { Sequelize, Op } = require("sequelize");


const { models } = require("../../sequelize");
const {
  Carpet,
  Size,
  CarpetColor,
  CarpetSize,
  Color,
  Image,
  Currency,
  CurrencyExchangeRate,
} = models;

const catchAsync = require("../../utils/catchAsync");

const returnSizesWithDiscountPrices = (sizes) => {
  sizes = sizes.map((size) => {
    const { discount, price } = size.carpetSize;
    if (discount) {
      size.carpetSize.dataValues.priceWithDiscount = returnPriceWithDiscount(
        price,
        discount
      );
    }
  });

  return sizes;
};

const returnPriceWithDiscount = (price, discount) => {
  discount = discount / 100;
  const priceWithDiscount = price - price * discount;
  return parseInt(priceWithDiscount.toFixed(2));
};

const createImagesForCarpet = async (carpetId, images, descriptions) => {
  for (let i = 0; i < images.length; i++) {
    await Image.create({
      url: images[i],
      carpetId,
      description: descriptions[i],
    });
  }
};

const returnCarpetById = async (id, res) => {
  const carpet = await Carpet.findOne({
    where: {
      id,
    },
  });

  if (!carpet) {
    res.send({
      code: 404,
      status: "Not found",
      message: `Couldn't find carpet with id ${id}`,
    });
  }

  return carpet;
};

const returnSortString = (sort) => {
  sort = sort.split("-");
  sort[sort.length - 1] = sort[sort.length - 1];
  return sort;
};

const returnFilterOptions = (filters) => {
  let colors = [],
    materials = [],
    sizes = [],
    widths = [],
    heights = [],
    filterOptions = {};

  if (filters) {
    colors = filters.colors || [];
    materials = filters.materials || [];
    sizes = filters.sizes || [];

    if (sizes.length) {
      widths = sizes.map((size) => size.width);
      heights = sizes.map((size) => size.height);
    }

    const includeOptions = [];
    colors.length
      ? includeOptions.push({
          model: Color,
          as: "colors",
          duplicating:false,
          where: { name: colors },
        })
      : null;

    sizes.length
      ? includeOptions.push({
          model: Size,
          as: "sizes",
          duplicating: false,
          where: { width: widths, height: heights },
        })
      : null;

    includeOptions.push({
      model: Size,
      as: "sizes",
      duplicating: false,
      through: {
        as: "carpetSize",
        duplicating: false,
        attributes: ["inStock", "price"],
      },
    });

    filterOptions = {
      include: includeOptions,
    };
  }

  return { filterOptions, materials };
};

const returnSortOptions = (sort) => {
  let sortOptions = {};

  if (sort) {
    if (typeof sort !== "string") {
      throw new Error("Invalid  option in query");
    }

    sort = returnSortString(sort);

    if (sort[0] === "price") {
      sortOptions = {
        order: Sequelize.literal(`"sizes->carpetSize"."price" ${sort[1]}`),
      };
    } else {
      sortOptions = {
        order: [[sort[0], sort[1]]],
      };
    }
  } else {
    sortOptions = {
      order: [["createdAt", "desc"]],
    };
  }

  return sortOptions;
};

const returnWhereOptions = (materials, keyword) => {
  let whereOptions = {};

  if (materials.length || keyword) {
    whereOptions.where = {};
  }

  if (materials.length) {
    whereOptions.where.material = materials;
  }

  if (keyword) {
    whereOptions.where.name = {};
    whereOptions.where.name[Op.iLike] = `%${keyword}%`;
  }

  return whereOptions;
};

const parseCarpetContents = async (carpet) => {
  for (const color of carpet.colors) {
    color.name = await JSON.parse(color.name);
  }

  carpet.material = await JSON.parse(carpet.material);

  carpet.content = await JSON.parse(carpet.content);

  carpet.description = await JSON.parse(carpet.description);

  carpet.preview = carpet.images[0].url;

  return carpet;
};

module.exports = {
  getAllCarpets: catchAsync(async (req, res) => {
    let { filters, sort, offset, limit, keyword, sale } = req.query;

    const { filterOptions, materials } = await returnFilterOptions(filters);

    const sortOptions = await returnSortOptions(sort);

    const whereOptions = await returnWhereOptions(materials, keyword);

    const limits = {
      offset: offset ? parseInt(offset) : 0,
      limit: limit ? parseInt(limit) : 16,
    };

    const options = {
      ...whereOptions,
      ...sortOptions,
      ...filterOptions,
      ...limits,
      subQuery: false,
    };
    let rows = await Carpet.findAll(options);
    let count = await Carpet.count();
    if (sale) {
      rows = rows.filter((row) => {
        for (const size of row.sizes) {
          if (size.carpetSize.discount > 0) {
            return row;
          }
        }
      });
    }
    rows.map(async (carpet) => {
      carpet = await parseCarpetContents(carpet);

      return carpet;
    });

    rows.map((carpet) => {
      carpet.sizes = returnSizesWithDiscountPrices(carpet.sizes);
    });

    res.send({
      status: "success",
      code: 200,
      dataName: "data",
      data: {
        carpets: rows,
        count,
      },
    });
  }),

  createOneCarpet: catchAsync(async (req, res) => {
    let {
      name,
      description,
      colorIds,
      sizes,
      material,
      price,
      content,
      imageDescriptions,
    } = req.body;
    let sizeIds = [];
    if (!sizes) throw new Error("Please provide size(s) of carpet");
    for (let i = 0; i < sizes.length; i++) {
      sizes[i] = JSON.parse(sizes[i]);
      sizeIds.push(sizes[i].id);
    }

    const defaultCurrency = await Currency.findOne({ where: { code: "USD" } });

    const newCarpet = await Carpet.create({
      name,
      description,
      material,
      price,
      content,
      currencyId: defaultCurrency.id,
      preview: req.images[0],
    });
    await createImagesForCarpet(newCarpet.id, req.images, imageDescriptions);
    const colors = await Color.findAll({
      where: { id: colorIds },
      attributes: ["id"],
    });

    const sizesFromDatabase = await Size.findAll({
      where: { id: sizeIds },
      attributes: ["id"],
    });

    for (let i = 0; i < colors.length; i++) {
      await CarpetColor.create({
        carpetId: newCarpet.id,
        colorId: colors[i].id,
      });
    }

    for (let i = 0; i < sizesFromDatabase.length; i++) {
      await CarpetSize.create({
        carpetId: newCarpet.id,
        sizeId: sizesFromDatabase[i].id,
        price: sizes[i].price,
        inStock: sizes[i].inStock,
        discount: sizes[i].discount,
      });
    }
    const carpet = await Carpet.findOne({
      where: { id: newCarpet.id },
    });

    res.send({
      status: "success",
      code: 200,
      dataName: "carpet",
      data: carpet,
      message: "Successfully created a carpet",
    });
  }),

  getCarpetById: catchAsync(async (req, res) => {

    const id = req.params.id;

    let carpet = await returnCarpetById(id, res);

    carpet = await parseCarpetContents(carpet);
    carpet.sizes = returnSizesWithDiscountPrices(carpet.sizes);
    res.send({
      code: 200,
      status: "success",
      dataName: "carpet",
      data: carpet,
    });
  }),
  
  changeCarpetById: catchAsync(async (req, res) => {
    const id = req.params.id;

    let {
      name,
      description,
      colorIds,
      sizes,
      material,
      price,
      content,
      imageDescriptions,
    } = req.body;

    await Carpet.update(
      { name, description, material, price, content, preview: req.images[0] },
      { where: { id } }
    );

    await createImagesForCarpet(id, req.images, imageDescriptions);

    const carpet = await Carpet.findOne({ where: { id } });

    let deleteColorIds = [];
    for (let i = 0; i < carpet.colors.length; i++) {
      deleteColorIds.push(carpet.colors[i].id);
    }
    await CarpetColor.destroy({
      where: {
        carpetId: id,
        colorId: deleteColorIds,
      },
    });

    let sizeIds = [];
    for (let i = 0; i < sizes.length; i++) {
      sizes[i] = JSON.parse(sizes[i]);
      sizeIds.push(sizes[i].id);
    }

    let deleteSizeIds = [];
    for (let i = 0; i < carpet.sizes.length; i++) {
      deleteSizeIds.push(carpet.sizes[i].id);
    }
    await CarpetSize.destroy({
      where: {
        carpetId: id,
        sizeId: deleteSizeIds,
      },
    });

    const colorsFromDatabase = await Color.findAll({
      where: { id: colorIds },
      attributes: ["id"],
    });

    const sizesFromDatabase = await Size.findAll({
      where: { id: sizeIds },
      attributes: ["id"],
    });

    for (let i = 0; i < colorsFromDatabase.length; i++) {
      await CarpetColor.create({
        carpetId: id,
        colorId: colorsFromDatabase[i].id,
      });
    }

    for (let i = 0; i < sizesFromDatabase.length; i++) {
      await CarpetSize.create({
        carpetId: id,
        sizeId: sizesFromDatabase[i].id,
        price: sizes[i].price,
        inStock: sizes[i].inStock || sizes[i].carpetSize.inStock || 0,
        discount: sizes[i].discount || 0,
      });
    }

    res.send({
      status: "success",
      code: 200,
      message: `Successfully changed carpet with id ${id}`,
    });
  }),

  deleteCarpetById: catchAsync(async (req, res) => {
    const id = req.params.id;

    await returnCarpetById(id, res);

    await Carpet.destroy({
      where: {
        id,
      },
    });

    res.send({
      code: 200,
      status: "success",
      message: `Deleted carpet with id ${id}`,
    });
  }),
};
