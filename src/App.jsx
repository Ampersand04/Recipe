import { Routes, Route } from 'react-router-dom';

import { Add, Home, Login, SignUp } from './pages';
import { Profile } from './pages/Profile';
import { Recipe } from './pages/Recipe';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/recipe/:id" element={<Recipe />} />

                <Route path="/add" element={<Add />} />
            </Routes>
        </>
    );
}

export default App;
