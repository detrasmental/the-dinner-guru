
let userInputEl = document.querySelector("#user-form");
let ingredientInputEl = document.querySelector("#ingredient-input");
let recipeNameEl = document.getElementById("card-title");
let recipeImageEl = document.getElementById("slideshow-img");
let slideIndex = 0;
let nextSlideEl = document.getElementById("next-btn");
let backSlideEl = document.getElementById("previous-btn");
let favoriteEl = document.getElementById("favorite-btn");

// Takes in user search term
let formSubmitHandler = function(event) {
    event.preventDefault();
    let ingredient = ingredientInputEl.value.trim();

    if (ingredient) {
        slideIndex = 0;
        getRecipes(ingredient);
        getRecipesAlt(ingredient);
        ingredientInputEl.value = "";
    } else {
        alert("Please enter an ingredient!");
    }
};

// Requests data from our first api, saves to local storage, and then calls displayRecipe() function
let getRecipes = function(ingredient) {
    let apiUrl = "https://api.edamam.com/api/recipes/v2?type=public&q=" + ingredient + "&app_id=601299ac&app_key=dbffb2825d4c8e890654357d700825bf&imageSize=REGULAR";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            localStorage.setItem("workingArray", JSON.stringify(data));
            localStorage.setItem("workingIngredient", ingredient);
            displayRecipe(data, ingredient, slideIndex);
        })
    });
};

// displays recipes from our first api
let displayRecipe = function(data, ingredient, i) {
    let recipeName = data.hits[i].recipe.label;
    let recipeImage = data.hits[i].recipe.image;
    
    recipeNameEl.textContent = recipeName;
    recipeImageEl.src = recipeImage;
    document.querySelector(".slideshow-container").classList.remove("hide");
};

// Launches formSubmitHandler() function
userInputEl.addEventListener("submit", formSubmitHandler);

// requests data from our second api and saves it to alternate localStorage
let getRecipesAlt = function(ingredient) {
    let apiUrl = "https://themealdb.com/api/json/v1/1/filter.php?i=" + ingredient;
    
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            localStorage.setItem("workingArrayAlt", JSON.stringify(data));
            localStorage.setItem("workingIngredientAlt", ingredient);
        })
    })
};

// displays our second api results in a continuous loop with our first api results
let displayRecipeAlt = function(data, ingredient, i) {
    if (i >= 0 && i < data.meals.length) {
        let recipeName = data.meals[i].strMeal;
        let recipeImage = data.meals[i].strMealThumb;
    
        recipeNameEl.textContent = recipeName;
        recipeImageEl.src = recipeImage;
        
    } else if (i >= data.meals.length) {
        slideIndex = -1;
        nextSlide();
    
    } else if (i < 0 && -i <= data.meals.length) {
        let recipeName = data.meals[data.meals.length + i].strMeal;
        let recipeImage = data.meals[data.meals.length + i].strMealThumb;
    
        recipeNameEl.textContent = recipeName;
        recipeImageEl.src = recipeImage;
    
    } else if (i < 0 && -i > data.meals.length) {
        slideIndex = 20
        backSlide();
    }
};

// Increments slideIndex and displays the next slide from either api
let nextSlide = function() {
    slideIndex++;
    if (slideIndex >= 0 && slideIndex <= 19) {
    displayRecipe(JSON.parse(localStorage.getItem("workingArray")), localStorage.getItem("workingIngredient"), slideIndex);
    } else if (slideIndex > 19) {
        displayRecipeAlt(JSON.parse(localStorage.getItem("workingArrayAlt")), localStorage.getItem("workingIngredientAlt"), slideIndex - 20);
    }
};

// Decrements slideIndex and displays the previous slide from either api
let backSlide = function() {
    slideIndex--;
    if (slideIndex >= 0 && slideIndex <= 19) {
    displayRecipe(JSON.parse(localStorage.getItem("workingArray")), localStorage.getItem("workingIngredient"), slideIndex);
    } else if (slideIndex < 0) {
        displayRecipeAlt(JSON.parse(localStorage.getItem("workingArrayAlt")), localStorage.getItem("workingIngredientAlt"), slideIndex);
    }
};
// User input for the slide display functions
nextSlideEl.addEventListener("click", nextSlide);
backSlideEl.addEventListener("click", backSlide);

let addFavorite = function() {
    if (localStorage.getItem("favoriteRecipes") === null) {
        let favoriteRecipes = [];
        favoriteRecipes[0] = recipeNameEl.textContent;
        localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
    }
    else {
        let oldRecipes = JSON.parse(localStorage.getItem("favoriteRecipes"));
        let newRecipe = recipeNameEl.textContent;
        oldRecipes.push(newRecipe);
        localStorage.setItem("favoriteRecipes", JSON.stringify(oldRecipes));
    }
};

favoriteEl.addEventListener("click", addFavorite);