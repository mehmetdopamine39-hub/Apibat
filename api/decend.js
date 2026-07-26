const express = require("express");
const crypto = require("crypto");
const crc32 = require("crc-32");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/decend?yazi=devrelax&donusumturu=base64_encode&auth=discord.gg/relaxservices
router.get("/decend", limiter, (req, res) => {
    const { yazi, donusumturu, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!yazi || !donusumturu) {
        return res.status(400).json({ uyari: "Lutfen Gecerli Bir Metin Ve, Donusum Turu Giriniz!" });
    }

    let output;

    switch (donusumturu.toLowerCase()) {
        case "base64_encode":
            output = Buffer.from(yazi).toString("base64");
            break;
        case "base64_decode":
            output = Buffer.from(yazi, "base64").toString("utf-8");
            break;
        case "sha1":
            output = crypto.createHash("sha1").update(yazi).digest("hex");
            break;
        case "sha256":
            output = crypto.createHash("sha256").update(yazi).digest("hex");
            break;
        case "sha512":
            output = crypto.createHash("sha512").update(yazi).digest("hex");
            break;
        case "md5":
            output = crypto.createHash("md5").update(yazi).digest("hex");
            break;
        case "crc32":
            output = crc32.str(yazi);
            break;
        case "urlencode":
            output = encodeURIComponent(yazi);
            break;
        case "urldecode":
            output = decodeURIComponent(yazi);
            break;
        default:
            return res.status(400).json({ uyari: "Gecersiz Donusum Turu!" });
    }

    return res.json({
        apiSahibi: "devrelax",
        apiDiscordSunucusu: "discord.gg/relaxservices",
        apiTelegramGrubu: "t.me/relax_services",
        veri: {
            girdi: yazi,
            donusumTuru: donusumturu,
            cikti: output,
        }
    });
});

module.exports = router;
