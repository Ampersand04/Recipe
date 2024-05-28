import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './Header.module.scss';
import { useEffect } from 'react';
import { fetchUser, selectIsAuth } from '../../../redux/slices/auth';

export const Header = ({ title }) => {
    const dispatch = useDispatch();

    const isAuth = useSelector(selectIsAuth);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
    return (
        <header className={styles.header}>
            <span>
                <img src="logo.png" width={40} alt="" />
                <h1>{title}</h1>
            </span>

            <nav className={styles.nav}>
                <Link to="/" className={styles.navLink}>
                    <li>Главная</li>
                </Link>

                {isAuth ? (
                    <Link to="/profile" className={styles.navLink}>
                        <li>Мой профиль</li>
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className={styles.navLink}>
                            <li>Войти</li>
                        </Link>
                        <Link to="/signup" className={styles.navLink}>
                            <li>Зарегистрироваться</li>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.node.isRequired,
};
