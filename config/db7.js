const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "20misyeri",
});

db.connect((err) => {
  if (err) {
    console.error("- 20misyeri:", err);
    process.exit(1);
  }
  console.log("+ 20misyeri");
});

module.exports = db;
