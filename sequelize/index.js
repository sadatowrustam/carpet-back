require("dotenv").config({
  path: "../config/config.env",
});

const Sequelize = require("sequelize");
console.log("men seqyeku",__dirname)
const DATABASE_NAME = process.env.DATABASE_NAME || "carpet";
const DATABASE_HOST = process.env.DATASASE_HOST || "localhost";
const DATABASE_USER = process.env.DATABASE_USER || "postgres";
const DATABASE_USER_PASS = process.env.DATABASE_USER_PASS || "kuwat2009";
const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_USER_PASS,
  {
    host: DATABASE_HOST,
    dialect: "postgres",
  }
);
const fs = require("fs");
const modelsPath = `${__dirname}/models`;
const modelDefiners = fs.readdirSync(modelsPath);

for (let modelDefiner of modelDefiners) {
  modelDefiner = require(`${modelsPath}/${modelDefiner}`);
  modelDefiner(sequelize);
}

const associate = require("./associate");
associate(sequelize);

const addDefaultScopes = require("./addDefaultScopes");
addDefaultScopes(sequelize);

// This function fixes bug with function Model.findAndCountAll count data
sequelize.addHook("beforeCount", function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true;
    options.col =
      this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }

  if (options.include && options.include.length > 0) {
    options.include = null;
  }
});

module.exports = sequelize;
