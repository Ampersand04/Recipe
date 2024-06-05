import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Layout } from '../../components/Layout/Layout';
import styles from './Add.module.scss';
import { createRecipe } from '../../redux/slices/recipe';
import { fetchUser } from '../../redux/slices/auth';

const timeSortOptions = [
    '5 мин.',
    '10 мин.',
    '15 мин.',
    '30 мин.',
    '45 мин.',
    '1 час',
    'Более 1 часа',
];

const typeSortOptions = ['Горячее', 'Закуски', 'Десерт', 'Напиток', 'Салат'];

export const Add = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            type: '',
            time: '',
            image: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        const add = {
            title: values.title || '',
            description: values.description || '',
            type: values.type?.value || '',
            time: values.time?.value || '',
            image: values.image[0],
        };
        console.log(add);

        const data = await dispatch(createRecipe(add));

        if (!data.payload) {
            return alert('Не удалось создать рецепт');
        }

        return navigate('/');
    };

    return (
        <Layout title={'Добавить новый рецепт'}>
            <div className={styles.create}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.Form}>
                    <label htmlFor="title">Название</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Введите название рецепта"
                        aria-invalid={errors.title ? true : false}
                        {...register('title', { required: 'Укажите название' })}
                    />
                    <p className={styles.error}>{errors.title?.message}</p>

                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Введите описание рецепта"
                        aria-invalid={errors.description ? true : false}
                        {...register('description', { required: 'Укажите описание' })}
                    />
                    <p className={styles.error}>{errors.description?.message}</p>

                    <div className={styles.selects}>
                        <div>
                            <label htmlFor="title">Время приготовления</label>
                            <Controller
                                name="time"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Время приготовления"
                                        options={timeSortOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                    />
                                )}
                                rules={{ required: 'Выберити время рецепта' }}
                            />

                            <p className={styles.error}>{errors?.time?.message}</p>
                        </div>

                        <div>
                            <label htmlFor="title">Тип блюда </label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Тип рецепта"
                                        options={typeSortOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        }))}
                                    />
                                )}
                                rules={{ required: 'Выберити тип рецепта' }}
                            />

                            <p className={styles.error}>{errors?.type?.message}</p>
                        </div>

                        <label htmlFor="image">Загрузить изображение</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            {...register('image', { required: 'Загрузите изображение' })}
                        />
                        <p className={styles.error}>{errors.image?.message}</p>
                    </div>

                    <button type="submit">Добавить рецепт</button>
                </form>
            </div>
        </Layout>
    );
};
