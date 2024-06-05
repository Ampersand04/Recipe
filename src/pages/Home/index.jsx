import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '../../components/Layout/Layout';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import { fetchRecipes, searchRecipes, toggleFavoriteRecipe } from '../../redux/slices/recipe';
import styles from './Home.module.scss';
import { useState, useEffect } from 'react';

export const Home = () => {
    const dispatch = useDispatch();
    const recipes = useSelector((state) => state.recipe.recipes);
    const status = useSelector((state) => state.recipe.status);
    const error = useSelector((state) => state.recipe.error);

    const [isFilter, setIsFilter] = useState(false);
    const [favoriteStatus, setFavoriteStatus] = useState({});
    const toggleFilter = () => {
        setIsFilter(!isFilter);
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            query: '',
            typeSort: [],
            timeSort: [],
        },
        mode: 'onSubmit',
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRecipes());
        }
    }, [status, dispatch]);

    const onSubmit = (formData) => {
        console.log(formData);
        const searchPayload = {
            query: formData.query || '',
            typeSort: formData.typeSort.map((option) => option.value),
            timeSort: formData.timeSort.map((option) => option.value),
        };
        console.log(searchPayload);

        dispatch(searchRecipes(searchPayload));
    };

    const handleFavoriteToggle = (recipeId) => {
        const newStatus = !favoriteStatus[recipeId];
        setFavoriteStatus({ ...favoriteStatus, [recipeId]: newStatus });

        // Dispatch action to toggle favorite
        dispatch(toggleFavoriteRecipe({ userId: 'userId', recipeId }));
    };

    const timeSortOptions = [
        '5 мин.',
        '10 мин.',
        '15 мин.',
        '30 мин.',
        '45 мин.',
        '1 час',
        'Более 1 часа',
    ];

    const typeSortOptions = ['Горячее', 'Закуски', 'Десерт', 'Напиток', 'Салат', 'Суп'];

    return (
        <Layout title={'Рецепты для дома'}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.searchPath}>
                    <input
                        className={styles.search}
                        {...register('query')}
                        placeholder="Поиск по названию"
                    />
                    {errors.query && <span>{errors.query.message}</span>}
                    <button type="button" onClick={toggleFilter}>
                        Фильтр
                    </button>
                    <button type="submit">Найти рецепты</button>
                </div>

                {isFilter ? (
                    <div className={styles.filter}>
                        <div>
                            <Controller
                                name="timeSort"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Время приготовления"
                                        options={timeSortOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        isMulti
                                    />
                                )}
                                // rules={{ required: 'Выберите время приготовления' }}
                            />
                            {errors.timeSort && <span>{errors.timeSort.message}</span>}
                        </div>

                        <div>
                            <Controller
                                name="typeSort"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Тип рецепта"
                                        options={typeSortOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                        isMulti
                                    />
                                )}
                                // rules={{ required: 'Выберите тип' }}
                            />
                            {errors.typeSort && <span>{errors.typeSort.message}</span>}
                        </div>
                    </div>
                ) : null}
            </form>

            {console.log(recipes)}

            <div className={styles.recipes}>
                {status === 'loading' && <p>Загрузка...</p>}
                {status === 'failed' && <p>ОШИБКА: {error}</p>}
                {status === 'succeeded' && Array.isArray(recipes) && recipes?.length > 0 ? (
                    recipes.map((recipe, index) => (
                        <div key={index} className={styles.recipe}>
                            <div className={styles.image}>
                                <img
                                    src={`http://yourserver.com/uploads/${recipe.image}`}
                                    alt={recipe.title}
                                />
                                <p className={styles.time}>{recipe.time}</p>
                                <p className={styles.type}>{recipe.type}</p>
                            </div>
                            <div className={styles.title}>
                                <h3>{recipe.title}</h3>
                                <div className={styles.path}>
                                    {/* Handle favorite toggle */}
                                    <img
                                        src={
                                            favoriteStatus[recipe.id] ? 'liked.svg' : 'noliked.svg'
                                        }
                                        alt="Favorite"
                                        onClick={() => handleFavoriteToggle(recipe.id)}
                                    />
                                </div>
                            </div>
                            <p>{recipe.description}</p>
                        </div>
                    ))
                ) : (
                    <p>Рецепты не найдены</p>
                )}
            </div>
        </Layout>
    );
};
