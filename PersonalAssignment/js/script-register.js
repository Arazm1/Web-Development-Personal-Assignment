'use strict';

import { checkTokenForRegisterPage } from './auth-handler.js';
import { checkUsernameAvailability, register } from './authorization.js';
import { HamburgerMenu, updateHamburgerMenuOptions } from './hamburger-menu.js';

checkTokenForRegisterPage();
HamburgerMenu();
updateHamburgerMenuOptions();

const fstep1 = document.getElementById('fstep-1');
const fstep2 = document.getElementById('fstep-2');
const fstep3 = document.getElementById('fstep-3');

let registerData = {
    username: '',
    email: '',
    password: '',
};


const step1 = fstep1.querySelector('button');

step1.addEventListener('click', async (e) =>{
    e.preventDefault();


    


    registerData.username = document.getElementById('register-username').value.trim();
    registerData.email = document.getElementById('register-email').value.trim();

    const status = await checkUsernameAvailability(registerData.username);
    if(!status){
      console.log('Username taken, red underline indafuture')
      return;
    }

    if(!registerData.username || !registerData.email){
        console.log("Add red text under telling need to input name/email");
        return;
    }

    fstep1.style.display = 'none';
    fstep2.style.display = 'block';
});


const step2 = fstep2.querySelector('button');

step2.addEventListener("click", (e) => {
  e.preventDefault();

  const password1 = document.getElementById("register-password").value;
  const password2 = document.getElementById("register-password2").value;

  if (password1 != password2) {
    console.log("Passwords do not match, also add red under text");
    return;
  }

  registerData.password = password1;

  fstep2.style.display = "none";
  fstep3.style.display = "block";

});



//enchance
const step3 = fstep3.querySelector("button");

step3.addEventListener("click", async (e) => {
  e.preventDefault();

  const file = document.getElementById("avatar-input").files[0];
  if (!file) {
    alert("Avatar is required");
    return;
  }

  try {
    const result = await register(registerData.username, registerData.email, registerData.password);

    alert("Registration complete! Check your activation email.");

    console.log(result); // contains activationUrl + user object

    window.location.href = './account-login.html';

  } catch (error) {
    alert("Registration error: " + error.message);
  }
});