const express = require("express");
const db = require("../config/db5");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/istapu?tc=52099059896&auth=discord.gg/relaxservices
router.get("/istapu", limiter, async (req, res) => {
    try {
        const { tc, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }
        if (!tc) {
            return res.status(400).json({ uyari: "Lütfen, Tc Bilgisini Eksiksiz Giriniz!" });
        }

        const query = `SELECT * FROM 8mistanbul WHERE TCKimlikNo = ?`;
        const params = [tc];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Veritabani Hatasi:", err);
                return res.status(500).json({ hata: "Veritabani Hatasi!" });
            }

            if (results.length === 0) {
                return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
            }

            const formattedResults = results.map((row) => ({
                apiSahibi: "devrelax",
                apiDiscordSunucusu: "discord.gg/relaxservices",
                apiTelegramGrubu: "t.me/relax_services",
                veri: {
                    tc: row.TCKimlikNo || "mevcutDegil",
                    adi: row.Adi || "mevcutDegil",
                    soyadi: row.Soyadi || "mevcutDegil",
                    babaAdi: row.BabaAdi || "mevcutDegil",
                    mahalleKoy: row.MahalleKoyAdi || "mevcutDegil",
                    zeminTipi: row.ZeminTip || "mevcutDegil",
                    ada: row.Ada || "mevcutDegil",
                    parsel: row.Parsel || "mevcutDegil",
                    yuzOlcumu: row.Yuzolcum || "mevcutDegil",
                    anaTasinmazNitelik: row.AnaTasinmazNitelik || "mevcutDegil",
                    blok: row.Blok || "mevcutDegil",
                    bagimsizBolumNo: row.BagimsizBolumNo || "mevcutDegil",
                    arsaPay: row.ArsaPay || "mevcutDegil",
                    arsaPayda: row.ArsaPayda || "mevcutDegil",
                    bagimsizBolumNitelik: row.BagimsizBolumNitelik || "mevcutDegil",
                    istirakNo: row.IstirakNo || "mevcutDegil",
                    hissePay: row.HissePay || "mevcutDegil",
                    hissePayda: row.HissePayda || "mevcutDegil",
                    edinmeSebebi: row.EdinmeSebebi || "mevcutDegil",
                    tarih: row.Tarih || "mevcutDegil",
                    yevmiye: row.Yevmiye || "mevcutDegil",
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
