import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

const initialState = {
    recipes: [],
    status: 'idle',
    error: null,
    favoriteMessage: null,
};

export const createRecipe = createAsyncThunk(
    'recipes/createRecipe',
    async ({ title, description, type, time, image }) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('time', time);
        formData.append('image', image);

        const response = await axios.post('/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
);

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async () => {
    const response = await axios.get('/get/recipes');
    return response.data;
});

export const searchRecipes = createAsyncThunk(
    'recipes/searchRecipes',
    async ({ query, timeSort, typeSort }) => {
        const response = await axios.post('/search/recipes', { query, timeSort, typeSort });
        return response.data;
    },
);

export const editRecipe = createAsyncThunk('recipes/editRecipe', async ({ id, newData }) => {
    const response = await axios.put('/edit', { id, newData });
    return response.data;
});

export const deleteRecipe = createAsyncThunk('recipes/deleteRecipe', async (id) => {
    const response = await axios.delete('/delete', { data: { id } });
    return response.data;
});

export const toggleFavoriteRecipe = createAsyncThunk(
    'recipes/toggleFavoriteRecipe',
    async ({ userId, recipeId }) => {
        const response = await axios.post('/favorites', { userId, recipeId });
        return response.data;
    },
);

const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes.push(action.payload);
            })
            .addCase(createRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = action.payload;
            })
            .addCase(fetchRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(searchRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = action.payload;
            })
            .addCase(searchRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(editRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.recipes.findIndex(
                    (recipe) => recipe.id === action.payload.updatedData.id,
                );
                state.recipes[index] = action.payload.updatedData;
            })
            .addCase(editRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = state.recipes.filter((recipe) => recipe.id !== action.meta.arg);
            })
            .addCase(deleteRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(toggleFavoriteRecipe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(toggleFavoriteRecipe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.favoriteMessage = action.payload.message;
            })
            .addCase(toggleFavoriteRecipe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const recipesStatus = (state) => state.recipe.status;

export const recipesReducer = recipesSlice.reducer;
