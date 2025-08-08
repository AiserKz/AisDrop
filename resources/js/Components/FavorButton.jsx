import { useFavorites } from '../contexts/FavoriteContext';
import { useState } from 'react';

export default function FavorButton({ ad }) {
  const { favorites, addToFavorite, removeFromFavorite } = useFavorites();
  const isFavorite = favorites.some(f => f.id === ad.id);
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    isFavorite ? removeFromFavorite(ad.id) : addToFavorite(ad.id, ad);
  };

  return (
    <button
      onClick={handleClick}
      className="ml-4 p-2 rounded-full hover:bg-[#23232b] transition border border-[#2c2c35] group"
      title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <svg
        className={`w-8 h-8 transition ${
          isFavorite ? 'text-red-500 fill-current' : 'text-[#b2b2e5] fill-none'
        } group-hover:text-red-400 ${animate ? 'animate-pop' : ''}`}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 27"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 19.071A7 7 0 0112 5a7 7 0 016.879 14.071l-6.293 6.293a1 1 0 01-1.414 0l-6.293-6.293z"
        />
      </svg>
    </button>
  );
}
