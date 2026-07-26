const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "takbis",
});

db.connect((err) => {
  if (err) {
    console.error("- takbis:", err);
    process.exit(1);
  }
  console.log("+ takbis");
});

module.exports = db;
