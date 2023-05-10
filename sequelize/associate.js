module.exports = ({ models }) => {
  const {
    Admin,
    AdminToken,
    Carpet,
    Color,
    Size,
    CarpetColor,
    CarpetSize,
    Image,
    Currency,
    CurrencyExchangeRate,
    Order,
    CarpetOrder,
    Banner,
    GalleryImage,
    Video,
    BlogVideo,
  } = models;

  Admin.hasMany(AdminToken, {
    foreignKey: "adminId",
    as: {
      singular: "adminToken",
      plural: "adminTokens",
    },
  });

  AdminToken.belongsTo(Admin, {
    foreignKey: "adminId",
    as: "admin",
  });

  //

  Carpet.belongsToMany(Color, {
    as: "colors",
    through: CarpetColor,
    foreignKey: "carpetId",
  });

  Color.belongsToMany(Carpet, {
    as: "carpets",
    through: CarpetColor,
    foreignKey: "colorId",
  });

  //

  Carpet.belongsToMany(Size, {
    as: "sizes",
    through: CarpetSize,
    foreignKey: "carpetId",
  });

  Size.belongsToMany(Carpet, {
    as: "carpets",
    through: CarpetSize,
    foreignKey: "sizeId",
  });

  //

  Carpet.hasMany(Image, {
    foreignKey: "carpetId",
    as: {
      singular: "image",
      plural: "images",
    },
  });

  Image.belongsTo(Carpet, {
    foreignKey: "carpetId",
    as: "carpet",
  });

  //

  CurrencyExchangeRate.belongsTo(Currency, {
    as: "fromCurrency",
    foreignKey: "fromCurrencyId",
  });

  CurrencyExchangeRate.belongsTo(Currency, {
    as: "toCurrency",
    foreignKey: "toCurrencyId",
  });

  //

  Currency.hasOne(Carpet, {
    foreignKey: "currencyId",
    as: "currency",
  });

  Carpet.belongsTo(Currency, {
    foreignKey: "currencyId",
    as: "currency",
  });

  //

  Carpet.belongsToMany(Order, {
    foreignKey: "carpetId",
    through: CarpetOrder,
    as: "orders",
  });

  Order.belongsToMany(Carpet, {
    foreignKey: "orderId",
    through: CarpetOrder,
    as: "carpets",
  });

  //

  Banner.hasOne(Image, {
    foreignKey: "bannerId",
    as: "image",
  });

  Image.belongsTo(Banner, {
    as: "image",
  });

  //

  Banner.hasOne(Video, {
    foreignKey: "bannerId",
    as: "video",
  });

  Video.belongsTo(Banner, {
    as: "video",
  });

  //

  BlogVideo.hasOne(Video, {
    foreignKey: "blogVideoId",
    as: "blogVideo",
    onDelete:"cascade"
    
  });

  Video.belongsTo(BlogVideo, {
    foreignKey: "blogVideoId",
  });

  //

  GalleryImage.hasOne(Image, {
    foreignKey: "galleryImageId",
    as: "galleryImage",
  });

  Image.belongsTo(GalleryImage, {
    as: "galleryImage",
  });
};
