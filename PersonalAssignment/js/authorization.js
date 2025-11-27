'use strict';

export async function register(username, email, password){
    const body = {
        username: username,
        password: password,
        email: email,
    };

    const url = 'https://media2.edu.metropolia.fi/restaurant';

    const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in register');
    }

    const data = response.json();
    return data;
}


export async function checkUsernameAvailability(username){
    const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${username}`;

    const response = await fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in checking username availability');
    }

    const data = await response.json();
    console.log(data);
    return data.available; 
}




export async function login(username, password){
    const body = {
        username: username,
        password: password,
    };

    const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in login');
    }
    const data = response.json();
    return data;
}


