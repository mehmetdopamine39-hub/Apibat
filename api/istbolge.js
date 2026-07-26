const express = require("express");
const db = require("../config/db5");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/istbolgetapu?mahalle=ABDİÇELEBİ&auth=discord.gg/relaxservices
router.get("/istbolgetapu", limiter, async (req, res) => {
    try {
        const {mahalle, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }
        if (!mahalle) {
            return res.status(400).json({ uyari: "Lutfen Mahalle Bilgisini, Giriniz!" });
        }

        const query = `SELECT * FROM 8mistanbul WHERE MahalleKoyAdi LIKE ?`;
        const params = [`%${mahalle}%`];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Sunucu Hatasi:", err);
                return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
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
