'use strict';

import { getToken } from "./auth-handler.js";

export async function getAccountInfoByToken(token) {
    const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/users/token`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in fetching account information.');
    }

    const data = await response.json();
    //console.log('AccountInfo: ', data);
    return data;
}

export async function updateAccountInfo(updatedData){
    const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/users`;
    const token = getToken();
    if(!token){
        throw new Error('No access token found');
    }

    const body = {};

    if (updatedData.username) body.username = updatedData.username;
    if (updatedData.email) body.email = updatedData.email;
    if (updatedData.password) body.password = updatedData.password;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in updating the account');
    }

    const data = await response.json();
    return data;
}


export async function uploadAvatar(file){
    const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1/users/avatar';
    const token = getToken();

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in uploading avatar');
    }

    const data = await response.json();
    console.log('Avatar uploaded:', data);
    return data;
}


export async function deleteCurrentUser(){
    const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1/users';
    const token = getToken();

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        //body: JSON.stringify(body)
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in updating the account');
    }

    const data = await response.json();
    return data;
}