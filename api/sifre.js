const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/sifreolusturucu?uzunluk=10&auth=discord.gg/relaxservices
router.get("/sifreolusturucu", limiter, (req, res) => {
    const { uzunluk, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    const sifreUzunlugu = parseInt(uzunluk, 10);
    if (isNaN(sifreUzunlugu) || sifreUzunlugu < 4 || sifreUzunlugu > 50) {
        return res.status(400).json({ uyari: "Lutfen 4 İle, 50 Arasinda Bir Uzunluk Giriniz!" });
    }

    const sifre = rastgeleSifreOlustur(sifreUzunlugu);

    res.json({
        apiSahibi: "devrelax",
        apiDiscordSunucusu: "discord.gg/relaxservices",
        apiTelegramGrubu: "t.me/relax_services",
        veri: {
            sifre: sifre,
            uzunluk: sifreUzunlugu
    }
    });
});

const rastgeleSifreOlustur = (uzunluk) => {
    const karakterler = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+";
    let sifre = "";
    for (let i = 0; i < uzunluk; i++) {
        const rastgeleIndex = crypto.randomInt(0, karakterler.length);
        sifre += karakterler[rastgeleIndex];
    }
    return sifre;
};

module.exports = router;
