import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import multer from 'multer';
import bcrypt from 'bcrypt';
import JsonWebToken from 'jsonwebtoken';
import pg from 'pg';
import cors from 'cors';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Укажите папку для сохранения файлов
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Используйте оригинальное имя файла
    },
});

const prisma = new PrismaClient();
const app = express();

const upload = multer({ storage: storage });
const port = process.env.PORT;
const router = express.Router();
const jwt = JsonWebToken;
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());
app.use(cors());
/* 
    ================= middleware =================
*/
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Check user role
        const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });

        if (user) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

/* 
    ================= user registration =================
*/
app.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).send('Please provide name, email, username, and password');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                fullname: fullname,
                email: email,
                password: hashedPassword,
                role: 'USER',
            },
            include: {
                favorites: true, // Включаем избранные рецепты в ответе
            },
        });

        delete user.password;

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        // console.log('token' + token);
        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while registering the user');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Please provide email and password');
    }

    try {
        // Найти пользователя и включить избранные рецепты
        const user = await prisma.user.findUnique({
            where: { email },
            include: { favorites: true },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);

        const response = {
            user,
            token,
        };

        // Удаление пароля из ответа
        delete response.user.password;

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while logging in');
    }
});

app.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { favorites: true }, // Include the 'favorites' relation
        });
        delete user.password;
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/admin', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).send('Please provide fullname, email, and password');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Логирование данных перед запросом к Prisma
        console.log({ fullname, email, password: hashedPassword });

        // Проверка существующего пользователя
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                role: 'ADMIN',
            },
            include: {
                favorites: true, // Включаем избранные рецепты в ответе
            },
        });

        delete user.password;

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while registering the user');
    }
});

app.post('/create', async (req, res) => {
    const { title, description, type, time } = req.body;

    try {
        const newRecipe = await prisma.recipe.create({
            data: {
                title,
                description,
                type,
                time,
            },
        });

        res.status(201).json(newRecipe);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating the recipe.' });
    }
});

app.put('/edit', authMiddleware, async (req, res) => {
    const { id, newData } = req.body;

    try {
        // Используем Prisma для обновления данных в базе данных
        const updatedData = await prisma.recipe.update({
            where: { id },
            data: newData,
        });

        res.json({ message: 'Data updated successfully', updatedData });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST запрос для удаления элемента
app.delete('/delete', authMiddleware, async (req, res) => {
    const { id } = req.body; // Предполагаем, что id элемента для удаления передается в теле запроса

    try {
        const existingRecipe = await prisma.recipe.findUnique({
            where: {
                id: id,
            },
        });

        if (!existingRecipe) {
            return res.json({ message: 'Рецепта не существует' });
        }
        // Ваш код для удаления элемента
        // Например, если вы хотите удалить рецепт по его id:
        await prisma.recipe.delete({
            where: {
                id: parseInt(id), // Предполагая, что id - числовой тип данных
            },
        });

        res.status(200).json({ message: 'Element deleted successfully' });
    } catch (error) {
        console.error('Error deleting element:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/get/recipes', async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany();

        res.json(recipes);
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ error: 'Произошла ошибка при получении рецептов' });
    }
});

app.post('/search/recipes', async (req, res) => {
    const { query, timeSort, typeSort } = req.body;

    try {
        const recipes = await prisma.recipe.findMany({
            where: {
                AND: [
                    query ? { title: { contains: query, mode: 'insensitive' } } : {},
                    typeSort.length > 0 ? { type: { in: typeSort } } : {},
                    timeSort.length > 0 ? { time: { in: timeSort } } : {},
                ],
            },
        });
        res.json(recipes);
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ error: 'Произошла ошибка при поиске рецептов' });
    }
});

app.post('/favorites', authMiddleware, async (req, res) => {
    const { recipeId } = req.body;

    try {
        const userId = req.user.id; // Получаем ID пользователя из аутентификации

        // Проверяем, существует ли рецепт с указанным ID
        const recipeExists = await prisma.recipe.findUnique({
            where: { id: recipeId },
        });

        if (!recipeExists) {
            return res.status(404).json({ error: 'Рецепт не найден' });
        }

        // Проверяем, добавлен ли рецепт в избранное пользователя
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { favorites: true },
        });

        const isRecipeInFavorites = user.favorites.some((favorite) => favorite.id === recipeId);

        // Если рецепт уже в избранном, удаляем его
        if (isRecipeInFavorites) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    favorites: {
                        disconnect: { id: recipeId },
                    },
                },
            });
            res.status(200).json({ message: 'Рецепт удален из избранного' });
        } else {
            // Если рецепта нет в избранном, добавляем его
            await prisma.user.update({
                where: { id: userId },
                data: {
                    favorites: {
                        connect: { id: recipeId },
                    },
                },
            });
            res.status(200).json({ message: 'Рецепт добавлен в избранное' });
        }
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ error: 'Произошла ошибка при добавлении рецепта в избранное' });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
