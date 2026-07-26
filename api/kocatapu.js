const express = require("express");
const db = require("../config/db6");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/kocatapu?tc=50563620726&auth=discord.gg/relaxservices
router.get("/kocatapu", limiter, async (req, res) => {
    try {
        const { tc, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }

        if (!tc) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
        }

        if (!/^\d{11}$/.test(tc)) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
        }

        const query = `SELECT * FROM 2mkocaeli WHERE TCKimlikNo = ?`;
        const params = [tc];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Sunucu Hatasi:", err);
                return res.status(500).json({ hata: "Sunucu Hatasi Olustu!"});
            }

            if (results.length === 0) {
                return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
            }

            const formattedResults = results.map((row) => ({
                apiSahibi: "devrelax",
                apiDiscordSunucusu: "discord.gg/relaxservices",
                apiTelegramGrubu: "t.me/relax_services",
                veri: {
                    tc: row.TCKimlikNo || 'mevcutDegil',
                    adi: row.Adi || 'mevcutDegil',
                    soyadi: row.Soyadi || 'mevcutDegil',
                    babaAdi: row.BabaAdi || 'mevcutDegil',
                    mahalleKoyAdi: row.MahalleKoyAdi || 'mevcutDegil',
                    mahalleKoyTipi: row.MahalleKoyTip || 'mevcutDegil',
                    kutukTipi: row.KutukTip || 'mevcutDegil',
                    zeminTipi: row.ZeminTip || 'mevcutDegil',
                    ada: row.Ada || 'mevcutDegil',
                    parsel: row.Parsel || 'mevcutDegil',
                    paftaNo: row.PaftaNo || 'mevcutDegil',
                    mevki: row.Mevkii || 'mevcutDegil',
                    yuzOlcum: row.Yuzolcum || 'mevcutDegil',
                    cilt: row.Cilt || 'mevcutDegil',
                    sayfa: row.Sayfa || 'mevcutDegil',
                    anaTasinmazCinsref: row.AnaTasinmazTasinmazCinsRef || 'mevcutDegil',
                    anaTasinmazNitelik: row.AnaTasinmazNitelik || 'mevcutDegil',
                    blok: row.Blok || 'mevcutDegil',
                    giris: row.Giris || 'mevcutDegil',
                    kat: row.Kat || 'mevcutDegil',
                    bagimsizBolumNo: row.BagimsizBolumNo || 'mevcutDegil',
                    arsaPay: row.ArsaPay || 'mevcutDegil',
                    arsaPayda: row.ArsaPayda || 'mevcutDegil',
                    bagimsizBolumTasinmazCinsRef: row.BagimsizBolumTasinmazCinsRef || 'mevcutDegil',
                    bagimsizBolumNitelik: row.BagimsizBolumNitelik || 'mevcutDegil',
                    zeminHisseId: row.ZeminHisse_ID || 'mevcutDegil',
                    zeminRef: row.ZeminRef || 'mevcutDegil',
                    cinsiyetTipi: row.CinsiyetTip || 'mevcutDegil',
                    cinsiyet: row.Cinsiyet || 'mevcutDegil',
                    hisseTipi: row.HisseTip || 'mevcutDegil',
                    istirakNo: row.IstirakNo || 'mevcutDegil',
                    hissePay: row.HissePay || 'mevcutDegil',
                    hissePayda: row.HissePayda || 'mevcutDegil',
                    edinmeSebebi: row.EdinmeSebebi || 'mevcutDegil',
                    tarih: row.Tarih || 'mevcutDegil',
                    yevmiye: row.Yevmiye || 'mevcutDegil',
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
