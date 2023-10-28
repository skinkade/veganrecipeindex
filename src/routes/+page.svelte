<script>
	/** @type {import('./$types').PageData} */
	export let data;

	let recipeList = data.allRecipes;

	const sortOptions = [
		{ value: 'alpha', label: 'Name' },
		{ value: 'date-desc', label: 'Recently Added' }
	];

	const mealTypeOptions = data.distinctMealTypes.reduce(
		(acc, mealType) => [...acc, { value: mealType, label: mealType }],
		[]
	);
	const foodTypeOptions = data.distinctFoodTypes.reduce(
		(acc, foodType) => [...acc, { value: foodType, label: foodType }],
		[]
	);
	const ingredientOptions = data.distinctIngredients.reduce(
		(acc, ingredient) => [...acc, { value: ingredient, label: ingredient }],
		[]
	);
	const allergenOptions = data.distinctAllergens.reduce(
		(acc, allergen) => [...acc, { value: allergen, label: allergen }],
		[]
	);

	import RecipeCard from '../components/recipe_card.svelte';
	import Select from 'svelte-select';
	import { isSuperset, intersection } from '../lib/set';

	function filterResults() {
		let filteredRecipes = data.allRecipes;
		const form = new FormData(document.getElementById('filter-form'));

		const sortOrder = JSON.parse(form.get('recipe-sort')).value;
		console.log({ sortOrder });

		let mealTypes = form.get('meal-types')
			? new Set(JSON.parse(form.get('meal-types')).map((entry) => entry.value))
			: new Set();
		if (mealTypes.size > 0) {
			filteredRecipes = filteredRecipes.filter(
				(recipe) => intersection(new Set(recipe.mealTypes), mealTypes).size > 0
			);
		}

		let foodTypes = form.get('food-types')
			? new Set(JSON.parse(form.get('food-types')).map((entry) => entry.value))
			: new Set();
		if (foodTypes.size > 0) {
			filteredRecipes = filteredRecipes.filter(
				(recipe) => intersection(new Set(recipe.foodTypes), foodTypes).size > 0
			);
		}

		let includedIngredients = form.get('included-ingredients')
			? new Set(JSON.parse(form.get('included-ingredients')).map((entry) => entry.value))
			: new Set();
		if (includedIngredients.size > 0) {
			filteredRecipes = filteredRecipes.filter((recipe) =>
				isSuperset(new Set(recipe.ingredients), includedIngredients)
			);
		}

		let notIncludedIngredients = form.get('not-included-ingredients')
			? new Set(JSON.parse(form.get('not-included-ingredients')).map((entry) => entry.value))
			: new Set();
		if (notIncludedIngredients.size > 0) {
			notIncludedIngredients = new Set(notIncludedIngredients);
			filteredRecipes = filteredRecipes.filter(
				(recipe) => intersection(new Set(recipe.ingredients), notIncludedIngredients).size === 0
			);
		}

		let allergens = form.get('allergens')
			? new Set(JSON.parse(form.get('allergens')).map((entry) => entry.value))
			: new Set();
		if (allergens.size > 0) {
			filteredRecipes = filteredRecipes.filter(
				(recipe) => intersection(new Set(recipe.allergens), allergens).size === 0
			);
		}

		if (sortOrder === 'alpha') {
			recipeList = filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			recipeList = filteredRecipes.sort((a, b) => new Date(b.added) - new Date(a.added));
		}
	}

	/* eslint-disable no-unused-vars */
	let filterTriggerTimeout = null;

	function debouncedFilterResults() {
		filterTriggerTimeout = setTimeout(filterResults, 200);
	}
</script>

<svelte:head>
	<title>Vegan Recipe Index</title>
</svelte:head>

<header>
	<div class="flex justify-center m-4">
		<h1 class="text-4xl text-bold">Vegan Recipe Index</h1>
	</div>
	<div class="flex justify-center m-4">
		<h2 class="text-xl w-96 md:w-auto text-center">
			My favorite vegan and easily-veganized recipes from around the web
		</h2>
	</div>
</header>

<main>
	<div class="grid grid-cols-8">
		<div class="card m-4 bg-base-100 shadow-xl col-start-2 col-span-6">
			<div class="card-body">
				<form id="filter-form">
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
						<div class="m-4">
							<label for="recipe-sort">Sort By</label>
							<Select
								items={sortOptions}
								value="alpha"
								clearable={false}
								on:change={debouncedFilterResults}
								on:clear={debouncedFilterResults}
								name="recipe-sort"
							/>
						</div>
						<div class="m-4">
							<label for="included-ingredients">Meal Types</label>
							<Select
								items={mealTypeOptions}
								multiple
								on:change={debouncedFilterResults}
								on:clear={debouncedFilterResults}
								name="meal-types"
							/>
						</div>
						<div class="m-4">
							<label for="food-types">Food Types</label>
							<Select
								items={foodTypeOptions}
								multiple
								on:change={debouncedFilterResults}
								on:clear={debouncedFilterResults}
								name="food-types"
							/>
						</div>
						<div class="m-4">
							<label for="included-ingredients">Has ingredients</label>
							<Select
								items={ingredientOptions}
								multiple
								on:change={debouncedFilterResults}
								on:clear={debouncedFilterResults}
								name="included-ingredients"
							/>
						</div>
						<div class="m-4">
							<label for="not-included-ingredients">Does not have ingredients</label>
							<Select
								items={ingredientOptions}
								multiple
								on:change={debouncedFilterResults}
								on:clear={debouncedFilterResults}
								name="not-included-ingredients"
							/>
						</div>
						<div class="m-4">
							<label for="allergens">Does not have allergens</label>
							<Select
								items={allergenOptions}
								multiple
								on:change={debouncedFilterResults}
								on:clear={debouncedFilterResults}
								name="allergens"
							/>
						</div>
					</div>
				</form>
				<div class="flex justify-center">
					<span>Displaying {recipeList.length} of {data.allRecipes.length} recipes</span>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 justify-center">
		{#each recipeList as recipe}
			<RecipeCard {recipe} />
		{/each}
	</div>
</main>
