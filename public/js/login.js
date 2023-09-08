document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const action = document.activeElement.getAttribute('data-action');
    let dataForReq;
    if (username && email) {
      dataForReq = { name: username, email };
    } else if (username) {
      dataForReq = username;
    } else {
      dataForReq = email;
    }
    // Create a JSON object with the login data
    const loginData = {
      data: dataForReq,
      password: password,
    };

    let endpoint;
    if (action === 'signin') {
      endpoint = '/auth/login';
    } else if (action === 'signup') {
      endpoint = '/auth/signup';
    }

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        const customHeaders = new Headers();
        customHeaders.append('Authorization', `Bearer ${data.accessToken}`);

        // Define the URL to redirect to
        const redirectUrl = '/posts'; // Replace with your desired URL

        // Create a Request object with custom headers
        const request = new Request(redirectUrl, {
          method: 'GET', // Use the appropriate HTTP method (GET, POST, etc.)
          headers: customHeaders,
          redirect: 'manual', // Set to 'follow' to allow following redirects
        });

        // Perform the fetch request
        fetch(request)
          .then((response) => {
            if (response.ok) {
              // If the response is successful, the browser will follow the redirect
            } else {
              // Handle errors, e.g., display an error message or redirect to an error page
              console.error('Error123:', response.status);
            }
          })
          .catch((error) => {
            // Handle network errors
            console.error('Network error:', error);
          });

        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
});
