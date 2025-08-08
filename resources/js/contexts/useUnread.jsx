// stores/useUnread.js
import { useState } from 'react';

let cachedUnread = null; // глобальный кэш

export const useUnread = () => {
	const [unread, setUnread] = useState(cachedUnread ?? 0);

	const fetchUnread = async () => {
		if (cachedUnread !== null) return; // уже есть — не загружаем снова
        console.log('Загрузка непрочитанных...');
		try {
			const res = await axios.get('/api/unread-dialogs');
			cachedUnread = res.data.total_unread;
			setUnread(cachedUnread);
		} catch (err) {
			console.warn('Ошибка загрузки непрочитанных:', err);
		}
	};

	const increment = () => {
		cachedUnread += 1;
		setUnread(cachedUnread);
	};

	const decrement = (amount = 1) => {
		cachedUnread = Math.max((cachedUnread ?? 0) - amount, 0);
		setUnread(cachedUnread);
	};

	const reset = () => {
		cachedUnread = 0;
		setUnread(0);
	};

	const setValue = (value) => {
		cachedUnread = value;
		setUnread(value);
	};

	return {
		unread,
		fetchUnread,
		increment,
		decrement,
		reset,
		setValue
	};
};
