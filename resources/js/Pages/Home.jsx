import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import ItemCard from '@/Components/ItemCard';
import {usePage} from '@inertiajs/react';
import { useFavorites } from '@/contexts/FavoriteContext';
import ItemModal from '@/Components/ItemModal';


export default function Home({ item }) {
    const [ad, setAd] = useState(item);

    const { ads, categories, cities, filters } = usePage().props;
    const { favorites, getFavorites } = useFavorites();
    const [adsData, setAdsData] = useState(ads?.data);

    const [loading, setLoading] = useState(true);

    const [searchTitle, setSearchTitle] = useState(filters?.title || '');
    const [searchCity, setSearchCity] = useState(filters?.city_id || '');
    const [searchCategory, setSearchCategory] = useState(filters?.category_id || '');

 

    useEffect(() => {
        if (favorites.length === 0) {
            getFavorites();
        }
        setLoading(false);
    }, []);

    useEffect(() => {
   
        setAd(item);
    }, [item]);

    useEffect(() => {
        setAdsData(ads?.data);
        
    }, [ads]);

    const searchFetch = (defult=false) => {
        setLoading(true);

        const query = {
            title: searchTitle || null,
            city_id: Number(searchCity) || null,
            category_id: Number(searchCategory)|| null,
        };
        // console.log(query, defult)
        if (defult) {
            console.log('Отпаврка 1 ');
            router.get(route('home'), {}, {
                preserveScroll: true,
                preserveState: true,
                replace: true, // не добавляет в историю
            });
        } else {
            router.get(route('home'), query, {
                preserveScroll: true,
                preserveState: true,
                replace: true, // не добавляет в историю
            });
        }

   
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    const closeModal = () => {
        const query = {
        title: searchTitle || null,
        city_id: searchCity || null,
        category_id: searchCategory || null,
        };

        setAd(null);
        router.get(route('home'), query, {
            preserveScroll: true,
            replace: true
        });
    };

    const resetSearch = () => {
        setSearchTitle('');
        setSearchCity('');
        setSearchCategory('');
        searchFetch(true);
    }

    return (
        <AppLayout>
            <Head title="Главная" />
                {!ad ? (
                    <div className="py-12 bg-[#121216] min-h-screen text-white">
                        <meta name='csrf-token' />
                            <div className="max-w-7xl mx-auto px-6">
                                <h1 className="text-4xl font-bold mb-10 text-center text-white">
                                    Добро пожаловать в <span className="text-[#b2b2e5]">Ais|Drop</span>
                                </h1>
                                <div className='flex justify-center mb-6 relative'>
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    className="px-10 py-4 pr-12 rounded-xl bg-[#2c2c35] text-white border-none placeholder-[#a2a2b3] w-full text-lg"
                                    onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        searchFetch(false);
                                    }
                                    }}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                    autoComplete="off"
                                    value={searchTitle}
                                />

                                {/* Иконка поиска слева */}
                                <button 
                                    onClick={() => searchFetch(false)}
                                >

                                    <svg
                                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b2b2e5]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        >
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>

                                {/* Крестик справа (если есть текст) */}
                                {(searchTitle || searchCity || searchCategory) && (
                                    <button
                                    type="button"
                                    onClick={resetSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#b2b2e5] hover:text-white"
                                    aria-label="Очистить поиск"
                                    >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    </button>
                                )}
                                </div>

                                {/* Фильтры */}
                                <div className="flex flex-wrap gap-4 mb-6 justify-left">
                                    <select className="px-4 py-2 rounded-xl bg-[#2c2c35] text-white border-none w-28">
                                        <option value="">Фильтры</option>
                                        <option value="new">Новые</option>
                                        <option value="popular">Популярные</option>
                                    </select>
                                    <select className="px-4 py-2 rounded-xl bg-[#2c2c35] text-white border-none w-52"
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                        value={searchCategory}
                                    >
                                        <option value="">Все категории</option>
                                        {categories?.map((category) => (
                                            <option key={category.id} value={category.id} >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                        <select
                                            className="px-4 py-2 rounded-xl bg-[#2c2c35] text-white border-none w-52"
                                            onChange={(e) => setSearchCity(e.target.value)}
                                            value={searchCity}
                                        >
                                        <option value="">Любой город</option>
                                        {cities?.map((c) => (
                                            <option key={c.id} value={c.id} >
                                            {c.name}
                                            </option>
                                        ))}
                                        </select>
                                </div>

                                {/* Объявления */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
                                {loading ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-[#666]">
                                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p>Загрузка объявлений...</p>
                                    </div>
                                    ) : (
                                    adsData?.length > 0 ? (
                                        adsData.map((ad) => (
                                            <ItemCard key={ad.id} item={ad} />
                                        ))
                                    ) : (
                                        <p className="text-center col-span-full text-[#666]">Нет объявлений </p>
                                    )
                                    )}
                                </div>
                            </div>
                        </div>
                ) : <ItemModal item={item} onClose={closeModal} />}
        </AppLayout>
    );
}
