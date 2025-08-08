import React, { useState } from "react";

export default function AvatarPicker({ user, onChange }) {
    const [preview, setPreview] = useState(user.avatar || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            onChange(e);
        }
    };

    return (
        <div className="flex items-center gap-6">
            {/* Превью аватара */}
            <img
                src={
                    preview ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#2c2c35] shadow"
            />

            {/* Кнопка выбора файла */}
            <div>
                <label
                    htmlFor="avatar"
                    className="cursor-pointer bg-[#b2b2e5] text-[#181A20] px-4 py-2 rounded-md font-semibold hover:bg-[#a0a0d8] transition block"
                >
                    Выбрать аватар
                </label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                <p className="text-gray-400 text-sm mt-1">JPG/PNG до 2MB</p>
            </div>
        </div>
    );
}
