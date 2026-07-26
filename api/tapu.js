const express = require("express");
const db = require("../config/db4");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/tapu?tc=11404305356&auth=discord.gg/relaxservices
router.get("/tapu", limiter, async (req, res) => {
    try {
        const { tc, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }
        if (!tc || !/^\d{11}$/.test(tc)) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
        }

        const query = `SELECT * FROM takbis WHERE Identify = ?`;
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
                    tc: row.Identify || "mevcutDegil",
                    adi: row.Name || "mevcutDegil",
                    soyadi: row.Surname || "mevcutDegil",
                    babaAdi: row.BabaAdi || "mevcutDegil",
                    il: row.İlBilgisi || "mevcutDegil",
                    ilce: row.İlceBilgisi || "mevcutDegil",
                    mahalle: row.MahalleBilgisi || "mevcutDegil",
                    zeminTipi: row.ZeminTipBilgisi || "mevcutDegil",
                    ada: row.AdaBilgisi || "mevcutDegil",
                    parsel: row.ParselBilgisi || "mevcutDegil",
                    yuzOlcumu: row.YuzolcumBilgisi || "mevcutDegil",
                    anaTasinmazNitelik: row.AnaTasinmazNitelik || "mevcutDegil",
                    blok: row.BlokBilgisi || "mevcutDegil",
                    bagimsizBolumNo: row.BagimsizBolumNo || "mevcutDegil",
                    bagimsizBolumNitelik: row.BagimsizBolumNitelik || "mevcutDegil",
                    arsaPay: row.ArsaPay || "mevcutDegil",
                    arsaPayda: row.ArsaPayda || "mevcutDegil",
                    istirakNo: row.IstirakNo || "mevcutDegil",
                    hissePay: row.HissePay || "mevcutDegil",
                    hissePayda: row.HissePayda || "mevcutDegil",
                    edinmeSebebi: row.EdinmeSebebi || "mevcutDegil",
                    tapuTarihi: row.TapuDate || "mevcutDegil",
                    yevmiye: row.Yevmiye || "mevcutDegil",
                }
            }));

            res.json(formattedResults);
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error);
        res.status(500).json({ error: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
