const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const API_URL = 'http://localhost:3000';

const testDelete = async () => {
    try {
        // 1. Login as Admin
        console.log("Logging in...");
        await client.post(`${API_URL}/api/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        console.log("Logged in.");

        // 2. Create a product to delete
        console.log("Creating product...");
        const createRes = await client.post(`${API_URL}/api/products`, {
            name: 'Delete Me',
            price: 100,
            stock: 1,
            img: 'http://img.com',
            desc: 'To be deleted'
        });
        const productId = createRes.data._id;
        console.log(`Product created: ${productId}`);

        // 3. Delete the product
        console.log("Deleting product...");
        await client.delete(`${API_URL}/api/products/${productId}`);
        console.log("Product deleted.");

        // 4. Verify deletion
        try {
            await client.get(`${API_URL}/api/products/${productId}`);
            console.error("❌ Product still exists!");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("✅ Product successfully deleted (404 confirmed).");
            } else {
                console.error("❌ Error verifying deletion:", error.message);
            }
        }

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
};

testDelete();
