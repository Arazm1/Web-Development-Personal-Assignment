'use strict';

import { getToken } from "./auth-handler.js";

export function HamburgerMenu(){
    const hamburgerMenuBtn = document.getElementById('hamburger-menu-btn')
    const hamburgerModal = document.getElementById('hamburger-modal');
    const hamburgerPanel = document.getElementById('hamburger-panel');


    //Debugging only
    if(!hamburgerMenuBtn || !hamburgerModal || !hamburgerPanel){
        console.log("Missing some important stuff");
        return;
    }

    hamburgerMenuBtn.addEventListener('click', () => {
        const hamburgerMenuStatus = hamburgerModal.classList.contains('show');
        hamburgerMenuStatus ? closeHamburgerMenu() : openHamburgerMenu();
    });

    function closeHamburgerMenu(){
        hamburgerModal.classList.remove('show');
        hamburgerMenuBtn.classList.remove('active');
        hamburgerModal.classList.add('hidden');
    }

    function openHamburgerMenu(){
        hamburgerModal.classList.remove('hidden');
        hamburgerMenuBtn.classList.add('active');
        hamburgerModal.classList.add('show');
        
    }

    //TODO Refine make it your own something something
    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!hamburgerModal.classList.contains("show")){
            return
        };

        const clickedInsidePanel = hamburgerPanel.contains(e.target);
        const clickedHamburger = e.target === hamburgerMenuBtn;

        if (!clickedInsidePanel && !clickedHamburger){
            closeHamburgerMenu();
        }
    });
}


export function updateHamburgerMenuOptions(){
    const loginOption = document.getElementById('h-login-option');
    const registerOption = document.getElementById('h-register-option');
    const accountSettings = document.getElementById('h-account-settings');

    const token = getToken();

    if(token){
        accountSettings.classList.remove('hidden');
        loginOption.classList.add('hidden');
        registerOption.classList.add('hidden');
    }
    else{
        
        loginOption.classList.remove('hidden');
        registerOption.classList.remove('hidden');
        accountSettings.classList.add('hidden');
    }
}