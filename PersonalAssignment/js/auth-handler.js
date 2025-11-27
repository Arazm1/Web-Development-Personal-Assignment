'use strict';

export function getToken(){
    return localStorage.getItem('authToken');
}

export function setToken(token){
    localStorage.setItem('authToken', token);
}

export function deleteToken(){
    localStorage.removeItem('authToken');
}

export function logOut(){
    deleteToken();
    window.location.href = "index.html";
    console.log('Logged out');
}

export function checkTokenForAccountSettings(){
    const token = getToken();
    if(!token){
        window.location.href = 'index.html';
    }
}

export function checkTokenForLoginPage(){
    const token = getToken();
    if(token){
        window.location.href = 'index.html';
    }
}

export function checkTokenForRegisterPage(){
    const token = getToken();
    if(token){
        window.location.href = 'index.html';
    }
}