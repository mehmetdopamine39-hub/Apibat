const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "101m",
});

db.connect((err) => {
  if (err) {
    console.error("- 101m:", err);
    process.exit(1);
  }
  console.log("+ 101m");
});

module.exports = db;
