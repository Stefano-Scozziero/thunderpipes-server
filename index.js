// server/index.js
const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// 1. Configuración de Mercado Pago
// REEMPLAZA 'TU_ACCESS_TOKEN' CON EL DE TU CUENTA DE PRUEBA
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.post("/create_preference", async (req, res) => {
    try {

        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';

        const body = {
            items: req.body.items.map(item => ({
                title: item.name,
                quantity: 1,
                unit_price: Number(item.price),
                currency_id: "ARS", // O la moneda de tu país
            })),
            // AQUÍ ESTABA EL PROBLEMA: Definimos las URLs de retorno explícitamente
            back_urls: {
                success: `${FRONTEND_URL}/success.html`, // URL de éxito
                failure: `${FRONTEND_URL}/failure.html`,
                pending: `${FRONTEND_URL}/pending.html`
            },
            //auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        
        res.json({ id: result.id });
        
    } catch (error) {
        console.error("Error detallado:", error); // Esto nos ayudará a ver más detalles si falla
        res.status(500).json({ 
            error: "Error al crear la preferencia", 
            message: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});