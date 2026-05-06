
async function testLogin() {
    try {
        const response = await fetch("http://localhost:8000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: 'admin', password: 'admin123' }),
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Data:", data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testLogin();
