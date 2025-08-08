import React from "react";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useFavorites } from "@/contexts/FavoriteContext";



export default function ItemCard({ item }) {
    const { favorites, addToFavorite, removeFromFavorite } = useFavorites();
    const isFavorite = favorites.some(f => f.id === item.id);
    const btnHeart = () => {
        if (isFavorite) {
            removeFromFavorite(item.id);
        } else {
            addToFavorite(item.id, item);
        }
    };
    return (
        <div className="flex flex-col justify-between max-w-sm w-full h-[350px] rounded-xl shadow-lg overflow-hidden hover:shadow-sm hover:shadow-indigo-500/50 transition-shadow duration-300 relative">
            {/* Heart icon in the top-right corner */}
            <button
                type="button"
                onClick={btnHeart}
                className="absolute top-2 right-2 bg-white/40 rounded-full p-2 shadow hover:bg-white transition z-10"
                title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            >
                {isFavorite ? (
                    // Заполненное сердечко
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="red"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500 animate-pop"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
                        />
                    </svg>
                ) : (
                    // Пустое сердечко
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
                        />
                    </svg>
                )}
            </button>
            <button
                onClick={() => {
                    router.visit(route('item', item.id), {
                        preserveScroll: false,
                        preserveState: true,
                        replace: true,
                })}
                }
                className="flex flex-col justify-between w-full h-full"
            >
                <div>
                    <img
                        src={item.images[0]?.url || "https://via.placeholder.com/150"}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                        <h5 className="mb-2 text-base tracking-tight text-gray-900 dark:text-white">
                            {item.title}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                            {item.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between px-3 pb-3">
                    <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                        {item.price ? `${item.price} тг` : "Цена не указана"}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">
                        {item.city}
                    </span>
                </div>
            </button>
        </div>
    );
}