import React, { useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useFavorites } from '@/contexts/FavoriteContext';
import { useUnread } from '@/contexts/useUnread';


export default function AppLayout({ children }) {
    const { auth, filters } = usePage().props;
    const dropdownRef = React.useRef(null);
    const [isShowProfile, setIsShowProfile] = React.useState(false);
    const [searchText, setSearchText] = React.useState(filters?.title || '');
    const [isShowMobileMenu, setIsShowMobileMenu] = React.useState(false);

    const toggleMenu = () => setIsShowProfile(prev => !prev);
    const toogleMobileMenu = () => setIsShowMobileMenu(prev => !prev);

    const { clearFavorites } = useFavorites();

    const { unread, fetchUnread, increment } = useUnread();


    const logout = () => {
        router.post(route('logout'));
        window.location.reload();
        clearFavorites();
    }

    const handleSearch = (defualt = false) => {
        const query = {
            title: searchText || null,
            city_id: null,
            category_id: null,
        };
        if (defualt) {
            router.get(route('home'), {}, {
                preserveScroll: true,
                preserveState: true,
                replace: true, // не добавляет в историю
            });
            setSearchText('');
        } else {
            router.get(route('home'), query, {
                preserveScroll: true,
                preserveState: true,
                replace: true, // не добавляет в историю
            });
        }
    }

    useEffect(() => {
        const handleClickOutside = (evnet) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    useEffect(() => {
        fetchUnread();
    })

    useEffect(() => {
        if (!auth.user) return;
        console.log('📡 Подключение к приватному каналу... Номер комнаты', auth.user.id);
        const channel = window.Echo.private(`chat.${auth.user.id}`);
        channel.listen('.MessageSent', (e) => {
            // console.log('✅ Приватное сообщение:', e.message);
            playSound();
            increment();
        });

        return () => {
            window.Echo.leave(`chat.${auth.user.id}`);
        }
    }, []);


    const playSound = () => {
		const audio = document.getElementById('messageSound');
		if (audio) {
			audio.currentTime = 0;
			audio.volume = 0.4;
			audio.play().catch(err => {
				console.error('Ошибка при проигрывании звука:', err);
			});
		}
	}

    return (
        
        <div className="bg-[#121216] min-h-screen text-white font-['Space_Grotesk','Noto_Sans',sans-serif]">
            <nav className="bg-[#1a1a1f] border-b border-[#2c2c35] px-10 py-4 flex justify-between items-center border-b-1 border-[#888899]">
                <div className='flex items-center justify-between w-full block md:hidden '>
                    <Link href="/" className='text-2xl font-bold text-white flex items-center gap-2'>
                        <svg className="w-6 h-6" viewBox="0 0 48 48" fill="currentColor">
                            <path d="M24 45.8C..." />
                        </svg>
                        Ais<span className="text-[#b2b2e5]">|</span>Drop
                    </Link> 
                    <button onClick={toogleMobileMenu} className="md:hidden text-white focus:outline-none">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {isShowMobileMenu && (
                    <div className="md:hidden fixed top-10 mt-8 left-0 h-full w-full bg-[#1a1a1f] border-t border-[#2c2c35] z-20 p-4 space-y-4">
                        <Link href={route('home')} className="block text-white hover:text-[#b2b2e5]">Главная</Link>
                        <Link href={route('categories')} className="block text-white hover:text-[#b2b2e5]">Категории</Link>
                        <Link href={route('about')} className="block text-white hover:text-[#b2b2e5]">О нас</Link>
                        {auth.user && auth.user.role >= 2 && (
                            <Link href={route('admin.panel')} className="block text-white hover:text-[#b2b2e5]">Админ панель</Link>
                        )}
                        <div className="pt-2 border-t border-[#2c2c35]">
                            <input
                                onChange={(e) => setSearchText(e.target.value)}
                                value={searchText}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Поиск..."
                                className="w-full bg-[#2B2B36] rounded-md p-2 text-white placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#b2b2e5]"
                            />
                        </div>
                        {auth.user ? (
                            <>
                                <Link href={route('profile.index', 'my_ads')} className="block text-white hover:text-[#b2b2e5]">Профиль</Link>
                                <button onClick={logout} className="block text-left text-[#e53e3e] hover:text-white">Выйти</button>
                            </>
                        ) : (
                            <Link href="/login" className="block text-white hover:text-[#b2b2e5]">Войти</Link>
                        )}
                    </div>
                )}


                <div className='hidden md:flex justify-between w-full'>
                    <div className="flex items-center space-x-9 ">
                        <Link href="/" className="text-2xl font-bold text-white tracking-tight flex flex-row ">
                            <div className='size-4'>

                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                                    fill="currentColor"
                                    ></path>
                            </svg>
                            </div>
                            Ais<span className="text-[#b2b2e5]">|</span>Drop
                        </Link>
                        <Link href={route('home')} className="hover:text-[#b2b2e5] text-lg group relative">
                            Главная
                            <span
                            className="absolute left-0 right-0 bottom-0 h-[2px] w-0 bg-violet-400 mx-auto origin-center transition-all duration-300 group-hover:w-full"
                            />
                        </Link>
                        <Link href={route('categories')} className="hover:text-[#b2b2e5] text-lg group relative">
                            Категории
                            <span className='absolute left-0 right-0 bottom-0 h-[2px] w-0 bg-violet-400 mx-auto origin-center transition-all duration-300 group-hover:w-full' />
                        </Link>
                        <Link href={route('about')} className="hover:text-[#b2b2e5] text-lg group relative whitespace-nowrap">
                            О нас
                            <span className='absolute left-0 right-0 bottom-0 h-[2px] w-0 bg-violet-400 mx-auto origin-center transition-all duration-300 group-hover:w-full' />
                        </Link>
                        {auth.user && auth.user.role >= 2 && (
                            <Link href={route('admin.panel')} className="hover:text-[#b2b2e5] text-lg group relative whitespace-nowrap">
                                Админ панель
                                <span className='absolute left-0 right-0 bottom-0 h-[2px] w-0 bg-violet-400 mx-auto origin-center transition-all duration-300 group-hover:w-full' />
                            </Link>
                        )}

                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative inline-block">
                            <input
                                onChange={(e) => setSearchText(e.target.value)}
                                value={searchText}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                type="text"
                                placeholder="Поиск..."
                                className="border-none bg-[#2B2B36] rounded-lg pl-10 pr-1 py-2 focus:outline-none focus:ring-2 focus:ring-[#b2b2e5] text-[#fafafa] placeholder-[#A3A3B2]"
                            />
                            <svg
                                onClick={handleSearch}
                                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b2b2e5] cursor-pointer"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            { searchText && (
                                <button
                                type="button"
                                onClick={() => handleSearch(true)}
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
                        <Link href={route('sell')} className='bg-[#B2B2E5] hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-bold text-base'>Продать</Link>
                        <Link 
                            href={route('messages.main')} 
                            preserveScroll 
                            preserveState 
                            className="relative bg-[#2B2B36] hover:ring-2 hover:ring-[#b2b2e5] text-black py-2 px-2 rounded-lg font-bold text-base flex items-center">
                                
                        <span className={unread > 0 ? 'absolute bg-violet-300 w-2 h-2 rounded-full right-0 top-0 animate-ping' : ''}></span>
                            <svg
                                className="w-7 h-7 mr-1"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </Link>
                        
                        {/* Пример: isAuthenticated и userAvatarUrl должны приходить из props или контекста */}
                        {auth.user ? (
                            <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={toggleMenu}
                                            className="flex items-center cursor-pointer select-none focus:outline-none"
                                        >
                                            <span className="mr-2 text-white text-lg flex items-center">
                                                <svg className="w-6 h-6 mr-1 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="8" r="4" />
                                                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                                                </svg>
                                                {auth.user.name}
                                            </span>
                                            <img
                                                src={auth.user.avatar || 'https://ui-avatars.com/api/?name=' + auth.user.name}
                                                alt="Профиль"
                                                className="w-12 h-12 rounded-full border-2 border-[#b2b2e5] object-cover"
                                            />
                                        </button>

                                        {isShowProfile && (
                                            <div className="absolute right-0 mt-2 w-48 bg-[#23232b] border border-[#2c2c35] rounded-xl shadow-lg py-2 z-50 transition-all duration-200">
                                                <Link href={route('profile.index', 'my_ads')} className="block px-5 py-3 text-white hover:bg-[#2c2c35] transition text-left">
                                                    Профиль
                                                </Link>
                                                <Link href={route('profile.index', 'favorite')} className="block px-5 py-3 text-white hover:bg-[#2c2c35] transition text-left">
                                                    Избранные
                                                </Link>
                                                <Link href={route('profile.index', 'message')} className="block px-5 py-3 text-white hover:bg-[#2c2c35] transition text-left">
                                                    Отзывы
                                                </Link>
                                                <Link href={route('profile.index', 'setting')} className="block px-5 py-3 text-white hover:bg-[#2c2c35] transition text-left">
                                                    Настройки
                                                </Link>
                                                    <button
                                                        onClick={logout}
                                                        className="w-full text-left px-5 py-3 text-[#e53e3e] hover:bg-[#2c2c35] flex items-center gap-2 transition"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1" />
                                                        </svg>
                                                        Выйти
                                                    </button>
                                            </div>
                                        )}
                                    </div>

                        ) : (
                            <Link href="/login" className="flex items-center">
                                <span className="mr-2 text-white">Войти</span>
                                <div className="w-9 h-9 rounded-full bg-[#23232b] flex items-center justify-center border-2 border-[#b2b2e5]">
                                    <svg
                                        className="w-6 h-6 text-[#b2b2e5]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                                    </svg>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="">
                {children}
            </main>
            <audio id='messageSound' preload='auto' src="/sounds/notification1.wav"></audio>
            <footer className="text-center text-sm text-[#666] py-6">
                &copy; {new Date().getFullYear()} Ais|Drop. Все права защищены.
            </footer>
        </div>
    );
}
