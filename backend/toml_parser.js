const fs = require("fs");
const TOML = require("@ltd/j-toml");
const path = require("path")
const current_toml = path.join(__dirname, "queries.toml")
module.exports.queries = TOML.parse(fs.readFileSync(current_toml), { joiner: "\n" });