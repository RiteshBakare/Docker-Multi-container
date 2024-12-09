document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        // Check if response is ok
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }

        alert(result.message || 'Registration successful');
    } catch (error) {
        console.error('Registration Error:', error);
        alert(error.message || 'Registration failed');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check if response is ok
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        alert(result.message || 'Login successful');
    } catch (error) {
        console.error('Login Error:', error);
        alert(error.message || 'Login failed');
    }
});