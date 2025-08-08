import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useFavorites } from "@/contexts/FavoriteContext";

export default function ProfileAdRow({ item, user_id, isFullInfo = true }) {
    const { favorites, addToFavorite, removeFromFavorite } = useFavorites();
    const isFavorite = favorites.some(f => f.id === item.id);


    const toggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorite(item.id);
        } else {
            addToFavorite(item.id, item);
        }
    };

    return (
        <div className="flex items-center w-full bg-[#181A20] rounded-xl p-4 gap-4 hover:bg-[#23262F] transition">
            {/* Фото — побольше */}
            <img
                src={item.images[0]?.url || "https://via.placeholder.com/150"}
                alt={item.title}
                className="w-40 h-40 object-cover rounded-lg"
                />
         
            {/* Контент слева от кнопки */}
            <div className="flex flex-col justify-between flex-1 overflow-hidden">
                <Link href={item.status == 2 || item.status == 3 ? '#' : route("item", item.id)} preserveScroll className="block mb-2">
                <span
                    href={route("item", item.id)}
                    className="text-lg font-semibold text-white truncate hover:underline"
                    >
                    {item.title}
                </span>

                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {item.description}
                </p>
                {isFullInfo && (
                    <div>
                        {item.status == 3 && <p className="text-red-500 text-md">Забанен</p>}
                        {item.status == 2 && <p className="text-red-500 text-md">Отклонен</p>}
                        {item.status == 1 && item.user_id == user_id && <p className="text-green-500 text-md">Опубликован</p>}
                        {item.status == 0 && <p className="text-yellow-500 text-md">На модерации</p>}
                    </div>
                )}
   
                {item.ban_reason && <p className="text-red-500 text-sm">Причина: {item.ban_reason}</p>}
                <div className="flex items-center justify-between mt-3">
                    <span className="text-indigo-400 font-semibold">
                        {item.price ? `${item.price} тг` : "Цена не указана"}
                    </span>
                    <span className="text-gray-500 text-sm">{item.city?.name}</span>
                </div>
                    </Link>
            </div>

            {/* Кнопка избранного */}
            <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-[#2b2d35] transition"
                title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            >
                {isFavorite ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="red"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
                        />
                    </svg>
                ) : (
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
        </div>
    );
}
