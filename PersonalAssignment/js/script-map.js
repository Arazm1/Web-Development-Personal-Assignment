'use strict';

import { getRestaurants, getDailyMenu, getWeeklyMenu, setFavoriteRestaurant } from "./restaurants.js";
import { HamburgerMenu, updateHamburgerMenuOptions } from './hamburger-menu.js';


HamburgerMenu();
updateHamburgerMenuOptions()

var map = L.map('map').setView([60.17, 24.94], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let optionChosen = 'map';
const mapViewButton = document.getElementById('map-view-button');
const filterViewButton = document.getElementById('filter-view-button');

const mapView = document.getElementById('map-section');
const filterView = document.getElementById('daily-filter-section');

mapViewButton.addEventListener('click', () => {
    if(optionChosen == 'map'){
        return;
    }
    if(optionChosen == 'filter'){
        displayMapView();
    }

});

filterViewButton.addEventListener('click', () =>{
    if(optionChosen == 'filter'){
        return;
    }
    if(optionChosen == 'map'){
        displayFilterView();
        
    }

});







//Option 1 - Search By Map
const opt1RestaurantList = document.getElementById('opt1-restaurant-list');

async function opt1ListRestaurant(){
    const ul = document.getElementById('opt1-restaurants-ul');

    ul.replaceChildren();

    try{
        const restaurants = await getRestaurants();
        //console.log(restaurants);

        restaurants.forEach(restaurant => {
            //Displays on the list
            const li = document.createElement('li');
            li.textContent = restaurant.name;

            li.addEventListener('click', () => {
                opt1OpenModalForRestaurant(restaurant)
            });

            ul.appendChild(li);

            //
            const [longitude, latitude] = restaurant.location.coordinates;
            const marker = L.marker([latitude, longitude]).addTo(map);
            
            //marker.on('click', () => {
            //    opt1OpenModalForRestaurant(restaurant);
            //});

            const markerContent = 
                        `
                        <h3>${restaurant.name}</h3>
                        <p>${restaurant.address}</p>
                        <p>${restaurant.city} ${restaurant.postalCode}</p>
                        <button class="popup-open-modal-btn">View Details</button>
                        `;
            
            marker.bindPopup(markerContent);

            marker.on('popupopen', () => {
            // When popup opens, attach click listener to the button
            const btn = document.querySelector('.popup-open-modal-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    opt1OpenModalForRestaurant(restaurant);
                });
            }
        });


                        /*
            marker.bindPopup(
                `<h3>${restaurant.name}</h3>
                <p>${restaurant.address}</p>
                <p>${restaurant.city} ${restaurant.postalCode}</p>`);*/

        });
    }
    catch(error){
        console.log(error || 'Error in fetching restaurants, map.js')
    }
}

const opt1RestaurantModal = document.getElementById('opt1-restaurant-modal');
const opt1CloseBtn = document.getElementById('modal-close');
const opt1ModalRName = document.getElementById('opt1-modal-r-name');
const opt1ModalRAddress = document.getElementById('opt1-modal-r-address');
const opt1ModalRCity = document.getElementById('opt1-modal-r-city');
const opt1ModalRPhone = document.getElementById('opt1-modal-r-phone');
const opt1ModalRCompany = document.getElementById('opt1-modal-r-company');
//Modal when clicking restaurant buttons
let opt1SetFavRestaurant = document.getElementById('opt1-set-fav-restaurant');
const opt1ModalDailyMenuButton = document.getElementById('opt1-modal-daily-btn');
const opt1ModalWeeklyMenuButton = document.getElementById('opt1-modal-weekly-btn');


