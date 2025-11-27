'use strict'

import { getAccountInfoByToken, updateAccountInfo, uploadAvatar, deleteCurrentUser } from "./account.js";
import { checkTokenForAccountSettings, getToken } from "./auth-handler.js";
import { HamburgerMenu, themeModeButton, updateHamburgerMenuOptions } from './hamburger-menu.js';

function initialize(){
    checkTokenForAccountSettings();
    themeModeButton();
    HamburgerMenu();
    updateHamburgerMenuOptions();
}
initialize();

//Account info
const infoAvatar = document.getElementById('account-info-avatar');
const infoName = document.getElementById('account-info-name');
const infoEmail = document.getElementById('account-info-email');
const infoFavRestaurant = document.getElementById('account-info-favorite-restaurant');

//Buttons
const accountEditButton = document.getElementById('account-edit-button');
const accountAvatarChangeButton = document.getElementById('change-avatar-button');
const accountDeleteButton = document.getElementById('account-delete-button');

//Modals
const accountEditModal = document.getElementById('account-edit-modal');
const accountChangeAvatarModal = document.getElementById('avatar-edit-modal');
const accountDeleteModal = document.getElementById('account-delete-modal');


//Edit modal
const accountEditForm = document.getElementById('account-edit-form');
const accountEditSaveBtn = document.getElementById('account-save-edit');
const accountEditCancelBtn = document.getElementById('account-cancel-edit');


//Avatar Modal
const avatarPreview = document.getElementById('avatar-preview');
const avatarFileInput = document.getElementById("avatar-file");
const avatarSaveButton = document.getElementById('avatar-save-edit');
const avatarCancelButton = document.getElementById("avatar-cancel-edit");

//Delete Modal

const accountDeleteConfirmButton = document.getElementById('account-delete-confirm-button');
const accountDeleteCancelButton = document.getElementById('account-delete-cancel-button');





accountEditButton.addEventListener('click', () => {
    displayAccountModifyModal();
});

accountAvatarChangeButton.addEventListener('click', () => {
    displayAccountAvatarChangeModal();
});

accountDeleteButton.addEventListener('click', () => {
    //displayAccountInfo();
});



//Run
displayAccountInfo();




