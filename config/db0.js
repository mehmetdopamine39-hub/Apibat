const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "400k_vesika",
});

db.connect((err) => {
  if (err) {
    console.error("- 400k_vesika:", err);
    process.exit(1);
  }
  console.log("+ 400k_vesika");
});

module.exports = db;
