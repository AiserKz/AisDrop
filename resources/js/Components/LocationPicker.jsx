import React, { useState, useEffect } from 'react';
import { Marker, useMapEvents, useMap } from 'react-leaflet';

const LocationPicker = ({ onLocationChange }) => {
    const [position, setPosition] = useState(null);
    const map = useMap();

    // Обработка клика по карте
    useMapEvents({
        click(e) {
            const coords = e.latlng;
            setPosition(coords);
            onLocationChange(coords);
        },
    });

    // Функция: определить геопозицию и установить маркер
    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Ваш браузер не поддерживает геолокацию');
            return;
        }
          const confirmed = window.confirm(
            "Мы запрашиваем ваше местоположение, чтобы указать точку на карте. Разрешить?"
        );
        if (!confirmed) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                setPosition(coords);
                onLocationChange(coords);
                map.setView(coords, 13);
            },
            (err) => {
                if (err.code === 1) {
                    console.warn('Пользователь отказал в доступе к геолокации');
                } else {
                    console.warn('Ошибка геолокации:', err.message);
                }
            }
        );
    };

    return (
        <>
            {position && <Marker position={position} />}
            <button
                type="button"
                onClick={detectLocation}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000,
                }}
                className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
            >
                📍 Указать моё местоположение
            </button>
        </>
    );
};

export default LocationPicker;
