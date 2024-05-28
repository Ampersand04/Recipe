// import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Home, Login, SignUp } from './pages';
import { Profile } from './pages/Profile';
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
// // import { AuthCheck } from './hooks/AuthCheck';
// import { fetchAuthMe, selectIsAuth, selectUser } from './redux/slices/auth';
// import { RoleCheck } from './hooks/RoleCheck';

function App() {
    // const dispatch = useDispatch();
    // const isAuth = useSelector(selectIsAuth);
    // const user = useSelector(selectUser);

    // const [isAdmin, setIsAdmin] = useState(false)

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!isAuth) {
    //             await dispatch(fetchAuthMe());
    //             // console.log(user)
    //         }
    //     };

    //     fetchData();
    // }, [dispatch, isAuth, user]);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}

export default App;
