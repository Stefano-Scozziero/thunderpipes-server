const API_URL = 'http://localhost:3000/api/products';

async function testBackend() {
    try {
        console.log("1. Creating product...");
        const newProduct = {
            name: "Test Backend Product",
            price: 12345,
            img: "http://example.com/img.jpg",
            desc: "Description"
        };
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        const createdData = await createRes.json();
        const createdId = createdData._id;
        console.log("Created:", createdId);

        console.log("2. Verifying it exists...");
        const listRes = await fetch(API_URL);
        const listData = await listRes.json();
        const exists = listData.find(p => p._id === createdId);
        if (!exists) throw new Error("Product not found after creation");
        console.log("Product found.");

        console.log("3. Deleting product...");
        await fetch(`${API_URL}/${createdId}`, { method: 'DELETE' });
        console.log("Deleted.");

        console.log("4. Verifying deletion...");
        const listRes2 = await fetch(API_URL);
        const listData2 = await listRes2.json();
        const exists2 = listData2.find(p => p._id === createdId);
        if (exists2) throw new Error("Product still exists after deletion");
        console.log("Product successfully deleted.");

    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

testBackend();
