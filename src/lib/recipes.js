import fs from 'fs';

function readRecipe(id, type) {
	const parentPath = type === 'external' ? 'external_recipes' : 'recipes';
	const contents = fs.readFileSync(`./${parentPath}/${id}/metadata.json`);
	return {
		...JSON.parse(contents),
		id,
		type
	};
}

function readExternalRecipes() {
	const externalSiteDirs = fs.readdirSync('./external_recipes');
	return externalSiteDirs.reduce((acc, id) => {
		return [...acc, readRecipe(id, 'external')];
	}, []);
}

function readRecipes() {
	const external = readExternalRecipes();
	// side-effect:
	// ensure each external recipe with a preview.jpg
	// gets a symlink to /static/recipe-img
	const externalPreviewIds = external
		.map((recipe) => recipe.id)
		.filter((id) => fs.existsSync(`./external_recipes/${id}/preview.jpg`));
	// ensure output directory exists
	if (!fs.existsSync('./static/recipe-image')) {
		fs.mkdirSync('./static/recipe-image');
	}
	externalPreviewIds.forEach((id) => {
		if (!fs.existsSync(`./static/recipe-image/${id}-preview.jpg`)) {
			fs.symlinkSync(
				`../../external_recipes/${id}/preview.jpg`,
				`./static/recipe-image/${id}-preview.jpg`
			);
		}
	});

	return external;
}

export const allRecipes = readRecipes().sort((a, b) => a.name.localeCompare(b.name));
// TODO in time, switch to recently added by default
// .sort((a, b) => new Date(b.added) - new Date(a.added))
