import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useFavorites } from '@/contexts/FavoriteContext';
import { useState } from 'react';
import ProfileAdRow from '@/Components/ProfileAdRow';
import SettingsSection from '@/Components/SettingSection';
import ReviewCard from '@/Components/ReviewCard';


export default function Profile() {
    const {auth} = usePage().props;
    const { favorites } = useFavorites();

    const sections = ['my_ads', 'favorite', 'message', 'setting'];
    const { section: defaultSection, ads } = usePage().props;
    const [section, setSection] = useState(defaultSection);
    const currentIndex = sections.indexOf(section);

    return (
        <AppLayout>
            <Head title="Профиль" />
            <div className="max-w-5xl mx-auto mt-6 rounded-2xl shadow-xl text-white">
                {/* Аватар и имя */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={auth.user.avatar || 'https://ui-avatars.com/api/?name=' + auth.user.name}
                        alt="Аватар"
                        className="w-28 h-28 rounded-full mb-4 border-4 border-[#b2b2e5] shadow-lg"
                        style={{ objectFit: 'cover' }}
                    />
                    <h2 className="text-3xl font-bold mb-1">{ auth.user.name } <span className="text-gray-400 text-sm">ID: { auth.user.id }</span></h2>
               
                    <div className="flex items-center mt-2">
                        <span className="text-yellow-400 mr-1 text-xl">★</span>
                        <span className="font-semibold text-[#b2b2e5] text-lg">{  auth.user.rating || 4.5 }</span>
                        <span className="text-gray-400 ml-2 text-sm">({ auth.user.reviews_received.length } отзыва)</span>
                    </div>
                </div>

                {/* Информация о пользователе */}
                <div className="mb-8 bg-[#1a1a1f] rounded-xl p-6 border border-[#2c2c35]">
                    <div className="flex items-center mb-3">
                        <span className="font-medium w-32 text-[#b2b2e5]">Email:</span>
                        <span className="text-white">  { auth.user.email || 'Не указан' }</span>
                    </div>
                    <div className="flex items-center mb-3">
                        <span className="font-medium w-32 text-[#b2b2e5]">Город:</span>
                        <span className="text-white">Алматы</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-medium w-32 text-[#b2b2e5]">Телефон:</span>
                        <span className="text-white">{auth.user.phone}</span>
                    </div>
                    {/* Другая информация о пользователе */}
                    {auth.user.is_banned === 1 && (
                        <div>
                            <div className="flex items-center mt-3">
                                <span className="font-medium w-32 text-[#b2b2e5]">Статус:</span>
                                <span className="text-red-400">Забанен</span>
                            </div>
                            <div className='flex items-center mt-3'>
                                <span className="font-medium w-32 text-[#b2b2e5]">Причина:</span>
                                <span className="text-red-400">{auth.user.ban_reason}</span>
                            </div>
                        </div>
                    )} 
                </div>

                {/* Горизонтальное меню разделов */}
                <div>
                    <div className="relative mb-4">
                        <div className="flex border-b border-[#2c2c35]">
                            {sections.map((s, i) => (
                            <button
                                key={s}
                                onClick={() => setSection(s)}
                                className={`flex-1 py-2 text-center font-medium transition ${
                                section === s ? 'text-[#b2b2e5] font-semibold' : 'text-gray-400 hover:text-[#b2b2e5]'
                                }`}
                            >
                                {{
                                my_ads: 'Мои объявления',
                                favorite: 'Избранные',
                                message: 'Отзывы',
                                setting: 'Настройки',
                                }[s]}
                            </button>
                            ))}
                        </div>

                        {/* Линия под активной вкладкой */}
                        <div
                            className="absolute bottom-0 left-0 h-[2px] bg-[#b2b2e5] transition-all duration-300"
                            style={{
                            width: '25%',
                            transform: `translateX(${currentIndex * 100}%)`,
                            }}
                        />
                    </div>
                    {/* Здесь можно добавить содержимое выбранного раздела */}
                    <div className="p-6 text-[#b2b2e5]  bg-[#1a1a1f] rounded-xl border border-[#2c2c35]">
                        {section === 'my_ads' && (
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">Мои объявления</h3>
                        
                                {ads.length > 0 ? (
                                    <ul>
                                        {ads.map((item) => (
                                            <ProfileAdRow key={item.id} item={item} user_id={auth.user.id} />
                                        ))}
                                    </ul>
                                ) : (
                                    <p>У вас нет объявлений.</p>
                                )}
                            </div>
                        )}
                        {section === 'favorite' && (
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">Избранные объявления</h3>
                                {favorites.length > 0 ? (
                                    <ul>
                                        {favorites.map((item) => (
                                        
                                                <ProfileAdRow key={item.id} item={item} user_id={auth.user.id} />
        
                                        ))}
                                    </ul>
                                ) : (
                                    <p>У вас нет избранных объявлений.</p>
                                )}
                            </div>
                        )}
                        {section === 'message' && (
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">Отзывы</h3>

                                {auth.user.reviews_received.length > 0 ?  
                                    auth.user.reviews_received.map((item) => (
                                    <ReviewCard key={item.id} review={item} />
                                )) : (
                                    <p>У вас нет отзывов.</p>
                                )}
                            </div>
                        )}
                        {section === 'setting' && (
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">Настройки</h3>
                                <SettingsSection user={auth.user} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
