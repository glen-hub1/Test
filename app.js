const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

searchBtn.addEventListener("click", searchMeals);

async function searchMeals() {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a meal name!");
    return;
  }

  results.innerHTML = "<p>Loading recipes...</p>";

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    if (!data.meals) {
      results.innerHTML = "<p>No recipes found 😢 Try another meal!</p>";
      return;
    }

    results.innerHTML = data.meals.map(meal => `
      <div class="recipe">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h2>${meal.strMeal}</h2>
        <h4>Ingredients:</h4>
        <ul>
          ${getIngredients(meal).map(i => `<li>${i}</li>`).join("")}
        </ul>
        <h4>Instructions:</h4>
        <p>${meal.strInstructions.slice(0, 300)}...</p>
        <a href="${meal.strSource || meal.strYoutube}" target="_blank">Full Recipe →</a>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    results.innerHTML = "<p>Error loading recipes. Please try again later.</p>";
  }
}

function getIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const item = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (item) ingredients.push(`${item} - ${measure}`);
  }
  return ingredients;
}
