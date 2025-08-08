
export default function MessageBody ({ msg, user, formatDate }) {
    const isSender = msg.sender_id === user.id;
    return (
        <div
            key={msg.id}
            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
        >
            {isSender && (
                <div className="text-[#b2b2e5] text-sm font-semibold flex items-end mr-2">
                    {msg.is_read === 0 ?
                        <div className="text-[#b2b2e5] text-sm font-semibold">
                            ✔
                        </div>:
                        <div className="text-[#b2b2e5] text-sm font-semibold">
                            ✔✔
                        </div>
                    }
                </div>
            )}
            <div
                className={`max-w-[80%] px-6 py-3 rounded-2xl shadow-lg text-base break-words text-[#fafafa] ${
                    isSender
                        ? "bg-gradient-to-br from-[#b2b2e5] to-[#23262F] text-[#181A20]"
                        : "bg-[#23262F] text-white"
                }`}
            >											
                {msg.body}
                <div className="flex justify-between">
                <span className="block text-xs text-[#fafafa] mt-1 text-right">{formatDate(msg.created_at)} </span>
                </div>
            </div>

            {!isSender && (
                <div className="text-[#b2b2e5] text-sm font-semibold flex items-end ml-2">
                    {msg.is_read === 0 ?
                        <div className="text-[#b2b2e5] text-sm font-semibold">
                            ✔
                        </div>:
                        <div className="text-[#b2b2e5] text-sm font-semibold">
                            ✔✔
                        </div>
                    }
                </div>
            )}
        </div>
    )
}