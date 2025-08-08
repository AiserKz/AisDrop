import { useForm, usePage } from '@inertiajs/react';

export default function ReviewForm({ toUserId, fromUserId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        to_user_id: toUserId,
        from_user_id: fromUserId,
        rating: '',
        comment: '',
    });

    const { flash } = usePage().props;
    const submit = (e) => {
        e.preventDefault();

        post(route('reviews.store'), {
            onSuccess: () => {
                reset(); // очищаем форму после успешной отправки
            },
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4 m-2">
            {flash?.error && <div className="text-red-600">{flash.error}</div>}
            <div>
                <label htmlFor="rating">Оценка (1–5 звёзд):</label>
                <input
                    type="number"
                    id="rating"
                    min="1"
                    max="5"
                    value={data.rating}
                    onChange={(e) => setData('rating', e.target.value)}
                    className="border p-2 rounded w-full bg-transparent"
                />
                {errors.rating && <div className="text-red-600">{errors.rating}</div>}
            </div>

            <div>
                <label htmlFor="comment">Комментарий:</label>
                <textarea
                    id="comment"
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    className="border p-2 rounded w-full  h-24 bg-transparent"
                    placeholder='Ваш комментарий'
                />
                {errors.comment && <div className="text-red-600">{errors.comment}</div>}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
                Отправить отзыв
            </button>
        </form>
    );
}
