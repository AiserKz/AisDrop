import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import ProfileAdRow from '@/Components/ProfileAdRow';
import ReviewCard from '@/Components/ReviewCard';
import ReviewForm from '@/Components/ReviewForm';

export default function UserProfile({ user, ads, fromItemId }) {
    const auth = usePage().props.auth;

    const sections = ['my_ads', 'message'];
    const [section, setSection] = useState(sections[0]);
    const currentIndex = sections.indexOf(section);

 
    return (
        <AppLayout>
            <Head title={user.name} />
            <div className="max-w-5xl mx-auto mt-6 rounded-2xl shadow-xl text-white">
                {/* Аватар и имя */}
                <Link
                    className=' top-0 right-0 text-white text-2xl bg-transparent border rounded-full w-10 h-10 flex 
                    items-center justify-center hover:bg-[#1a1a1f] transition duration-300 ease-in-out'
                    href={route('item', fromItemId)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path 
                            fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </Link>
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}
                        alt="Аватар"
                        className="w-28 h-28 rounded-full mb-4 border-4 border-[#b2b2e5] shadow-lg"
                        style={{ objectFit: 'cover' }}
                    />
                    <h2 className="text-3xl font-bold mb-1">{ user.name } <span className="text-gray-400 text-sm">ID: { user.id }</span></h2>
               
                    <div className="flex items-center mt-2">
                        <span className="text-yellow-400 mr-1 text-xl">★</span>
                        <span className="font-semibold text-[#b2b2e5] text-lg">{  user.rating || 4.5 }</span>
                        <span className="text-gray-400 ml-2 text-sm">({ user.reviews_received?.length } отзыва)</span>
                    </div>
                </div>

                {/* Информация о пользователе */}
                <div className="mb-8 bg-[#1a1a1f] rounded-xl p-6 border border-[#2c2c35]">
                    <div className="flex items-center mb-3">
                        <span className="font-medium w-32 text-[#b2b2e5]">Email:</span>
                        <span className="text-white">  { user.email || 'Не указан' }</span>
                    </div>
                    <div className="flex items-center mb-3">
                        <span className="font-medium w-32 text-[#b2b2e5]">Город:</span>
                        <span className="text-white">Алматы</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-medium w-32 text-[#b2b2e5]">Телефон:</span>
                        <span className="text-white">{user.phone}</span>
                    </div>
                    {/* Другая информация о пользователе */}
                    {user.is_banned === 1 && (
                        <div>
                            <div className="flex items-center mt-3">
                                <span className="font-medium w-32 text-[#b2b2e5]">Статус:</span>
                                <span className="text-red-400">Забанен</span>
                            </div>
                            <div className='flex items-center mt-3'>
                                <span className="font-medium w-32 text-[#b2b2e5]">Причина:</span>
                                <span className="text-red-400">{user.ban_reason}</span>
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
                                message: 'Отзывы',
                                }[s]}
                            </button>
                            ))}
                        </div>

                        {/* Линия под активной вкладкой */}
                        <div
                            className="absolute bottom-0 left-100 h-[2px] bg-[#b2b2e5] transition-all duration-300"
                            style={{
                            width: '50%',
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
                                            <ProfileAdRow key={item.id} item={item} user_id={user.id} isFullInfo={false} />
                                        ))}
                                    </ul>
                                ) : (
                                    <p>У вас нет объявлений.</p>
                                )}
                            </div>
                        )}
                        {section === 'message' && (
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">Отзывы</h3>

                                {user.reviews_received.length > 0 ? 
                                    user.reviews_received.map((item) => (
                                        <ReviewCard key={item.id} review={item} />
                                    ))
                                 : (
                                    <p className='text-gray-400'>{auth.user?.id == user.id ? 'У вас нет отзывов' : 'У пользователя нет отзывов'}</p>
                                )}
                 
                                {(auth.user?.id != user.id && auth.user?.id )&& (
                                    <div>
                                        <p>Ваш отзыв: </p>
                                        <ReviewForm toUserId={user.id} fromUserId={auth.user?.id} />
                                    </div>  
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
