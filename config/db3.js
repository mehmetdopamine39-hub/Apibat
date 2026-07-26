const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if (err) {
        console.error("MySQL bağlantı hatası (db3.js):", err);
    } else {
        console.log("MySQL bağlantısı başarılı (db3.js)");
    }
});

module.exports = connection;
