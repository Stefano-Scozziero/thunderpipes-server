const API_URL = 'http://localhost:3000/api/products';

async function testRefactor() {
    try {
        console.log("1. Creating product (Refactor Test)...");
        const newProduct = {
            name: "Refactor Test Product",
            price: 500,
            stock: 10,
            img: "http://example.com/refactor.jpg",
            desc: "Testing MVC structure"
        };

        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        if (!createRes.ok) {
            const errData = await createRes.json();
            throw new Error(`Create failed: ${createRes.statusText} - ${JSON.stringify(errData)}`);
        }
        const createdData = await createRes.json();
        const createdId = createdData._id;
        console.log("Created ID:", createdId);

        console.log("2. Updating product (New Feature)...");
        const updateRes = await fetch(`${API_URL}/${createdId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: 5, price: 550 })
        });

        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.statusText}`);
        const updatedData = await updateRes.json();

        if (updatedData.stock !== 5 || updatedData.price !== 550) {
            throw new Error("Update did not persist correctly");
        }
        console.log("Update verified: Stock 10 -> 5, Price 500 -> 550");

        console.log("3. Deleting product...");
        const deleteRes = await fetch(`${API_URL}/${createdId}`, { method: 'DELETE' });
        if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteRes.statusText}`);
        console.log("Deleted successfully.");

        console.log("✅ Backend Refactor Verification PASSED");

    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testRefactor();
