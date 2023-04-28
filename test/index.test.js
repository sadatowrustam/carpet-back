const testSuites = [
  require("./utils"),
  require("./controllers/admin"),
  require("./controllers/carpet"),
  require("./controllers/color"),
  require("./controllers/currency"),
];

describe("Tests", () => {
  for (const testSuite of testSuites) {
    testSuite();
  }
});
