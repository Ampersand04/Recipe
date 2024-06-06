import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '../../components/Layout/Layout';
import { fetchRecipes } from '../../redux/slices/recipe';
import styles from './Recipe.module.scss';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const Recipe = () => {
    const dispatch = useDispatch();
    const recipes = useSelector((state) => state.recipe.recipes);
    const status = useSelector((state) => state.recipe.status);
    const error = useSelector((state) => state.recipe.error);
    const { id } = useParams(); // Извлекаем параметры из URL
    const recipeId = parseInt(id);
    console.log(id); // Извлекаем параметры из URL

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRecipes());
        }
    }, [status, dispatch]);

    // Функция для поиска рецепта по id
    const findRecipeById = (recipes, id) => {
        console.log(recipes.find((recipe) => recipe.id === id));
        return recipes.find((recipe) => recipe.id === id);
    };

    // Находим рецепт по переданному id
    const recipe = findRecipeById(recipes, recipeId);

    return (
        <Layout title={'Рецепты для дома'}>
            <div className={styles.recipe}>
                {status === 'loading' && <p>Загрузка...</p>}
                {status === 'failed' && <p>ОШИБКА: {error}</p>}
                {status === 'succeeded' && recipe ? (
                    <div className={styles.container}>
                        <div className={styles.image}>
                            <img
                                src={`https://api-recipe-en30.onrender.com/uploads/${recipe.image}`}
                                alt={recipe.title}
                            />
                        </div>
                        <div className={styles.title}>
                            <h3>{recipe.title}</h3>
                            <p>{recipe.description}</p>
                            <p className={styles.time}>
                                <b>Время приготовления: </b>
                                {recipe?.time}
                            </p>
                            <p className={styles.type}>Тип рецепта: {recipe?.type}</p>
                        </div>
                    </div>
                ) : (
                    <p>Рецепты не найдены</p>
                )}
            </div>
        </Layout>
    );
};
