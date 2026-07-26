const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gsm",
});

db.connect((err) => {
  if (err) {
    console.error("- gsm:", err);
    process.exit(1);
  }
  console.log("+ gsm");
});

module.exports = db;
