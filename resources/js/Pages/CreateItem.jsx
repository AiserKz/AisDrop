import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationPicker from '@/Components/LocationPicker';
import { route } from 'ziggy-js';




export default function CreateItem() {

    const { cities, categories } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: '',
        city: '',
        price: '',
        image: [],
        draft: false,
        cor_x: '',
        cor_y: '',
    });

    const [images, setImages] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const [coords, setCoords] = useState({ lat: null, lng: null });

    useEffect(() => {   
        console.log(coords);
        setData('cor_x', coords.lng);
        setData('cor_y', coords.lat);
    }, [coords])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('image', files);
        setImages(prev => [
            ...prev,
            ...files.map(file => ({
                file,
                url: URL.createObjectURL(file)
            }))
        ]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length) {
            setData('image', files);
            setImages(prev => [
                ...prev,
                ...files.map(file => ({ file, url: URL.createObjectURL(file) }))
            ]);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };
    const removeImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setData('image', images.filter((_, i) => i !== idx).map(img => img.file));
    };

    const handleSubmit = (e, draft = false) => {
        console.log(data);
        e.preventDefault();
        setData('draft', draft);
        post(route('items.store'), {
            forceFormData: true
        });
    };

    return (
        <AppLayout>
            <Head title="Добавить товар" />
            <div className="max-w-4xl mx-auto py-5 px-6 bg-[#23232b] rounded-2xl shadow-xl border border-[#2c2c35] text-white mt-7">
                <div className="flex items-center mb-6">
                    <Link
                        href={route('home')}
                        className="text-[#b2b2e5] hover:text-white bg-[#23232b] rounded-full p-2 transition border border-[#2c2c35] mr-4"
                        aria-label="Назад"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-center text-[#b2b2e5] flex-1">Добавить товар</h1>
                </div>
                <form onSubmit={e => handleSubmit(e, false)}>
                    <div className="mb-5">
                        <label className="block mb-2 font-semibold text-[#b2b2e5]">Название</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f] border border-[#2c2c35] focus:ring-2 focus:ring-[#b2b2e5] text-white"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <div className="text-red-400 text-sm mt-1">{errors.title}</div>}
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 font-semibold text-[#b2b2e5]">Описание</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f] border border-[#2c2c35] focus:ring-2 focus:ring-[#b2b2e5] text-white min-h-[100px]"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            required
                        />
                        {errors.description && <div className="text-red-400 text-sm mt-1">{errors.description}</div>}
                    </div>
                    <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-semibold text-[#b2b2e5]">Категория</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f] border border-[#2c2c35] text-white"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                required
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category && <div className="text-red-400 text-sm mt-1">{errors.category}</div>}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-[#b2b2e5]">Город</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f] border border-[#2c2c35] text-white"
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                                required
                            >
                                <option value="">Выберите город</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                            {errors.city && <div className="text-red-400 text-sm mt-1">{errors.city}</div>}
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 font-semibold text-[#b2b2e5]">Цена (₸)</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full px-4 py-3 rounded-xl bg-[#1a1a1f] border border-[#2c2c35] focus:ring-2 focus:ring-[#b2b2e5] text-white"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            required
                        />
                        {errors.price && <div className="text-red-400 text-sm mt-1">{errors.price}</div>}
                    </div>
                    <div className="mb-8">
                        <label className="block mb-2 font-semibold text-[#b2b2e5]">Фото товара</label>
                        <div
                            className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl p-6 transition ${dragActive ? 'border-[#b2b2e5] bg-[#23234a]' : 'border-[#2c2c35] bg-[#1a1a1f]'}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <label className="flex items-center px-4 py-2 bg-[#b2b2e5] text-[#121218] rounded-xl font-bold cursor-pointer hover:bg-[#a2a2b3] transition mb-2">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                Загрузить фото
                                <input type="file" accept="image/*" className="hidden" multiple onChange={handleImageChange} />
                            </label>
                            <span className="text-[#b2b2e5] text-sm">или перетащите сюда фото с рабочего стола</span>
                            <div className="flex flex-wrap gap-4 justify-center mt-4 w-full">
                                {images.length > 0 ? images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img.url} alt="Фото" className="w-32 h-32 object-cover rounded-xl border border-[#2c2c35]" />
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-[#23232b] bg-opacity-80 rounded-full p-1 text-white hover:text-[#e53e3e] transition opacity-0 group-hover:opacity-100">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                )) : (
                                    <span className="text-[#666] text-sm">Нет выбранных фото</span>
                                )}
                            </div>
                        </div>
                        {errors.image && <div className="text-red-400 text-sm mt-1">{errors.image}</div>}
                    </div>
                    <div>
                        <MapContainer
                            center={[43.227553471134826, 76.67843341827394]}
                            zoom={13}
                            style={{ height: '400px', width: '100%' }}
                            className='border border-[#2c2c35] rounded-xl'
                        >
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            />
                            <LocationPicker onLocationChange={(coords) => setCoords(coords)} />
                        </MapContainer>
                        <input type="hidden" name='cor_x' value={coords.lng || ''} />
                        <input type="hidden" name='cor_y' value={coords.lat || ''} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-8">
                        <button
                            type="submit"
                            className="flex-1 bg-[#b2b2e5] hover:bg-[#a2a2b3] text-[#121218] font-bold py-3 rounded-xl text-lg transition"
                        >
                            Опубликовать
                        </button>
                        <button
                            type="button"
                            className="flex-1 bg-[#23232b] border border-[#b2b2e5] hover:bg-[#1a1a1f] text-[#b2b2e5] font-bold py-3 rounded-xl text-lg transition"
                            onClick={e => handleSubmit(e, true)}
                        >
                            Сохранить как черновик
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
