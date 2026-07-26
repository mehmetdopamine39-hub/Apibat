const express = require("express");
const db = require("../config/db8");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/akp?tc=48364813782&auth=discord.gg/relaxservices
router.get("/akp", limiter, async (req, res) => {
    try {
        const { tc, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }

        if (!tc || !/^\d{11}$/.test(tc)) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
        }

        const query = `SELECT * FROM 9makparti WHERE TCK = ?`;
        const params = [tc];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Veritabani Hatasi:", err);
                return res.status(500).json({ hata: "Veritabani Hatasi!" });
            }

            if (results.length === 0) {
                return res.status(404).json({ bilgi: "Sonuc bulunamadi!" });
            }

            const formattedResults = results.map((row) => ({
                apiSahibi: "devrelax",
                apiDiscordSunucusu: "discord.gg/relaxservices",
                apiTelegramGrubu: "t.me/relax_services",
                veri: {
                    tc: row.TCK || "mevcutDegil",
                    meslek: row.Meslek || "mevcutDegil",
                    kanGrubu: row.KanGrup || "mevcutDegil",
                    adres: row.Adres || "mevcutDegil",
                    evTelefonu: row.EvTel || "mevcutDegil",
                    isTelefonu: row.IsTel || "mevcutDegil",
                    mobilTelefonu: row.MobilTel1 || "mevcutDegil",
                    uyelikTarihi: row.UyelikTarih || "mevcutDegil"
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