//Option 1 Modal
function opt1OpenModalForRestaurant(restaurant){
    opt1RestaurantModal.classList.remove('hidden');

    /*
    opt1ModalRName.textContent = restaurant.name && restaurant.name != '-' ? restaurant.name : 'No Restaurant Name available';
    opt1ModalRAddress.textContent = restaurant.address && restaurant.address != '-' ? restaurant.address : 'No Address available';
    opt1ModalRCity.textContent = restaurant.city && restaurant.city != '-' ? restaurant.city : 'No City available';
    opt1ModalRPhone.textContent = restaurant.phone && restaurant.phone != '-' ? restaurant.phone : 'No Phone number available';
    opt1ModalRCompany.textContent = restaurant.company && restaurant.company != '-' ? restaurant.company : 'No Company available';
    */

    opt1SetModalContent(opt1ModalRName, restaurant.name, "No Restaurant Name available");
    opt1SetModalContent(opt1ModalRAddress, restaurant.address, "No Address available");
    opt1SetModalContent(opt1ModalRCity, restaurant.city, "No City available");
    opt1SetModalContent(opt1ModalRPhone, restaurant.phone, "No Phone number available");
    opt1SetModalContent(opt1ModalRCompany, restaurant.company, "No Company available");

    opt1CloseBtn.addEventListener('click', () => {
        closeOpt1RestaurantModal();
    });

    opt1RestaurantModal.addEventListener('click', (e) => {
        if (!restaurantMenuContent.contains(e.target)) {
            closeOpt1RestaurantModal();
        }
    });

    opt1ModalDailyMenuButton.addEventListener('click', () => {
        closeOpt1RestaurantModal();

        openRestaurantDailyMenu(restaurant);
    });

    opt1ModalWeeklyMenuButton.addEventListener('click', () => {
        closeOpt1RestaurantModal();

        openRestaurantWeeklyMenu(restaurant);
    });

    opt1SetFavRestaurant.removeEventListener('click', handleSetFavoriteRestaurant);

    /*
    opt1SetFavRestaurant.addEventListener('click', () => {
        handleSetFavoriteRestaurant(restaurant);
        //setFavoriteRestaurant(restaurant._id); });
    });
    */


    const newFavBtn = opt1SetFavRestaurant.cloneNode(true);
    opt1SetFavRestaurant.replaceWith(newFavBtn);

    newFavBtn.addEventListener('click', () => {
        setFavoriteRestaurant(restaurant._id);
    });

    // Update reference
    opt1SetFavRestaurant = newFavBtn;
    

    
}



//Either gets data from API and displays it or uses fallback
function opt1SetModalContent(element, value, fallback){
    const invalid = !value || value.trim() == '-' || value.trim() == '';

    element.textContent = invalid ? fallback : value.trim();

    element.classList.toggle('opt1-modal-content-unavailable', invalid);
}





//Not sure when this supposed to be opened so currently workaround is to just call them here
opt1ListRestaurant();
opt2ListRestaurants();

let opt2AllRestaurants = [];
const opt2RestaurantUl = document.getElementById('opt2-restaurant-ul');

//Filters
//Daily - Weekly
const dailyWeeklyButtons = document.querySelectorAll('#daily-weekly-buttons button');
let selectedMenuType = 'daily';

//Cities
const cityFilter = document.getElementById('filter-city');

//Provider
const providerFilter = document.getElementById('filter-provider');

//Distance

//Apply filters
const applyFiltersButton = document.getElementById('apply-filters');





dailyWeeklyButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedMenuType = button.textContent.toLowerCase().includes('daily') ? 'daily' : 'weekly';
        

        dailyWeeklyButtons.forEach(btn => {
            btn.classList.add('daily-weekly-button')
            btn.classList.remove('daily-weekly-active')
        });
        button.classList.add('daily-weekly-active');
    
    });

    
});




