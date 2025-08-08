import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { router, usePage } from '@inertiajs/react';

const FavoriteContext = createContext();
axios.defaults.withCredentials = true;


export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const addToFavorite = async (adId, item) => {
        try {
            await axios.post(`/favorites/${adId}`);
            setFavorites(prev => [...prev, item]);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Пользователь не авторизован — перенаправляем
                router.visit('/login');
            } else {
                console.error('Ошибка при добавлении в избранное:', error);
            }
        }
    }

    const removeFromFavorite = async (adId) => {
        await axios.delete(`/favorites/${adId}`);
        setFavorites(prev => prev.filter(fav => fav.id !== adId));
    }

    const clearFavorites = () => {
        setFavorites([]);
    }

    const getFavorites = async () => {
        try {
            const response = await axios.get('/favorites');
            setFavorites(response.data);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFavorites();
    }, []);

    return (
        <FavoriteContext.Provider value={{ favorites, addToFavorite, removeFromFavorite, loading, clearFavorites, getFavorites }}>
            {children}
        </FavoriteContext.Provider>
    )

}