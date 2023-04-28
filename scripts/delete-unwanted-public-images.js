const fs = require("fs");
const publicFolderPath = "../public/images";

const { models } = require("../sequelize");
const { Image } = models;

const logger = require("../utils/loggers/winston-logger");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const returnUnwantedFileNames = async (
  imagesInDatabase,
  imagesInPublicFolder
) => {
  return imagesInPublicFolder
    .filter((x) => !imagesInDatabase.includes(x))
    .concat(imagesInDatabase.filter((x) => !imagesInPublicFolder.includes(x)));
};

const deleteUnwantedFiles = async (files) => {
  for (let i = 0; i < files.length; i++) {
    fs.unlinkSync(`${publicFolderPath}/${files[i]}`);
  }

  logger.log({
    level: "info",
    message: "All unwanted images has been deleted",
    label: "success",
  });
};

const deleteUnwantedPublicImages = async () => {
  const imagesInDatabase = await Image.findAll();
  for (let i = 0; i < imagesInDatabase.length; i++) {
    imagesInDatabase[i] = imagesInDatabase[i].url.split("/").pop();
  }

  const imagesInPublicFolder = fs.readdirSync(publicFolderPath);

  const unwantedFiles = await returnUnwantedFileNames(
    imagesInDatabase,
    imagesInPublicFolder
  );

  unwantedFiles.length
    ? await deleteUnwantedFiles(unwantedFiles)
    : logger.log({
        level: "info",
        message: "There is no unwanted image in public folder",
        label: "info",
      });
};

rl.question(
  "Are you sure you want to delete unwanted images (images that are not written in database model 'Image'). If you are sure, type 'YES': ",
  async (answer) => {
    if (answer === "YES") {
      await deleteUnwantedPublicImages();
      process.exit();
    } else {
      rl.close();
    }
  }
);