applyFiltersButton.addEventListener('click', () => {
    let filteredRestaurants = opt2AllRestaurants;

    //Daily / Weekly
    filteredRestaurants = filteredRestaurants.filter(r => {
        //Most likely useless
        if(selectedMenuType == 'daily'){
            //function daily menus
            return getDailyMenu(r._id, 'en');
        }
        else{
            return getWeeklyMenu(r._id, 'en');
        }
    });

   //City
   const selectedCity = cityFilter.value;
   if(selectedCity != 'All'){
    filteredRestaurants = filteredRestaurants.filter(r => r.city == selectedCity);
   }

    const selectedProvider = providerFilter.value;
    switch(selectedProvider){
        case 'All Providers':
            break;
        case 'Sodexo':
            console.log('Sodexo')
            filteredRestaurants = filteredRestaurants.filter(r => r.company == selectedProvider);
            break;
        case 'Compass Group':
            console.log('Compass Group')
            filteredRestaurants = filteredRestaurants.filter(r => r.company == selectedProvider);
            break;
        default:
            console.log('Switch case selected provider - DEFAULT');
            break;
    }

    renderRestaurantsList(filteredRestaurants);

});


async function opt2ListRestaurants(){
    opt2AllRestaurants = await getRestaurants();
    
    renderRestaurantsList(opt2AllRestaurants);
    renderRestaurantsProvidersList(opt2AllRestaurants);
    renderRestaurantsCitiesList(opt2AllRestaurants);
    console.log(opt2AllRestaurants);
}

function renderRestaurantsList(restaurants){
    opt2RestaurantUl.replaceChildren();

    restaurants.forEach(restaurant => {
        const li = document.createElement('li');
        li.textContent = restaurant.name;
        opt2RestaurantUl.appendChild(li);



        li.addEventListener('click', () =>{
        console.log("Opened sum", restaurant.name);
        openRestaurantMenuModal(restaurant)
        })
    }); 
}


function renderRestaurantsCitiesList(restaurants){
    const filterByCitySelect = document.getElementById('filter-city');
    const optionAll = document.createElement('option');

    const cities = [...new Set(
        restaurants
                .map(r => r.city)
                .filter(c => c && c.trim != '-')
                .sort()
    )];

    filterByCitySelect.replaceChildren();

    optionAll.textContent = 'All Cities';
    filterByCitySelect.append(optionAll);

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        filterByCitySelect.append(option);
    });
}

function renderRestaurantsProvidersList(restaurants){
    const filterByProviderSelect = document.getElementById('filter-provider');
    const optionAll = document.createElement('option');



    const providers = [...new Set(
        restaurants
                .map(r => r.company)
                .filter(c => c && c.trim() != '-')
    )];
    /*
   const providers = restaurants
                .map(r => r.company)
                .filter(c => c && c.trim() != '-');
    */
    

    filterByProviderSelect.replaceChildren();

    //console.log('providers', providers);
    optionAll.textContent = 'All Providers';
    filterByProviderSelect.appendChild(optionAll);

    providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider;
        option.textContent = provider;
        filterByProviderSelect.append(option);
    });
}


//Restaurant Menu
const restaurantMenuModal = document.getElementById('restaurant-menu-modal');
const restaurantMenuContent = document.getElementById('restaurant-menu-content');
const restaurantMenuModalTitle = document.getElementById('restaurant-menu-modal-title');
const restaurantMenuModalBody = document.getElementById('restaurant-menu-modal-body');
const restaurantMenuModalCloseButton = document.getElementById('menu-modal-close-button')



//Chooses which to open!
function openRestaurantMenuModal(restaurant){
    if(selectedMenuType == 'daily'){
        openRestaurantDailyMenu(restaurant);
    }
    else{
        openRestaurantWeeklyMenu(restaurant);
    }
}

