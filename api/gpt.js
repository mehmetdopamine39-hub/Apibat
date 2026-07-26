const express = require("express");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();

const apiax = process.env.API_DEEPINFRA;

const modelUrl = "https://api.deepinfra.com/v1/inference/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo";
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/gpt?soru=MERHABA&auth=discord.gg/relaxservices
router.get("/gpt", limiter, async (req, res) => {
    const { soru, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!soru || soru.trim().length === 0) {
        return res.status(400).json({ error: "Lutfen Gecerli Bir, Soru Giriniz!" });
    }

    const inputData = {
        input: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${soru}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
        stop: ["<|eot_id|>", "<|end_of_text|>", "<|eom_id|>"]
    };

    try {
        const response = await axios.post(modelUrl, inputData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiax}`,
            },
        });

        const answer = response.data?.results?.[0]?.generated_text || "Yanit Alinamadi, Lutfen Tekrar Deneyin!";

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: {
                soru: soru,
                cevap: answer
            }
        });
    } catch (error) {
        console.error("Sunucu Hatasi:", error.message);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
