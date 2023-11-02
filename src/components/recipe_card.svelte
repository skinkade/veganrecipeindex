<script>
	export let recipe;
</script>

<div class="card bg-base-100 shadow-xl justify-self-center w-10/12 md:w-80 lg:w-64 xl:w-96 my-4">
	<a href={recipe.type === 'external' ? recipe.link : `/recipe/${recipe.id}`} target="_blank">
		<div class="grid h-[256px] content-center mt-4">
			<picture class="justify-self-center">
				<source type="image/avif" srcset={`/recipe-image/${recipe.id}-preview.avif`} />
				<img
					alt={recipe.name}
					loading="lazy"
					src={`/recipe-image/${recipe.id}-preview.jpg`}
					class="max-h-full max-w-full object-cover rounded-xl"
				/>
			</picture>
		</div>
		<div class="card-body">
			<h2 class="card-title">{recipe.name}</h2>
			{#if recipe.type === 'external'}
				<p class="text-gray-600">From: {recipe.siteName}</p>
			{/if}
			<p class="text-gray-600">Meal types: {recipe.mealTypes.sort().join(', ')}</p>
			<p class="text-gray-600">Food types: {recipe.foodTypes.sort().join(', ')}</p>
			<p class="text-gray-600">Ingredients: {recipe.ingredients.sort().join(', ')}</p>
			<p class="text-gray-600">
				Allergens: {recipe.allergens.length === 0 ? 'none' : recipe.allergens.sort().join(', ')}
			</p>
			{#if recipe.notes}
				<p>Notes: {recipe.notes}</p>
			{/if}
		</div></a
	>
</div>
