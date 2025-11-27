'use strict';

import { getAccountInfoByToken } from './account.js';
import { getToken } from './auth-handler.js';
import { HamburgerMenu, themeModeButton, updateHamburgerMenuOptions } from './hamburger-menu.js';
import { getRestaurants, getRestaurant, getDailyMenu, getWeeklyMenu} from './restaurants.js';


const btnMainToMap = document.getElementById('main-page-to-map-button');


//Favorite Dish Section
const favRestaurantName = document.getElementById('fav-restaurant-title');
const favRestaurantText = document.getElementById('fav-restaurant-text');


//Three Restaurants
const closestRestaurantsContainer = document.getElementById('closest-restaurants-container');
const suggestLocation = document.getElementById('suggest-location');

btnMainToMap.addEventListener('click',() => {

    window.location.href = './map.html';
    
});

function initialize(){
    themeModeButton();
    HamburgerMenu();
    updateHamburgerMenuOptions();
    getClosestRestaurants();
    updateFavDishText();

    //Random delete
    getRestaurants();
    //getRestaurant('6470d38ecb12107db6fe24c2');
    getDailyMenu('6470d38ecb12107db6fe24c2', 'en');
    getWeeklyMenu('6470d38ecb12107db6fe24c2', 'en');

}

initialize();







async function updateFavDishText(){
    const token = getToken();

    if(!favRestaurantName || !favRestaurantText){
        return;
    }

    if(!token){
        return;
    }

    const accountData = await getAccountInfoByToken(token);

    let favRestaurantNameToDisplay = '';
    let favRestaurantTextToDisplay = '';
    let userHasFavoriteSet = false;

    if(accountData.favouriteRestaurant){
        //console.log(accountData.favouriteRestaurant)
        const getRestaurantName = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/${accountData.favouriteRestaurant}`);
        if(getRestaurantName.ok){
            const favouriteRestaurantName = await getRestaurantName.json();
            userHasFavoriteSet = true;
            favRestaurantNameToDisplay = favouriteRestaurantName.name || 'No Restaurant name';
            favRestaurantTextToDisplay = `A place you always come back to. Explore specials, browse reviews, or find dishes that match its style. Change your favorite anytime — we'll keep things sharp and organized for you.`;
        }
        
        if(userHasFavoriteSet == true){
            favRestaurantName.textContent =
                    `${favRestaurantNameToDisplay}`;

            favRestaurantText.textContent = 
                    `${favRestaurantTextToDisplay}`;
        }
        else{
            favRestaurantName.textContent =
                    `Choose Your Favorite Restaurant`;

            favRestaurantText.textContent = 
                    `Browse the list of student-recommended spots and mark your favorite. When you do, it will be highlighted here for easy access whenever you return.`;
        }
    }
    else{
        console.log('Logged in but no favoriterestaurant')
    }
}




async function getClosestRestaurants(){
    //const token = getToken();

    //if(!token){
    //    console.log('Not logged in!')
    //    return;
    //}

    if(!navigator.geolocation){
        console.log('Unable to get users geolocation');
        return;
    }

    console.log(navigator.geolocation);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            console.log('User location: ', lat, lon);

            const allRestaurants = await getRestaurants();
            const closestThreeRestaurants = get3ClosestRestaurant(allRestaurants, lat, lon);

            console.log('closest 3 restaurants:', closestThreeRestaurants);
            suggestLocation.classList.add('hidden');
            displayClosestThreeRestaurants(closestThreeRestaurants);
        },
        (error) => {
            console.error('Geolocation error:', error.message);
            //displayDefaultThreeRestaurants();
        }
    )
}


function getDistanceInKm(lat1, lon1, lat2, lon2){
    const R = 6371;
    const toRad = (val) => (val * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}


function get3ClosestRestaurant(restaurants, userLat, userLon){
    const distances = restaurants.map(r => {
        const restaurantLon = r.location.coordinates[0];
        const restaurantLat = r.location.coordinates[1];

        return {
            ...r,
            distance: getDistanceInKm(userLat, userLon, restaurantLat, restaurantLon)
        };
    });

    return distances.sort((a, b) => a.distance - b.distance).slice(0, 3);
}

function displayClosestThreeRestaurants(threeRestaurants){
    closestRestaurantsContainer.replaceChildren();

    const bannerImages = [
        'images/banners/closestRestaurant1.png',
        'images/banners/closestRestaurant2.png',
        'images/banners/closestRestaurant3.png'
    ];

    threeRestaurants.forEach((r, i) => {
        const card = document.createElement('div');
        card.classList.add('closest-restaurant-card');

        const img = document.createElement('img');
        img.src = bannerImages[i] || 'images/banners/default-restaurant.png';
        img.alt = `Image of ${r.name}`;

        const h3 = document.createElement('h3');
        h3.textContent = r.name;

        const p = document.createElement('p');
        p.textContent = r.distance ? `${r.distance.toFixed(1)} km away` : 'Distance unknown';

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(p);

        /*
        card.textContent = 
        `
        <h3>${r.name}</h3>
        <p>${r.distance.toFixed(1)} km away</p>
        `;
        */

        closestRestaurantsContainer.appendChild(card);
    });
}



//function displayDefaultThreeRestaurants(){
//
//}