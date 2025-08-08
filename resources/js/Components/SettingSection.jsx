import React from "react";
import AvatarPicker from "./AvatarPicker";
import { useForm } from "@inertiajs/react";


export default function SettingsSection({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        avatar: user.avatar || "",
    })
    const [succes, setSuccess] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Отправка данных:", data);
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Дополнительные действия после успешного обновления профиля
                setSuccess(true);
                console.log("Профиль успешно обновлен!");
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className=" rounded-xl p-2 shadow-md max-w-3xl mx-auto space-y-6">
            {succes && (
                <div className="bg-opacity-25 bg-green-600 text-white p-4 rounded-md mb-4">
                    Профиль успешно обновлен!
                </div>
            )}

            {/* Аватар */}
            <AvatarPicker user={user} onChange={(e) => setData('avatar', e.target.files[0])} />

            {/* Настройки данных */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Имя</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full bg-[#23262F] text-white p-2 rounded-md border border-[#2c2c35] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Телефон</label>
                    <input
                        type="text"
                        value={data.phone}
                        disabled
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full bg-[#23262F] text-white p-2 rounded-md border border-[#2c2c35] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={data.email || "Не указан"}
                        disabled
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full bg-[#23262F] text-white p-2 rounded-md border border-[#2c2c35] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Рейтинг</label>
                    <input
                        type="text"
                        value={user.rating}
                        disabled
                        className="w-full bg-[#23262F] text-white p-2 rounded-md border border-[#2c2c35] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Роль</label>
                    <input
                        type="text"
                        value={user.role === "admin" ? "Администратор" : "Пользователь"}
                        disabled
                        className="w-full bg-[#23262F] text-white p-2 rounded-md border border-[#2c2c35] focus:outline-none"
                    />
                </div>
            </div>

            {/* Действия */}
            <div className="flex justify-end pt-4">
                <button className="px-4 py-2 bg-[#b2b2e5] text-[#181A20] rounded-md hover:bg-[#a0a0e0] font-semibold transition">
                    Изменить профиль
                </button>
            </div>
        </form>
    );
}
