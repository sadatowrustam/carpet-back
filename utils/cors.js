const cors = require(`cors`);

const whitelist = [
  "https://turkmencarpets.kz",
  "https://turkmencarpets.kz/admin",
  "https://turkmencarpets.kz/admin/add",
  "http://turkmencarpets.kz",
  "*"
];

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, { origin: true });
  },
};

module.exports = { cors, corsOptions };
