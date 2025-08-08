import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher', // Reverb работает как pusher-совместимый сервер
    key: 'local',
    wsHost: '127.0.0.1',
    wsPort: 6002,
    forceTLS: false,
    enabledTransports: ['ws'],
    disableStats: true,
    authEndpoint: '/broadcasting/auth',
    cluster: 'mt1',
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
    },
});

window.Echo = echo;

echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ Echo подключён к Reverb');
});

export default echo;
