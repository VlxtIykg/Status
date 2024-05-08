const { NoIdGivenError } = require("./classes/Error.js");
const { Database, SQLiteError } = require("bun:sqlite")
const queries_exec = {};
const { encrypt, decrypt } = require("./crypto.js");
const queries_instruction = require("./toml_parser.js");
const stmt = queries_instruction.queries;
let db;

if (__dirname.split("/")[-1] === "status") {
	db = new Database("./mydb.sqlite");
} else {
	db = new Database("../mydb.sqlite");
}
db.exec("PRAGMA journal_mode = WAL;");

function createQuery(name, queryFunction) {
	queries_exec[name] = queryFunction;
}

function getQuery(name) {
	return queries_exec[name] || null;
}
function addUser(id=null, encrypted_id=null, name=null) {
  try {
    if (id === null && encrypted_id === null) {
      throw new NoIdGivenError("addUser");
    }
    getQuery("addUserById")(encrypt(id), name)
    console.log(`Added user id: ${id} and user name: ${name}`);
  } catch (error) {
    if (error instanceof NoIdGivenError) {
      console.warn("Ignoring adduser fn because no id was given to add!")
    } else {
      console.log(error + "\n\n");
    }
  }
}

createQuery('addUserById', (id, name=null) => {
  return db.prepare(stmt.user_manipulation.addToUsers).run(id, name);
});

createQuery('addAltTable', (usernames, table_id) => {
  try {
    const insert = db.prepare(`INSERT INTO ${table_id} (roblox_alt) VALUES ($name)`);
    const insertUsernames = db.transaction(username_list => {
      for (const username of username_list) insert.run(username);
      return username_list.length;
    });
  
    const count = insertUsernames(usernames);
    console.log(`Inserted ${count} usernames`); 
  } catch (error) {
    console.error(error + "username already inside or something")
  }
});

createQuery('getAltTable', (table_indexed, print=false) => {
  stmt.user_extrapolation.getFromAlts = `select * from ${table_indexed}`

  const result = db.prepare(stmt.user_extrapolation.getFromAlts).all();
  if (print) {
    console.log(result);
  }
  return result;
});

createQuery("createTables", () => {
  const list_of_users = [encrypt("285707976356921344")]
  const table_construction = db.prepare(stmt.user_extrapolation.getFromUsers).all();
	for (const table in stmt.table_creation) { db.prepare(stmt.table_creation[table]).run(list_of_users); }
  table_construction.forEach(user => { stmt.alt_table_creation = `CREATE TABLE IF NOT EXISTS ${user.discord_id} (roblox_alt TEXT NOT NULL, PRIMARY KEY(roblox_alt))`; db.prepare(stmt.alt_table_creation).run(user); });
})

getQuery("createTables")()
// addUser();  
// addUser("285707976356921344", null, "Kami");  // Using named arguments 
// getQuery("addAltTable")(["HanakoTheCutest", "trnyami", "kwuromiiscute", "sparker_er","kamialt54", "kamialt55", "Lunarment"], encrypt("285707976356921344"))
// // getQuery("getUserById")(true)
// getQuery("getAltTable")(encrypt("285707976356921344"))

module.exports = { getQuery };


process.on("SIGINT", () => {
  db.close(false);
  console.log("Ctrl-C was pressed");
  process.exit();
});