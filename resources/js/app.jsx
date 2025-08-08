import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { FavoriteProvider } from '@/contexts/FavoriteContext';

const token = document.querySelector('meta[name="csrf-token"]');

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}
axios.defaults.withCredentials = true;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

axios.get('/sanctum/csrf-cookie').then(() => createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <FavoriteProvider>
                <App {...props} />
            </FavoriteProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
}));
