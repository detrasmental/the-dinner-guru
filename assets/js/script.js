
let userInputEl = document.querySelector("#user-form");
let ingredientInputEl = document.querySelector("#ingredient-input");
let recipeNameEl = document.getElementById("card-title");
let recipeImageEl = document.getElementById("slideshow-img");
let slideIndex = 0;
let nextSlideEl = document.getElementById("next-btn");
let backSlideEl = document.getElementById("previous-btn");
let favoriteEl = document.getElementById("favorite-btn");
let myRecipesEl = document.getElementById("my-recipes");
let recipeLinkEl = document.querySelector(".view-btn");
let homepageEl = document.querySelector(".navbar-item");

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
    let recipeLink = data.hits[i].recipe.url;

    recipeNameEl.textContent = recipeName;
    recipeImageEl.src = recipeImage;
    recipeLinkEl.setAttribute("href", recipeLink);
    recipeLinkEl.setAttribute("target", "_blank");
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
        let mealDBDetails = "https://themealdb.com/api/json/v1/1/lookup.php?i=" + data.meals[i].idMeal;
        let recipeName = data.meals[i].strMeal;
        let recipeImage = data.meals[i].strMealThumb;
// Performs an additional request from themealdb to load the recipe's source url
        fetch(mealDBDetails).then(function(response) {
            response.json().then(function(recipe) {
                recipeLinkEl.setAttribute("href", recipe.meals[0].strSource);
                recipeLinkEl.setAttribute("target", "_blank");
        })});
        recipeNameEl.textContent = recipeName;
        recipeImageEl.src = recipeImage;
        
    } else if (i >= data.meals.length) {
        slideIndex = -1;
        nextSlide();
    
    } else if (i < 0 && -i <= data.meals.length) {
        let mealDBDetails = "https://themealdb.com/api/json/v1/1/lookup.php?i=" + data.meals[data.meals.length + i].idMeal;

        let recipeName = data.meals[data.meals.length + i].strMeal;
        let recipeImage = data.meals[data.meals.length + i].strMealThumb;
// Performs an additional request from themealdb to load the recipe's source url  
        fetch(mealDBDetails).then(function(response) {
            response.json().then(function(recipe) {
                recipeLinkEl.setAttribute("href", recipe.meals[0].strSource);
                recipeLinkEl.setAttribute("target", "_blank");
        })});

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

// If there aren't yet recipes saved to local storage, this function initializes the array. Otherwise, it simply pushes the new item to the array.
let addFavorite = function() {
    if (localStorage.getItem("favoriteRecipes") === null) {
        let favoriteRecipes = [];
        let favoriteRecipesSource = [];
        favoriteRecipes[0] = recipeNameEl.textContent;
        favoriteRecipesSource[0] = recipeLinkEl.href;
        localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
        localStorage.setItem("favoriteRecipesSource", JSON.stringify(favoriteRecipesSource));
    }
    else {
        let oldRecipes = JSON.parse(localStorage.getItem("favoriteRecipes"));
        let oldRecipesSource = JSON.parse(localStorage.getItem("favoriteRecipesSource"));
        let newRecipe = recipeNameEl.textContent;
        let newRecipeSource = recipeLinkEl.href;
        for (var i = 0; i < oldRecipes.length; i++) {
            if (newRecipe === oldRecipes[i]) {
                return null;
            }
        };
        oldRecipes.push(newRecipe);
        oldRecipesSource.push(newRecipeSource);
        localStorage.setItem("favoriteRecipes", JSON.stringify(oldRecipes));
        localStorage.setItem("favoriteRecipesSource", JSON.stringify(oldRecipesSource));
    }
};

// Launches addFavorite() function
favoriteEl.addEventListener("click", addFavorite);

let displayFavoriteRecipes = function(event) {
    event.preventDefault();
    let recipesListEl = document.querySelector(".recipes-list");
    recipesListEl.textContent = "";
    document.querySelector(".form-container").classList.add("hide");
    document.querySelector(".slideshow-container").classList.add("hide");
    document.querySelector(".favorites-container").classList.remove("hide");
    
    let oldRecipes = JSON.parse(localStorage.getItem("favoriteRecipes"));
    let oldRecipesSource = JSON.parse(localStorage.getItem("favoriteRecipesSource"));
    
    for (i = 0; i < oldRecipes.length; i++) {
        let recipeItem = document.createElement("li");
        recipeItem.innerHTML = '<a href="' + oldRecipesSource[i] + '" target="_blank">' + oldRecipes[i] + '</a>';
        document.querySelector(".recipes-list").appendChild(recipeItem);
    }
};

myRecipesEl.addEventListener("click", displayFavoriteRecipes);

let launchSearch = function(event) {
    event.preventDefault();
    document.querySelector(".form-container").classList.remove("hide");
    document.querySelector(".favorites-container").classList.add("hide");
    let recipesListEl = document.querySelector(".recipes-list");
    recipesListEl.textContent = "";
}

homepageEl.addEventListener("click", launchSearch);
