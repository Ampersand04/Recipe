// import React, { useEffect, useState } from 'react'
// import styles from './Dashboard.module.scss'
// import { Aside, Header } from '../../components'
// import { MainAdminSide } from '../../components/MainAdminSide'
// import { useDispatch, useSelector } from 'react-redux'
// import {
// 	fetchAssigned,
// 	fetchManagers,
// 	fetchUsers,
// 	selectDashboardAssigned,
// 	selectDashboardManagers
// } from '../../redux/slices/dasdboard'

export const Dashboard = () => {
    // 	const user = JSON.parse(localStorage.getItem('user'))
    // 	const [isProfileActive, setIsProfileActive] = useState(false)

    // 	const handleProfileClick = () => {
    // 		setIsProfileActive(!isProfileActive)
    // 	}

    // 	const dispatch = useDispatch()
    // 	const assignedObjects = useSelector(selectDashboardAssigned)

    // 	useEffect(() => {
    // 		dispatch(fetchAssigned)
    // 	}, [dispatch, assignedObjects])

    return (
        <>
            <></>
        </>
    );
    // 		<section
    // 			className={
    // 				isProfileActive
    // 					? `${styles.root} ${styles.back}`
    // 					: `${styles.root}`
    // 			}
    // 		>
    // 			<Header
    // 				isActive={isProfileActive}
    // 				isThis={false}
    // 				isAdmin={true}
    // 				pageTitle={'Панель администратора'}
    // 				// pageLink={'dashboard'}
    // 				onProfileClick={handleProfileClick}
    // 			/>
    // 			<Aside currentRoute={'dashboard'} />
    // 			<MainAdminSide
    // 				mainTub={'dashboard'}
    // 				isActive={isProfileActive}
    // 				onProfileClick={handleProfileClick}
    // 				assignedObjects={assignedObjects}
    // 			/>
    // 		</section>
};
