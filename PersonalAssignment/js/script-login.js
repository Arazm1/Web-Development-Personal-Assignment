'use strict';

import { checkTokenForLoginPage, setToken } from './auth-handler.js';
import { login } from './authorization.js';
import { HamburgerMenu, updateHamburgerMenuOptions } from './hamburger-menu.js';

checkTokenForLoginPage();
HamburgerMenu();
updateHamburgerMenuOptions()

let loginData = {
    username: '',
    password: ''
};


const form = document.getElementById('form-login');
//const usernameInput = document.getElementById('login-username');
//const passwordInput = document.getElementById('login-password');

form.addEventListener('submit', async (e) =>{
    e.preventDefault();

    loginData.username = document.getElementById('login-username').value.trim();
    loginData.password = document.getElementById('login-password').value.trim();

    if(!loginData.username || !loginData.password){
        console.log("Missing username || password");
        return;
    }
    
    try{
        const data = await login(loginData.username, loginData.password);
        console.log('Login successful:', data);

        const token = data.token;
        if (token) {
            console.log(token);
            //localStorage.setItem("authToken", data.token);
            setToken(token);

            window.location.href = './index.html';
        }

    } catch(error){
        console.log('Login failed:', error.message);
    }
})