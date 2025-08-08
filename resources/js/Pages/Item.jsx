import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import RattingStars from '@/Components/rattingStar';
import { MapContainer, TileLayer, Popup, Circle } from 'react-leaflet';
import FavorButton from '@/Components/FavorButton';

const report_release = [
    { name: 'Нарушение правил', value: 'Нарушение правил' },
    { name: 'Вредная реклама', value: 'Вредная реклама' },
    { name: 'Дублирование', value: 'Дублирование' },
    { name: 'Запрещенные товары', value: 'Запрещенные товары' },
    { name: 'Другое', value: 'Другое' },
]


export default function Item({ itemId, onClose }) {
    const [item, setItem] = useState(null);
    const images = item?.images || [];
    const [current, setCurrent] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [showContact, setShowContact] = useState(false);

    const [showReport, setShowReport] = useState(false);
    const [selectReason, setSelectReason] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [errors, setErrors] = useState({});
    console.log(item);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((current + 1) % images.length);
        }, 5000);
        router.get(`/item/${itemId}`, {}, {
            preserveScroll: true,
            only: ['item'],
            onSuccess: (page) => {
                setItem(page.props.ad);
            }
        });

        return () => clearInterval(interval);
    }, [])
    
    if (!item) {
        return (
            <AppLayout>
                <Head title="Ais|Drop — Товар не найден" />
                <div className="py-12 bg-[#121216] min-h-screen text-white flex items-center justify-center">
                <Link href="/" className="text-2xl text-[#b2b2e5]  flex items-center justify-center bg-[#23232b] rounded-full p-4 transition m-2">
                    <button className="text-[#b2b2e5] hover:text-white bg-[#23232b] rounded-full px-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </Link>
                    <h2 className="text-2xl text-[#b2b2e5]">Товар не найден, либо он был удален или забанен.</h2>
                </div>
            </AppLayout>
        );
    }

    const submitReport = (e) => {
        e.preventDefault();

        if (!selectReason) return setErrors({ reason: 'Выберите причину' });

        const reason = selectReason === 'Другое' ? reportReason : selectReason;
        
        router.post(route('reports.store'), {
            ad_id: item.id,
            reason: reason,
        }, {
            onSuccess: () => {
                setShowReport(false);
                setSelectReason('');
                setReportReason('');
                setErrors({});
     
            },
            onError: (err) => {
                setErrors(err);
            }
        });
    }

    // Категория для хлебных крошек (пример, если появится поле category)
    const category = item.category?.name || 'Категория';

    return (
        <AppLayout>
            <Head title={`${item.title}`} />
            {/* Кнопка назад ебаная */}
            <div className="max-w-4xl mx-auto px-6 pt-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                {/* Кнопка назад */}
                <Link
                    href="/"
                    className="text-[#b2b2e5] hover:text-white bg-[#23232b] rounded-full p-2 transition border border-[#2c2c35]"
                    aria-label="Назад"
                    >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

                {/* Хлебные крошки */}
                <div className="flex-1 min-w-0">
                <nav className="text-base text-[#b2b2e5] flex flex-wrap items-center gap-x-2 gap-y-1 overflow-hidden text-ellipsis whitespace-normal break-words">
                    <a href="/" className="hover:text-[#fafafa] truncate max-w-[150px]">Главная</a>
                    <span>/</span>
                    <a href="#" className="hover:text-[#fafafa] truncate max-w-[150px]">{category}</a>
                    <span>/</span>
                    <span className="text-white font-semibold truncate max-w-[200px]">{item.title}</span>
                    <span>•</span>
                    <span className="text-sm text-gray-400 whitespace-nowrap">{item.views} просмотров </span>
      
                </nav>
                </div>

                {/* Кнопка "Пожаловаться" */}
                <div className="flex-shrink-0 flex items-center">
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl 
                    text-[#f87171] hover:bg-[#2c2c35] hover:text-white font-medium transition text-sm shadow"
                    onClick={() => setShowReport(true)}
                >
                    <span className="text-sm text-gray-600 whitespace-nowrap">ID: {item.id} • </span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
                    </svg>
                    Пожаловаться
                </button>
                </div>
            </div>
            </div>


            {!fullscreen && (
                <div className="py-4 bg-[#121216] min-h-screen text-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10">
                            <div className="w-full md:w-96 flex flex-col items-center">
                                <div className="relative w-full h-72 cursor-pointer group" onClick={() => setFullscreen(true)}>
                                    <img
                                        src={images[current]?.url}
                                        alt={item.title}
                                        className="w-full h-72 object-cover rounded-2xl shadow-lg border border-[#2c2c35] bg-[#23232b] group-hover:opacity-90 transition"
                                    />
                                    {images.length > 0 && (
                                        <>
                                            <button
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#23232b] bg-opacity-70 rounded-full p-2 text-white hover:bg-[#b2b2e5] hover:text-[#23232b] transition"
                                                onClick={e => { e.stopPropagation(); setCurrent((current - 1 + images.length) % images.length); }}
                                                aria-label="Предыдущее фото"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <button
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#23232b] bg-opacity-70 rounded-full p-2 text-white hover:bg-[#b2b2e5] hover:text-[#23232b] transition"
                                                onClick={e => { e.stopPropagation(); setCurrent((current + 1) % images.length); }}
                                                aria-label="Следующее фото"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </>
                                    )}
                                    <span className="absolute bottom-2 right-2 bg-[#23232b] bg-opacity-80 text-xs px-2 py-1 rounded text-[#b2b2e5] hidden group-hover:block">На весь экран</span>
                                </div>
                                {images.length > 1 && (
                                    <div className="flex gap-2 mt-3">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-4 h-4 rounded-full border-2 ${current === idx ? 'border-[#b2b2e5] bg-[#b2b2e5]' : 'border-[#2c2c35] bg-[#23232b]'}`}
                                                onClick={e => { e.stopPropagation(); setCurrent(idx); }}
                                                aria-label={`Перейти к фото ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-4xl font-bold text-white">{item.title}</h1>
                                    <FavorButton ad={item} />
                                </div>
                                <div className="flex items-center gap-4 mb-2">
                                    <p className="text-lg text-[#b2b2e5]">{item.city?.name}</p>
                                    <span className="text-sm text-[#7c7ca6]">•</span>
                                    <span className="text-sm text-[#b2b2e5]">
                                        {new Date(item.created_at).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold mb-6 text-[#b2b2e5]">{item.price?.toLocaleString()} ₸</p>
                                <button
                                    className="bg-[#B2B2E5] hover:bg-gray-200 text-[#121218] py-3 px-8 rounded-xl font-bold text-lg transition mb-4"
                                    onClick={() => setShowContact(true)}
                                >
                                    Связаться с продавцом
                                </button>
                                {/* Рейтинг пользователя */}
                                <div className="flex items-center gap-2 mt-2">
                                    <img src={item.user?.avatar || 'https://ui-avatars.com/api/?name=' + item.user?.name} alt="User" className="w-10 h-10 rounded-full border-2 border-[#b2b2e5] object-cover" />
                                    <div>
                                        <div className="font-semibold text-white">{item.user?.name}</div>
                                        <div className="flex items-center gap-1">
                                          
                                            <RattingStars rating={item.user?.rating} />
                                            <span className="ml-2 text-sm text-[#b2b2e5]">{item.user?.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Описание товара */}
                        <div className="bg-[#23232b] rounded-2xl p-6 mb-10 shadow border border-[#2c2c35]">
                            <h2 className="text-2xl font-bold mb-4 text-white">Описание</h2>
                            <p className="text-base text-[#fafafa]">{item.description}</p>
                        </div>
                        {/* Карта */}
                        <div className="bg-[#23232b] rounded-2xl p-6 shadow border border-[#2c2c35] flex flex-col items-center ">
                            <h2 className="text-2xl font-bold mb-4 text-white">Местоположение</h2>
                            <MapContainer
                                center={[item.cor_y, item.cor_x]} // Алматы
                                zoom={13}
                                className="h-[400px] w-full rounded-lg"
                                
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Circle
                                    center={[item.cor_y, item.cor_x]}
                                    radius={1000} // в метрах
                                    pathOptions={{
                                        color: '#b2b2e5',
                                        fillColor: '#b2b2e5',
                                        fillOpacity: 0.2
                                    }}
                                >
                                    <Popup>В радиусе 1 км</Popup>
                                </Circle>
                            </MapContainer>
                        </div>  
                    </div>
                </div>
            )}
            {/* Фуллскрин просмотр */}
            {fullscreen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center" onClick={() => setFullscreen(false)}>
                    <button
                        className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-[#b2b2e5] transition"
                        onClick={e => { e.stopPropagation(); setFullscreen(false); }}
                        aria-label="Закрыть"
                    >
                        &times;
                    </button>
                    <div className="relative w-full max-w-2xl flex flex-col items-center">
                        <img
                            src={images[current]?.url}
                            alt={item.title}
                            className="w-full max-h-[80vh] object-contain rounded-2xl shadow-lg border border-[#2c2c35] bg-[#23232b]"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#23232b] bg-opacity-70 rounded-full p-2 text-white hover:bg-[#b2b2e5] hover:text-[#23232b] transition"
                                    onClick={e => { e.stopPropagation(); setCurrent((current - 1 + images.length) % images.length); }}
                                    aria-label="Предыдущее фото"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#23232b] bg-opacity-70 rounded-full p-2 text-white hover:bg-[#b2b2e5] hover:text-[#23232b] transition"
                                    onClick={e => { e.stopPropagation(); setCurrent((current + 1) % images.length); }}
                                    aria-label="Следующее фото"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </>
                        )}
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`w-4 h-4 rounded-full border-2 ${current === idx ? 'border-[#b2b2e5] bg-[#b2b2e5]' : 'border-[#2c2c35] bg-[#23232b]'}`}
                                        onClick={e => { e.stopPropagation(); setCurrent(idx); }}
                                        aria-label={`Перейти к фото ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Модальное окно контактов */}
            {showContact && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center" onClick={() => setShowContact(false)}>
                    <div className="bg-[#23232b] rounded-2xl p-8 shadow-lg border border-[#2c2c35] min-w-[320px] relative" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-3 right-4 text-2xl text-[#b2b2e5] hover:text-white"
                            onClick={() => setShowContact(false)}
                            aria-label="Закрыть"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-white text-center">Связаться с продавцом</h2>
                        <div className="flex flex-col gap-4">
                            <button
                                className="w-full bg-[#b2b2e5] hover:bg-[#a2a2b3] text-[#121218] font-bold py-3 rounded-xl text-lg transition flex items-center justify-center gap-2"
                                // onClick={() => window.open(`tel:${item.user.phone}`)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V19a2 2 0 01-2 2A19.72 19.72 0 013 5a2 2 0 012-2h2.09a2 2 0 012 1.72c.13.81.38 1.6.73 2.34a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 012.11-.45c.74.35 1.53.6 2.34.73A2 2 0 0122 16.92z" />
                                </svg>
                                Позвонить: {item.user.phone}
                            </button>
                            <button
                                className="w-full bg-[#23232b] hover:bg-[#1a1a1f] text-[#b2b2e5] border border-[#b2b2e5] font-bold py-3 rounded-xl text-lg transition flex items-center justify-center gap-2"
                                onClick={() => alert('Открыть чат с продавцом (заглушка)')}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                                Написать в чат
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Модальное окно репорта */}
            {showReport && (
                <div className='fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center z-10 '>
                    <div className="transition ease-in duration-300 bg-[#23232b] rounded-2xl p-8 shadow-lg border border-[#2c2c35] min-w-[500px] min-h-[400px] relative" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-3 right-4 text-2xl text-[#b2b2e5] hover:text-white"
                            onClick={() => setShowReport(false)}
                            aria-label="Закрыть"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-white text-center">Сообщить о нарушении</h2>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-4"> 
                                {report_release.map((reason, index) => (
                                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={reason.name}
                                            checked={selectReason === reason.name}
                                            onChange={() => setSelectReason(reason.name)}
                                            className="accent-purple-500 w-6 h-6 bg-[#23232b] border border-[white] rounded-xl text-[#b2b2e5]"
                                        />
                                        <span className="text-[#b2b2e5] text-lg">{reason.name}</span>
                                    </label>
                                ))}
                                <textarea placeholder='Опишите причину' name="reason" id="" disabled={selectReason !== 'Другое'} 
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className={`bg-[#23232b] border border-[#2c2c70] rounded-lg p-2 text-[#b2b2e5] resize-none ${selectReason !== 'Другое' ? 'hidden' : ''}`}>
                                        
                                    </textarea>
                            </div>
                            <button onClick={submitReport} className='w-full bg-[#b2b2e5] hover:bg-[#a2a2b3] text-[#121218] font-bold py-3 rounded-xl text-lg transition flex items-center justify-center gap-2'>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Пожаловаться
                            </button>
                            <button
                                className="w-full bg-[gray] hover:bg-[#a2a2b3] text-[#121218] font-bold py-3 rounded-xl text-lg transition flex items-center justify-center gap-2"
                                onClick={() => setShowReport(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Закрыть
                            </button>
                            {errors.reason && <div className="text-red-500 mt-2 text-center">{errors.reason}</div>}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
