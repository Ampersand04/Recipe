import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { recipesReducer } from './slices/recipe';

const store = configureStore({
    reducer: {
        auth: authReducer,
        recipe: recipesReducer,
    },
});

export default store;
