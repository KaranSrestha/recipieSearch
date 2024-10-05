const search = document.getElementById("s-button");
const main = document.querySelector("main");
const input = document.querySelector("input");
const pop = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");

let currentPage = 1;
const pageSize = 10;
let totalRecipes = 0;
let isLoading = false;

async function fetchRecipes(query, page = 1) {
    const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=d690ccc4&app_key=8b4bb340b88522f917a30dbd6fd02e23&from=${(page - 1) * pageSize}&to=${page * pageSize}`);
    const data = await response.json();
    totalRecipes = data.count;
    return data.hits;
}

function renderRecipes(recipes) {
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add("card");
        card.dataset.recipe = JSON.stringify(recipe);

        const image = document.createElement('div');
        image.classList.add("image");

        const img = document.createElement('img');
        img.src = recipe.recipe.images.REGULAR.url;
        image.appendChild(img);

        const name = document.createElement("h2");
        name.textContent = recipe.recipe.label;

        const tags = document.createElement("ul");
        tags.classList.add("tags");

        for (let i = 0; i < 3; i++) {
            const li = document.createElement("li");
            li.textContent = recipe.recipe.healthLabels[i];
            tags.appendChild(li);
        }

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(tags);
        main.appendChild(card);

        card.addEventListener("click", () => {
            const recipeData = JSON.parse(card.dataset.recipe);
            pop.querySelector('h2').textContent = recipeData.recipe.label;
            pop.querySelector('.img img').src = recipeData.recipe.images.REGULAR.url;
            pop.querySelector('.ingredients').innerHTML = recipeData.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('');
            pop.style.display = "flex";
            overlay.style.display = "block";
        });
    });
}

async function loadMoreRecipes() {
    const query = input.value;
    if (isLoading || totalRecipes === 0) return;

    isLoading = true;
    const recipes = await fetchRecipes(query, ++currentPage);
    renderRecipes(recipes);
    isLoading = false;
}

search.addEventListener("click", async () => {
    main.innerHTML = '';
    currentPage = 1;
    const query = input.value;
    const recipes = await fetchRecipes(query);
    renderRecipes(recipes);
});

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMoreRecipes();
    }
});

overlay.addEventListener("click", () => {
    pop.style.display = "none";
    overlay.style.display = "none";
});
