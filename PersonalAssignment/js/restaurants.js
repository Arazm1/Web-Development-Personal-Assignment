'use strict';

import { getToken } from "./auth-handler.js";

const baseURL = 'https://media2.edu.metropolia.fi/restaurant/api/v1';

export async function getRestaurants(){
    const response = await fetch(`${baseURL}/restaurants`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in fetching restaurants');
    }

    const data = await response.json();
    //console.log(data);
    return data;
}


export async function getRestaurant(restaurantID){
    const response = await fetch(`${baseURL}/restaurants/${restaurantID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in fetching daily menu');
    }

    const data = await response.json();
    //console.log(data);
    return data;
}



export async function getDailyMenu(restaurantID, language) {

    const response = await fetch(`${baseURL}/restaurants/daily/${restaurantID}/${language}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in fetching daily menu');
    }

    const data = await response.json();
    //console.log(data);
    return data;
}


export async function getWeeklyMenu(restaurantID, language){

    const response = await fetch(`${baseURL}/restaurants/weekly/${restaurantID}/${language}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.message || 'Error in fetching weekly menu');
    }

    const data = await response.json();
    //console.log(data);
    return data;
}


export async function setFavoriteRestaurant(restaurant){
    try{
        const url = `https://media2.edu.metropolia.fi/restaurant/api/v1/users`;

        const token = getToken();
        if(!token){
            console.log('No token');
            return;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                favouriteRestaurant: restaurant
            }),
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(error.message || 'Error in updating favorite restaurant.');
        }

        const data = await response.json();
        //console.log('Favorite restaurant set!');
        //console.log('Favorite restaurant set!', data);
        return data;
    }
    catch(error){
        console.log('Error in setting favorite restaurant: ', error);
    }
}







