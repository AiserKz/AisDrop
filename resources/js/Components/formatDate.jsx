const formatDate = (dateString) => {
	if (!dateString || typeof dateString !== 'string') return '—';

	// Убираем всё после секунд и вставляем .000Z
	const cleanDate = dateString
		.replace(/\.\d{3,6}Z$/, '')     // убирает и милли-, и микросекунды
		.replace(/\.\d+\.\d+Z$/, '')    // убирает двойные точки (на всякий)
		+ '.000Z';

	const date = new Date(cleanDate);
	if (isNaN(date.getTime())) return 'Неверная дата';

	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


export default formatDate;