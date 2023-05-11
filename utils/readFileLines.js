// module.exports = (filePath) => {
//   const fs = require("fs");

//   let count = 0;

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .on("data", (chunk) => {
//         for (let i = 0; i < chunk.length; ++i) {
//           if (chunk[i] === 10) count++;
//         }
//       })
//       .on("end", () => {
//         resolve(count);
//       })
//       .on("error", (err) => {
//         reject(err);
//       });
//   });
// };
