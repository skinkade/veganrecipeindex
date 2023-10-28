import { allRecipes } from '$lib/recipes';

/** @type {import('./$types').PageServerLoad} */
export function load() {
	let distinctIngredients = Array.from(
		allRecipes
			.flatMap((recipe) => recipe.ingredients)
			.reduce((acc, ingredient) => acc.add(ingredient), new Set())
	).sort();
	let distinctAllergens = Array.from(
		allRecipes
			.flatMap((recipe) => recipe.allergens)
			.reduce((acc, allergen) => acc.add(allergen), new Set())
	).sort();
	let distinctMealTypes = Array.from(
		allRecipes
			.flatMap((recipe) => recipe.mealTypes)
			.reduce((acc, mealType) => acc.add(mealType), new Set())
	).sort();
	let distinctFoodTypes = Array.from(
		allRecipes
			.flatMap((recipe) => recipe.foodTypes)
			.reduce((acc, foodType) => acc.add(foodType), new Set())
	).sort();

	return {
		allRecipes,
		distinctIngredients,
		distinctAllergens,
		distinctMealTypes,
		distinctFoodTypes
	};
}
