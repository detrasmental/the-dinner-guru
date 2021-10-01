let userInputEl = document.querySelector("#user-form");
let ingredientInputEl = document.querySelector("#ingredient");
let recipeContainerEl = document.querySelector("#recipes-container");
let recipeBaseIngredient = document.querySelector("#recipe-base-ingredient");

let formSubmitHandler = function(event) {
    event.preventDefault();
    let ingredient = ingredientInputEl.value.trim();

    if (ingredient) {
        getRecipes(ingredient);
        ingredientInputEl.value = "";
    } else {
        alert("Please enter an ingredient!");
    }
};

let getRecipes = function(ingredient) {
    let apiUrl = "https://api.edamam.com/api/recipes/v2?type=public&q=" + ingredient + "&app_id=601299ac&app_key=dbffb2825d4c8e890654357d700825bf";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data, ingredient);
        })
    });
};

userInputEl.addEventListener("submit", formSubmitHandler);