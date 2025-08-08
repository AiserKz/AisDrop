import formatDate from "./formatDate"

export default function DialogCard({user, handleSelect, selectedId, date, dialogId, last_message, unread_messages }) {
    // console.log(user);
    return (
        <div
            key={user.id}
            onClick={() => handleSelect(dialogId)}
            className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition bg-opacity-80 hover:bg-[#181A20] ${
                selectedId === user.id ? "bg-[#181A20]" : ""
            }`}
        >
        <img
            src={user.avatar || "https://ui-avatars.com/api/?name=MP&background=393E46&color=fff"}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-[#b2b2e5] object-cover"
        />
        <div className="flex-1 min-w-0">
            <div className="text-white font-semibold truncate text-lg">{user.name}</div>
            <div className="text-[#a2a2b3] text-xs truncate">{last_message}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-[#b2b2e5]">{formatDate(date)}</span>
            {unread_messages > 0 && (
                <span className="bg-[#b2b2e5] text-[#181A20] text-xs rounded-full px-2 py-0.5 font-bold">
                    {unread_messages}
                </span>
            )}
        </div>
    </div>
    )
};