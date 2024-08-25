const closeBtn = document.querySelector('#recipe-close-btn');
const mealDet = document.querySelector('.meal-details');
const recipeBtn = document.querySelectorAll('.recipe-btn');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('#search-btn');
const searchResults = document.querySelector('.search-results');
const errDisplay = document.querySelector('.errDisplay');
const foodResults = document.querySelector('.food-results');
const mealDetailsCon = document.querySelector('.meal-details-con');
 

searchBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const mealSearch = searchInput.value;

    if(mealSearch) {
        try {
            const meal = await getMealData();
            displayMealInfo(meal);
        } catch(err) {
            console.log(err);
            displayError(err);
        } 
    } else {
        displayError('Please enter a meal!')
    }
})

closeBtn.addEventListener('click', () => {
    mealDet.style.display = 'none';
})

foodResults.addEventListener('click', async (e) => {
    e.preventDefault();

    if(e.target.classList.contains('recipe-link')) {
        try {
            const recipe = await getMealRecipe(e);
            displayMealRecipe(recipe);
        } catch(err) {
            console.log(err);
        }
    }
})

async function getMealData() {
    const mealSearch = searchInput.value;

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealSearch}`;

    const response = await fetch(apiUrl);

    if(!response.ok) {
        throw new Error('could not fetch data');
    }

    return response.json();
}

function displayMealInfo(data) {
    console.log(data);

    let html = '';

    if(data.meals) {
        data.meals.forEach(meal => {
            html += `
            <div class="cards" data-id="${meal.idMeal}">
                <div class="card-img">
                    <img src="${meal.strMealThumb}" alt="food">
                </div>

                <div class="card-desc">
                    <h3>${meal.strMeal}</h3>
                    <button class="recipe-btn"><a href = "#" class="recipe-link">Get Recipe</a></button>
                </div>
            </div>
            `;
            errDisplay.style.display = 'none';
        })
    } else {
        const notFound = document.createTextNode('Sorry, we did not find any meal!');
        
        errDisplay.textContent = '';
        errDisplay.style.display = 'block';
        errDisplay.appendChild(notFound);
    }

    foodResults.innerHTML = html;
}

async function getMealRecipe(e) {
    let cardItem = e.target.parentElement.parentElement.parentElement;
    
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${cardItem.dataset.id}`;

    const response = await fetch(apiUrl);

    if(!response.ok) {
        throw new Error('Could not fetch data');
    }

    return response.json();
}

function displayMealRecipe(data) {
    console.log(data);


    if(data.meals) {
        data.meals.forEach(meal => {

        let html = `
            <h2 class="meal-title">${meal.strMeal}</h2>
            <span class="meal-category">${meal.strCategory}</span>

                    <div class = "recipe-instruct">
                        <h4>Instructions:</h4>
                        <p>${meal.strInstructions}</p>

                        <div class = "recipe-meal-img">
                            <img src = "${meal.strMealThumb}" alt = "picture">
                        </div>
                        
                        <div class = "recipe-link">
                            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
                        </div>
                    </div>
            `;
        mealDetailsCon.innerHTML = html;
        mealDet.style.display = 'block';
        })
    }

}

function displayError(message) {
    const errMsg = document.createTextNode(message);
    
    errDisplay.textContent = '';
    errDisplay.style.display = 'block';
    errDisplay.appendChild(errMsg);

    foodResults.innerHTML = '';
}