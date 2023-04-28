const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const deletePublicImages = require("../utils/deletePublicImages");

rl.question(
  'Are you sure you want to delete all images in public folder? If you are sure type "YES": ',
  async (answer) => {
    if (answer === "YES") {
      await deletePublicImages();
      process.exit();
    } else {
      rl.close();
    }
  }
);
