import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import styles from './Profile.module.scss';
import { fetchUser, selectUser } from '../../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipe, fetchRecipes, toggleFavoriteRecipe } from '../../redux/slices/recipe';
import { Link } from 'react-router-dom';

export const Profile = () => {
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

    const userRecipes = user?.favorites;

    const recipes = useSelector((state) => state.recipe.recipes);
    const status = useSelector((state) => state.recipe.status);
    const error = useSelector((state) => state.recipe.error);

    const onClickConfirm = (id) => {
        if (window.confirm('Вы действительно хотите это сделать?')) {
            dispatch(deleteRecipe(id));
        }
    };

    const [likedRecipes, setLikedRecipes] = useState([]);

    const handleFavoriteToggle = (recipeId) => {
        if (likedRecipes.includes(recipeId)) {
            setLikedRecipes(likedRecipes.filter((id) => id !== recipeId));
        } else {
            setLikedRecipes([...likedRecipes, recipeId]);
        }
        // Dispatch action to toggle favorite
        dispatch(toggleFavoriteRecipe({ userId: 'userId', recipeId }));
    };

    const [activeTab, setActiveTab] = useState('profile');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRecipes());
        }
    }, [status, dispatch]);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
    return (
        <Layout title={'Мой профиль'}>
            <div className={styles.profile}>
                <div className={styles.info}>
                    <img src="profile.png" alt="" />

                    <div>
                        <h2>Пользователь {user?.id}</h2>
                        <p>{user?.email}</p>
                    </div>
                </div>
                <div className={styles.tabs}>
                    <div
                        className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => handleTabClick('profile')}>
                        <p>Мой профиль</p>
                    </div>
                    {user?.role === 'ADMIN' && (
                        <div
                            className={`${styles.tab} ${
                                activeTab === 'admin' ? styles.active : ''
                            }`}
                            onClick={() => handleTabClick('admin')}>
                            <p>Админ панель</p>
                        </div>
                    )}
                    <div
                        className={`${styles.tab} ${
                            activeTab === 'favorites' ? styles.active : ''
                        }`}
                        onClick={() => handleTabClick('favorites')}>
                        <p>Мои любимые рецепты</p>
                    </div>
                </div>
                <div className={styles.output}>
                    {activeTab === 'profile' && (
                        <>
                            <div className={styles.info}>
                                <div className={styles.title}>
                                    <h4>Email</h4>
                                    <p>Ваш email использованный на этом сайте</p>
                                </div>
                                <div className={styles.content}>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.title}>
                                    <h4>Полное Имя</h4>
                                    <p>Ваше полное имя на этом сайте</p>
                                </div>
                                <div className={styles.content}>
                                    <p>{user?.fullname}</p>
                                </div>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.title}>
                                    <h4>Пароль</h4>
                                    <p>Ваш пароль на этом сайте</p>
                                </div>
                                <div className={styles.content}>
                                    <p>••••••••••</p>
                                </div>
                            </div>
                            {user?.role === 'ADMIN' && (
                                <div className={styles.info}>
                                    <div className={styles.title}>
                                        <h4>Пользователь</h4>
                                        <p>Ваш тип пользователя</p>
                                    </div>
                                    <div className={styles.content}>
                                        <p>Админ</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {activeTab === 'admin' && (
                        <div className={styles.recipes}>
                            {status === 'loading' && <p>Загрузка...</p>}
                            {status === 'failed' && <p>ОШИБКА: {error}</p>}
                            {status === 'succeeded' && recipes.length > 0 ? (
                                <>
                                    <Link to={'/add'} className={styles.recipe}>
                                        <div className={styles.image}>
                                            <img src={'add.png'} alt="Recipe" />
                                        </div>
                                        <div className={styles.title}>
                                            <h3>Новый рецепт</h3>
                                        </div>
                                        {/* <p>Создай свой новый чтобы его увидели другие!</p> */}
                                    </Link>

                                    {recipes?.map((recipe, index) => (
                                        <div key={index} className={styles.recipe}>
                                            <div className={styles.image}>
                                                <img src={'carrot.png'} alt="Recipe" />
                                                <p className={styles.time}>{recipe?.time}</p>
                                                <p className={styles.type}>{recipe?.type}</p>
                                            </div>
                                            <div className={styles.title}>
                                                <h3>{recipe.title}</h3>
                                                <div className={styles.path}>
                                                    <button
                                                        onClick={() => onClickConfirm(recipe.id)}>
                                                        Удалить рецепт
                                                    </button>
                                                </div>
                                            </div>
                                            <p>{recipe?.description}</p>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <Link to={'/add'} className={styles.recipe}>
                                        <div className={styles.image}>
                                            <img src={'add.png'} alt="Recipe" />
                                        </div>
                                        <div className={styles.title}>
                                            <h3>Новый рецепт</h3>
                                        </div>
                                        {/* <p>Создай свой новый чтобы его увидели другие!</p> */}
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                    {activeTab === 'favorites' && (
                        <div className={styles.recipes}>
                            {userRecipes?.length > 0
                                ? userRecipes.map((recipe, index) => (
                                      <div key={index} className={styles.recipe}>
                                          <div className={styles.image}>
                                              <img src={'carrot.png'} alt="recipe" />
                                              <p className={styles.time}>{recipe?.time}</p>
                                              <p className={styles.type}>{recipe?.type}</p>
                                          </div>
                                          <div className={styles.title}>
                                              <h3>{recipe?.title}</h3>
                                              <div className={styles.path}>
                                                  <img
                                                      src={
                                                          likedRecipes.includes(recipe.id)
                                                              ? 'noliked.svg'
                                                              : 'liked.svg'
                                                      }
                                                      onClick={() =>
                                                          handleFavoriteToggle(recipe.id)
                                                      }
                                                      alt="not liked"
                                                  />
                                              </div>
                                          </div>
                                          <p>{recipe?.description}</p>
                                      </div>
                                  ))
                                : 'Нет данных'}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
