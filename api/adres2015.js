const express = require("express");
const db = require("../config/db9");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/adres2015?tc=11404305356&auth=discord.gg/relaxservices
router.get("/adres2015", limiter, async (req, res) => {
    try {
        const { tc, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }

        if (!tc || !/^\d{11}$/.test(tc)) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
        }

        const query = `SELECT * FROM secmen2015 WHERE TC = ?`;
        const params = [tc];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Veritabani Hatasi:", err);
                return res.status(500).json({ hata: "Veritabani Hatasi Olustu!" });
            }

            if (results.length === 0) {
                return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
            }

            const formattedResults = results.map((row) => ({
                apiSahibi: "devrelax",
                apiDiscordSunucusu: "discord.gg/relaxservices",
                apiTelegramGrubu: "t.me/relax_services",
                veri: {
                    tc: row.TC || "mevcutDegil",
                    adi: row.ADI || "mevcutDegil",
                    soyadi: row.SOYADI || "mevcutDegil",
                    dogumYeri: row.DOGUMYERI || "mevcutDegil",
                    dogumTarihi: row.DOGUMTARIHI || "mevcutDegil",
                    il: row.ADRESIL || "mevcutDegil",
                    ilce: row.ADRESILCE || "mevcutDegil",
                    mahalle: row.MAHALLE || "mevcutDegil",
                    cadde: row.CADDE || "mevcutDegil",
                    kapiNo: row.KAPINO || "mevcutDegil",
                    daireNo: row.DAIRENO || "mevcutDegil"
                }
            }));

            res.json(formattedResults);
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error);
        res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
