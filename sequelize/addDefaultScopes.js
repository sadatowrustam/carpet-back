module.exports = ({ models }) => {
  const {
    Carpet,
    Color,
    Size,
    Image,
    Currency,
    Order,
    BlogVideo,
    Video,
    GalleryImage,
    Banner,
    CarpetOrder
  } = models;

  Carpet.addScope("defaultScope", {
    include: [
      { model: Image, separate: true, as: "images", duplicating: false },
      {
        model: Color,
        as: "colors",
        through: { attributes: [], required: true, duplicating: false },
      },
      {
        model: Size,
        as: "sizes",
        duplicating: false,
        order:[["createdAt","DESC"]],
        through: {
          as: "carpetSize",
          required: true,
          duplicating: false,
          attributes: ["inStock", "price", "discount"],
        },
      },
      { model: Currency, as: "currency", duplicating: false },
    ],
    attributes: {
      exclude: ["updatedAt", "currencyId"],
    },
  });

  Order.addScope("defaultScope", {
    include: [
      {
        model: Carpet,
        as: "carpets",
        through: { 
          as: "carpetOrder"
      },
      },
      {
        model:CarpetOrder,
        as:"carpetOrder",

      }
    ],
  });
  BlogVideo.addScope("defaultScope", {
    include: [{ model: Video, as: "blogVideo", attributes: ["id", "url"] }],
  });

  GalleryImage.addScope("defaultScope", {
    include: [{ model: Image, as: "galleryImage", attributes: ["id", "url"] }],
  });

  Banner.addScope("defaultScope", {
    include: [
      { model: Image, as: "image", attributes: ["url"] },
      { model: Video, as: "video", attributes: ["url"] },
    ],
  });
};