async function openRestaurantDailyMenu(restaurant){
    restaurantMenuModalTitle.textContent = `Daily Menu for ${restaurant.name}`;

    restaurantMenuModalBody.replaceChildren();

    const dailyMenuData = await getDailyMenu(restaurant._id, 'fi');
    const dailyFoodCourses = dailyMenuData.courses;

    /*
    if (dailyFoodCourses.length == 0) {
        console.log(`No daily menu available for ${restaurant.name}`);
        return; // stop function, modal won't open
    }
    */

    restaurantMenuModal.classList.remove('hidden');

    dailyFoodCourses.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.classList.add('daily-item');

        const foodName = document.createElement('p');
        foodName.textContent = `Dish: ${food.name}`;

        const foodPrice = document.createElement('p');
        foodPrice.textContent = `Price: ${food.price}`

        const foodDiets = document.createElement('p');
        foodDiets.textContent = `Diets: ${food.diets}`;

        foodItem.appendChild(foodName);
        foodItem.appendChild(foodPrice);
        foodItem.appendChild(foodDiets);

        restaurantMenuModalBody.appendChild(foodItem);
    });
    

    restaurantMenuModal.addEventListener('click', (e) => {
        if (!restaurantMenuContent.contains(e.target)) {
            restaurantMenuModal.classList.add('hidden');
        }
    });

    restaurantMenuModalCloseButton.addEventListener('click', () => {
        restaurantMenuModal.classList.add('hidden');
    });
}

async function openRestaurantWeeklyMenu(restaurant){
    //console.log('Weekly menu opened: ', restaurant.name);
    restaurantMenuModalTitle.textContent = 'Weekly Menu for ' + restaurant.name;

    restaurantMenuModalBody.replaceChildren();

    const WeeklyMenuData = await getWeeklyMenu(restaurant._id, 'fi');
    const WeeklyFoodCourses = WeeklyMenuData.days;

    if (!WeeklyFoodCourses || WeeklyFoodCourses.length === 0) {
        console.log(`No weekly menu available for ${restaurant.name}`);
        return;
    }

    //console.log(WeeklyFoodCourses);
    restaurantMenuModal.classList.remove('hidden');

    WeeklyFoodCourses.forEach(day => {
        const dayContainer = document.createElement('div');
        dayContainer.classList.add('weekly-day');

        if(day.date){
            const dayText = document.createElement('h3');
            dayText.textContent = day.date;
            dayText.classList.add('weekly-day-title');
            dayContainer.appendChild(dayText);
        }


        day.courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.classList.add('weekly-item');

            const courseName = document.createElement('p');
            courseName.textContent = `Dish: ${course.name}`;

            const coursePrice = document.createElement('p');
            coursePrice.textContent = `Price: ${course.price}`;

            const courseDiets = document.createElement('p');
            courseDiets.textContent = `Diets: ${course.diets}`;


            courseItem.appendChild(courseName);
            courseItem.appendChild(coursePrice);
            courseItem.appendChild(courseDiets);

            dayContainer.appendChild(courseItem);

        });

        restaurantMenuModalBody.appendChild(dayContainer);
    });

    restaurantMenuModalCloseButton.addEventListener('click', () => {
        restaurantMenuModal.classList.add('hidden');
    });
}




//Small handling functions
function displayMapView(){
    filterView.classList.add('hidden');
    mapView.classList.remove('hidden');
    optionChosen = 'map';
    filterViewButton.classList.remove('option-btn-active');
    filterViewButton.classList.add('option-btn');
    mapViewButton.classList.remove('option-btn');
    mapViewButton.classList.add('option-btn-active');
}

function displayFilterView(){
    mapView.classList.add('hidden');
    filterView.classList.remove('hidden');
    optionChosen = 'filter';
    mapViewButton.classList.remove('option-btn-active');
    mapViewButton.classList.add('option-btn');
    filterViewButton.classList.remove('option-btn');
    filterViewButton.classList.add('option-btn-active');
}

function closeOpt1RestaurantModal(){
    opt1RestaurantModal.classList.add('hidden');
}

function handleSetFavoriteRestaurant(restaurant){
    console.log(restaurant._id);
    setFavoriteRestaurant(restaurant._id);
}


function handleSetFav() {
    setNewFavoriteRestaurant(currentRestaurant);
}