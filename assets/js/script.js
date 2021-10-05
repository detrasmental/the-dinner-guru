
let userInputEl = document.querySelector("#user-form");
let ingredientInputEl = document.querySelector("#ingredient-input");
let recipeNameEl = document.getElementById("card-title");
let recipeImageEl = document.getElementById("slideshow-img");
let slideIndex = 0;
let nextSlideEl = document.getElementById("next-btn");
let backSlideEl = document.getElementById("previous-btn");

let formSubmitHandler = function(event) {
    event.preventDefault();
    let ingredient = ingredientInputEl.value.trim();

    if (ingredient) {
        slideIndex = 0;
        getRecipesAlt(ingredient);
        ingredientInputEl.value = "";
    } else {
        alert("Please enter an ingredient!");
    }
};

let getRecipesAlt = function(ingredient) {
    let apiUrl = "https://themealdb.com/api/json/v1/1/filter.php?i=" + ingredient;
    
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            localStorage.setItem("workingArray", JSON.stringify(data));
            localStorage.setItem("workingIngredient", ingredient);
            console.log(data);
            displayRecipeAlt(data, ingredient, slideIndex);
        })
    })
};

let getRecipes = function(ingredient) {
    let apiUrl = "https://api.edamam.com/api/recipes/v2?type=public&q=" + ingredient + "&app_id=601299ac&app_key=dbffb2825d4c8e890654357d700825bf&imageSize=REGULAR";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            localStorage.setItem("workingArray", JSON.stringify(data));
            localStorage.setItem("workingIngredient", ingredient);
            displayRecipeAlt(data, ingredient, slideIndex);
        })
    });
};

userInputEl.addEventListener("submit", formSubmitHandler);

let displayRecipeAlt = function(data, ingredient, i) {
    let recipeName = data.meals[i].strMeal;
    let recipeImage = data.meals[i].strMealThumb;
    
    recipeNameEl.textContent = recipeName;
    recipeImageEl.src = recipeImage;
    document.querySelector(".slideshow-container").classList.remove("hide");
};

let displayRecipe = function(data, ingredient, i) {
    let recipeName = data.hits[i].recipe.label;
    let recipeImage = data.hits[i].recipe.image;
    
    recipeNameEl.textContent = recipeName;
    recipeImageEl.src = recipeImage;
    document.querySelector(".slideshow-container").classList.remove("hide");
};

let nextSlide = function() {
    slideIndex++;
    if (slideIndex > 19) {slideIndex = 0};
    displayRecipe(JSON.parse(localStorage.getItem("workingArray")), localStorage.getItem("workingIngredient"), slideIndex);
};

let backSlide = function() {
    slideIndex--;
    if (slideIndex < 0) {slideIndex = 19};
    displayRecipe(JSON.parse(localStorage.getItem("workingArray")), localStorage.getItem("workingIngredient"), slideIndex);
};

nextSlideEl.addEventListener("click", nextSlide);
backSlideEl.addEventListener("click", backSlide);
