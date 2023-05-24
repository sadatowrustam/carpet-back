const { Sequelize, Op, col, where } = require("sequelize");
const {v4}=require("uuid")
const sharp=require("sharp")
const { models } = require("../../sequelize");
const {
  Carpet,
  Size,
  CarpetColor,
  CarpetSize,
  Color,
  Image,
  Currency,
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


const returnCarpetById = async (id, res) => {
  const carpet = await Carpet.findOne({
    where: {
      id,
    },
    order:[["sizes","createdAt","DESC"]]
  });

  if (!carpet) {
    return res.send({
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
    filterOptions = {};
  if (filters) {
    if(filters.colors!="undefined" && filters.colors!=undefined) colors = filters.colors.split(",");
    if(filters.materials!="undefined" && filters.materials!=undefined) {
      let not_materials=filters.materials.split(",")
      for(let i=0; i<not_materials.length;i++)
        materials.push("%"+not_materials[i]+"%") 
      
    }
    if(filters.sizes!="undefined" && filters.sizes!=undefined) sizes = filters.sizes.split(",");

    const includeOptions = [];
    colors.length
      ? includeOptions.push({
          model: Color,
          as: "colors",
          duplicating:false,
          where: { id:colors },
        })
      : null;

    sizes.length
      ? includeOptions.push({
          model: Size,
          as: "sizes",
          duplicating: false,
          where: { id:sizes},
        })
      : null;
    // console.log(91,includeOptions)
    // includeOptions.push({
    //   model: Size,
    //   as: "sizes",
    //   duplicating: false,
    //   through: {
    //     as: "carpetSize",
    //     duplicating: false,
    //     attributes: ["inStock", "price"],
    //   },
    // });
    console.log(102,includeOptions)
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

const returnWhereOptions = (materials, keyword,sale,min_price,max_price) => {
  let whereOptions = {};
  whereOptions.where={}

  if (materials!="undefined" && materials.length>0)  {
   whereOptions.where.material ={[Op.like]:{[Op.any]:materials}} ;
    // whereOptions.where.material ={[Op.like]:materials} ;

  }

  if (keyword) {
    whereOptions.where.name = {};
    whereOptions.where.name[Op.iLike] = `%${keyword}%`;
  }
  if(sale&sale!="undefined"){
    whereOptions.where.isDiscount=true
  }
  return whereOptions;
};

module.exports = {
  getAllCarpets: catchAsync(async (req, res) => {
    let {  sort, offset, limit, keyword, sale,min,max } = req.query;
    const { filterOptions, materials }=returnFilterOptions(req.query);
    const sortOptions = returnSortOptions(sort);
    sortOptions.order.push(["sizes","createdAt","DESC"])
    const whereOptions = returnWhereOptions(materials, keyword,sale,min,max);
    if(Number(limit)>=10) limit=Number(limit)+1
    else limit=Number(limit)
    const limits = {
      offset: offset ? parseInt(offset) : 0,
      limit: limit  || 11
    };
    const options = {
      ...whereOptions,
      ...sortOptions,
      ...filterOptions,
      ...limits,
      subQuery: false,
    };
    console.log(options)
    let rows = await Carpet.findAll(options);
    let count = await Carpet.count(whereOptions);
    // if (sale) {
    //   rows = rows.filter((row) => {
    //     for (const size of row.sizes) {
    //       console.log(size.carpetSize)
    //       if (size.carpetSize.discount > 0) {
    //         return row;
    //       }
    //     }
    //   });
    // }
    
    console.log(187,rows.length)
    rows.map((carpet) => {
      carpet.sizes = returnSizesWithDiscountPrices(carpet.sizes);
    });

    return res.send({
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
      sizes,
      material,
      price,
      content,
    } = req.body;
    let sizeIds = [];
    let carpetPrices=[]
    if (!sizes) throw new Error("Please provide size(s) of carpet");
    for (let i = 0; i < sizes.length; i++) {
      sizeIds.push(sizes[i].id);
    }
    let colorIds=[]
    for(const onecolor of req.body.color){
      colorIds.push(onecolor.id)
    }
    description=JSON.stringify(description)
    content=JSON.stringify(content)
    name = JSON.stringify(name)

    material=JSON.stringify(material.map((material)=>{return(material.name)}))
    console.log(material)
    const defaultCurrency = await Currency.findOne({ where: { code: "USD" } });
    const newCarpet = await Carpet.create({
      name,
      description,
      material,
      price,
      content,
      currencyId: defaultCurrency.id,
    });
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
    let discount=false
    for (let i = 0; i < sizesFromDatabase.length; i++) {
      carpetPrices.push(sizes[i].price)
      await CarpetSize.create({
        carpetId: newCarpet.id,
        sizeId: sizesFromDatabase[i].id,
        price: sizes[i].price,
        inStock: sizes[i].instock,
        discount: sizes[i].discount,
      });
      if(sizes[i].discount!=0) discount=true
    }
    await newCarpet.update({isDiscount:discount,prices:carpetPrices})
    return res.send({
      status: "success",
      code: 200,
      data: newCarpet,
      message: "Successfully created a carpet",
    });
  }),

  getCarpetById: catchAsync(async (req, res) => {

    const id = req.params.id;

    let carpet = await returnCarpetById(id, res);

    // carpet = await parseCarpetContents(carpet);
    carpet.sizes = returnSizesWithDiscountPrices(carpet.sizes);
    return res.send({
      code: 200,
      status: "success",
      dataName: "carpet",
      data: carpet,
    });
  }),
  createImage: catchAsync(async (req, res) => {
    req.files = Object.values(req.files)
    req.files = intoArray(req.files)
    let imagesArray=[]    
    for (const images of req.files) {
      const image = `${v4()}_carpet.webp`;
      const photo = images.data
      let buffer = await sharp(photo).webp().toBuffer()
      await sharp(buffer).toFile(`public/images/${image}`);
      let newImage = await Image.create({ url: image, carpetId: req.params.id })
      imagesArray.push(newImage)
  }
    return res.send({
      status: "success",
      code: 200,
      data: imagesArray,
    });
  }),
  deleteImage: catchAsync(async (req, res) => {
    const image=await Image.findOne({where:{id:req.params.id}})
    await image.destroy()
     return res.send({
      status: "success",
      code: 200,
    });
    }),
  changeCarpetById: catchAsync(async (req, res) => {
    const id = req.params.id;

    let {
      name,
      description,
      sizes,
      material,
      price,
      content,
      colors
    } = req.body;
    console.log(345,sizes)
    description=JSON.stringify(description)
    content=JSON.stringify(content)
    name = JSON.stringify(name)
    material=JSON.stringify(material)
    await Carpet.update(
      { name, description, material, price, content },
      { where: { id } }
    );

    const carpet = await Carpet.findOne({ where: { id } });
    await CarpetColor.destroy({
      where: {
        carpetId: id,
      },
    });
    let colorIds=[]
    let sizeIds = [];
    for (let i = 0; i < sizes.length; i++) {
      sizeIds.push(sizes[i].id);
    }
    await CarpetSize.destroy({
      where: {
        carpetId: id,
      },
    });
    for(const color of colors){
      colorIds.push(color.id)
    }
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

    let discount=false
    for (let i = 0; i < sizesFromDatabase.length; i++) {
      await CarpetSize.create({
        carpetId: carpet.id,
        sizeId: sizesFromDatabase[i].id,
        price: sizes[i].price,
        inStock: sizes[i].instock,
        discount: sizes[i].discount,
      });
      if(sizes[i].discount!=0) discount=true
    }
    if(discount) await carpet.update({isDiscount:true})
    else await carpet.update({isDiscount:false})

    return res.send({
      status: "success",
      code: 200,
      message: `Successfully changed carpet with id ${id}`,
    });
  }),

  deleteCarpetById: catchAsync(async (req, res) => {
    const id = req.params.id;
    console.log("fdew")
    await returnCarpetById(id, res);

    await Carpet.destroy({
      where: {
        id,
      },
    });

    return res.send({
      code: 200,
      status: "success",
      message: `Deleted carpet with id ${id}`,
    });
  }),
};
const intoArray = (file) => {
  if (file[0].length == undefined) return file
  else return file[0]
}