async function displayAccountInfo(){
    try{
        const token = getToken();
        if(!token){
            console.log('No token found');
        }
        else{
            console.log('Token found');
        }

        const accountData = await getAccountInfoByToken(token);

        // Avatar
        if (accountData.avatar) {
            infoAvatar.src = `https://media2.edu.metropolia.fi/restaurant/uploads/${accountData.avatar}`;
            console.log('Avatar found');
        } else {
            infoAvatar.src = 'images/other/default-account-avatar.png';
            console.log('Avatar not found')
        }

        //infoAvatar.textContent = accountData.avatar || 'No Avatar';
        infoName.textContent = `Username: ${accountData.username}` || 'No Username';
        infoEmail.textContent = `Email: ${accountData.email}` || 'No Email';

        let favoriteRestaurantName = 'None set';
        if(accountData.favouriteRestaurant){
            const response2 = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/${accountData.favouriteRestaurant}`);
            if(response2.ok){
                const favRestaurant = await response2.json();
                favoriteRestaurantName = favRestaurant.name || 'None set';
            }
        }
        infoFavRestaurant.textContent = `Favorite Restaurant: ${favoriteRestaurantName}`;
    
    }
    catch(error){
        console.log('Error in displayAccountInfo', error);
    }
}



// Account Modify Modal
async function displayAccountModifyModal(){
    
    try{
        const accountData = await getAccountInfoByToken(getToken());
        //console.log(accountData);
        //const editAvatar = document.getElementById('edit-avatar');
        const editUsername = document.getElementById('edit-username');
        const editEmail = document.getElementById('edit-email');
        const editPassword = document.getElementById('edit-password');
        //const editFavoriteRestaurant = document.getElementById('edit-fav-restaurant');

        accountEditModal.classList.remove('hidden');

        //editAvatar.value = accountData.avatar;
        editUsername.value = accountData.username;
        editEmail.value = accountData.email;
        //editFavoriteRestaurant = accountData.favouriteRestaurant;


        accountEditSaveBtn.replaceWith(accountEditSaveBtn.cloneNode(true));
        accountEditCancelBtn.replaceWith(accountEditCancelBtn.cloneNode(true));

        const newSaveBtn = document.getElementById('account-save-edit');
        const newCancelBtn = document.getElementById('account-cancel-edit');

        newSaveBtn.addEventListener('click', async (e) => {
            newAccountData(e);
        });


        newCancelBtn.addEventListener('click', () => {
            closeAccountModifyModal();
        });

        accountEditModal.addEventListener('click', (e) => {
            if(e.target == accountEditModal){
                closeAccountModifyModal();
            }
        });



    }
    catch(error){
        console.log('Error in displayAccountModifyModal', error);
    }
}


async function newAccountData(e){
    e.preventDefault();

    const updatedAccountData = {};

    /*
    const updatedAccountData = {
        username: document.getElementById('edit-username').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        password: document.getElementById('edit-password').value.trim() || undefined,
        //avatar: document.getElementById('edit-avatar').value.trim(),
        //favouriteRestaurant: document.getElementById('edit-fav-restaurant').value
    };
    */
    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const password = document.getElementById('edit-password').value.trim();

    //refine
    if (username != '') updatedAccountData.username = username;
    if (email != '') updatedAccountData.email = email;
    if (password != '') updatedAccountData.password = password;



    try{
        await updateAccountInfo(updatedAccountData);

        displayAccountInfo();
        accountEditModal.classList.add('hidden');
        console.log("Account information updated.")
    }
    catch(error){
        console.log('Failed to update account:', error);
    }
}



//Avatar
async function displayAccountAvatarChangeModal(){
    openAccountChangeAvatarModal();
    
    try{
        const token = getToken();
        if(!token){
            console.log('No token');
        }
        else{
            console.log('TOKEN', token);
        }

        const accountData = await getAccountInfoByToken(token);
        if (accountData.avatar) {
            infoAvatar.src = `https://media2.edu.metropolia.fi/restaurant/uploads/${accountData.avatar}`;
            console.log('Avatar found');
        } else {
            infoAvatar.src = 'images/other/default-account-avatar.png';
            console.log('Avatar not found')
        }

        avatarCancelButton.addEventListener('click', () => {
            closeAccountChangeAvatarModal();
        });

        avatarFileInput.addEventListener("change", () => {
            const file = avatarFileInput.files[0];
            if(!file){
                return;
            }
            avatarPreview.src = URL.createObjectURL(file);
        });

        accountChangeAvatarModal.addEventListener('click', (e) => {
            if(e.target == accountChangeAvatarModal){
                closeAccountChangeAvatarModal();
            }
        })


        avatarSaveButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const file = avatarFileInput.files[0];
            if (!file) {
                console.log("No custom image set.");
                return;
            }

            uploadAvatar(file)
            closeAccountChangeAvatarModal();
            displayAccountInfo();
        });
    }
    catch(error){
        console.log('Error in displaying Avatar Modal: ', error);
    }
}



//Account Delete
accountDeleteButton.addEventListener('click', () => {
    displayAccountDeleteModal();

});

function displayAccountDeleteModal(){
    openAccountDeleteModal();

    accountDeleteConfirmButton.addEventListener('click', async () => {
        try{
            await deleteCurrentUser();
            console.log('Account deleted!');
            closeAccountDeleteModal();
            window.location.href = 'index.html';
        }
        catch(error){
            console.log('Error in deleting account: ', error);
        }
    });

    accountDeleteCancelButton.addEventListener('click', () => {
        closeAccountDeleteModal();
    });

    accountDeleteModal.addEventListener('click', (e) => {
        if(e.target == accountDeleteModal){
            closeAccountDeleteModal()
        }
    });
}




//Different Modal handlers

//Closes the account modify modal
function closeAccountModifyModal(){
    accountEditModal.classList.add('hidden');
}


function openAccountChangeAvatarModal(){
    accountChangeAvatarModal.classList.remove('hidden');
}

function closeAccountChangeAvatarModal(){
    accountChangeAvatarModal.classList.add('hidden');
    avatarFileInput.value = '';
}


function openAccountDeleteModal(){
    accountDeleteModal.classList.remove('hidden');
}

function closeAccountDeleteModal(){
    accountDeleteModal.classList.add('hidden');
}