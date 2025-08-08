import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import DialogCard from "@/Components/DialogCard";
import formatDate from "@/Components/formatDate";
import MessageBody from "@/Components/MessageBody";
import { useUnread } from "@/contexts/useUnread";

const Message = ({ dialog }) => {
    const textareaRef = useRef(null);
    const [textareaHeight, setTextareaHeight] = useState(50);
    const [selectedId, setSelectedId] = useState('');
    const selectIdRef = useRef(selectedId);
    const [input, setInput] = useState("");
    const messageEndRef = useRef(null);
    const [selectedDialog, setSelectedDialog] = useState(null);
    const [selectUser, setSelectUser] = useState(null);
    const [filteredDialogs, setFilteredDialogs] = useState(dialog);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [mobileMode, setMobileMode] = useState("dialogs"); // 'dialogs' | 'chat'

    const user = usePage().props.auth.user;
    const { reset } = useUnread();

    const { data, setData } = useForm({
        message: '',
        dialog_id: null,
        from_user_id: user.id,
        to_user_id: null
    });

    useEffect(() => {
        selectIdRef.current = selectedId;
    }, [selectedId]);

    useEffect(() => {
        const updateView = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener("resize", updateView);
        return () => window.removeEventListener("resize", updateView);
    }, []);

    useEffect(() => {
        const channel = window.Echo.private(`chat.${user.id}`);
        channel.listen('.MessageSent', (e) => {
            if (selectIdRef.current == e.message.dialog_id) {
                setSelectedDialog(prev => [...prev, e.message]);
            } else {
                setUnreadMessages(e.message.dialog_id);
            }
            setDialogLastMessage(e.message.dialog_id, e.message);
            playSound();
        });
        return () => {
            window.Echo.leave(`chat.${user.id}`);
        };
    }, []);

    const playSound = () => {
        const audio = document.getElementById('messageSound');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.4;
            audio.play().catch(console.error);
        }
    };

    const setUnreadMessages = (dialogId, unreadCount = null) => {
        if (unreadCount !== null) {
            reset();
        }
        setFilteredDialogs(prev => prev.map(d => {
            if (d.id === dialogId) {
                const updated = unreadCount ?? (d.unread_messages || 0) + 1;
                return { ...d, unread_messages: updated };
            }
            return d;
        }));
    };

    const setDialogLastMessage = (dialogId, message) => {
        setFilteredDialogs(prev => prev.map(d => {
            if (d.id === dialogId) {
                return { ...d, last_message: message.body };
            }
            return d;
        }));
    };

    const autoResizeTextarea = () => {
        const el = textareaRef.current;
        if (!el) return;
        if (el.scrollHeight > 150) {
            el.style.height = '150px';
            return;
        }
        el.style.height = 'auto';
        const newHeight = el.scrollHeight;
        el.style.height = `${newHeight}px`;
        setTextareaHeight(newHeight);
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedDialog]);

    const handleSelect = async (id) => {
        if (selectedId === id) return;
        setSelectedId(id);
        const selected = dialog.find(d => d.id === id);
        if (!selected) return;
        const userTo = selected.user_one_id === user.id ? selected.user_two : selected.user_one;
        setSelectUser(userTo);
        setData('dialog_id', id);
        setData('to_user_id', userTo.id);
        const res = await axios.get(route('messages.load', id));
        setSelectedDialog(res.data.messages);
        setUnreadMessages(id, 0);
        if (isMobileView) setMobileMode('chat');
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const fakeMessage = {
            is_read: false,
            id: selectedDialog.length + 1,
            sender_id: user.id,
            fromMe: true,
            body: input,
            created_at: new Date().toISOString()
        };
        setSelectedDialog(prev => [...prev, fakeMessage]);
        setInput("");
        setDialogLastMessage(selectIdRef.current, fakeMessage);
        axios.post(route('messages.set'), { ...data, message: input });
    };

    const goBackMobile = () => {
        setMobileMode("dialogs");
		setSelectedId('');
    };

    return (
        <AppLayout>
            <div className="flex flex-col h-screen md:flex-row bg-[#121216] rounded-2xl shadow-2xl overflow-hidden border border-[#23262F] mt-10 max-w-6xl mx-auto">
                {/* Список диалогов */}
                {(isMobileView && mobileMode === "dialogs") || !isMobileView ? (
                    <div className="w-full md:w-1/3 min-w-[280px] bg-[#23262F] border-r border-[#393E46] flex flex-col">
                        <div className="p-5 pb-2">
                            <input
                                type="text"
                                placeholder="Поиск..."
                                onChange={(e) => {
                                    setFilteredDialogs(dialog.filter((d) =>
                                        d.user_two.name.toLowerCase().includes(e.target.value.toLowerCase())
                                    ));
                                }}
                                className="w-full px-5 py-3 rounded-xl bg-[#181A20] text-white placeholder-[#a2a2b3] focus:outline-none focus:ring-2 focus:ring-[#b2b2e5] text-base transition"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {filteredDialogs.length === 0 ? (
                                <div className="text-[#666] text-center mt-8">Диалоги не найдены</div>
                            ) : (
                                filteredDialogs.map((d) => (
                                    <DialogCard
                                        key={d.id}
                                        dialogId={d.id}
                                        user={user.id === d.user_one_id ? d.user_two : d.user_one}
                                        handleSelect={handleSelect}
                                        selectedId={selectedId}
                                        date={d.created_at}
                                        last_message={d.last_message}
                                        unread_messages={d.unread_messages}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Чат */}
                {(isMobileView && mobileMode === "chat") || !isMobileView ? (
                    <div className="flex-1 flex flex-col  bg-[#121216]">
                        {/* Назад на мобилке */}
                        {isMobileView && (
                            <button
                                onClick={goBackMobile}
                                className="text-left px-4 py-3 text-[#b2b2e5] font-semibold hover:text-white border-b border-[#23262F] bg-[#181A20]"
                            >
                                ← Назад к диалогам
                            </button>
                        )}
				
                        {/* Хедер */}
                        <div className="flex items-center gap-4 px-6 py-5 border-b border-[#23262F] bg-[#181A20]">
                            {selectUser ? (
                                <>
                                    <img
                                        src={selectUser?.avatar || "https://ui-avatars.com/api/?name=MP&background=393E46&color=fff"}
                                        alt={selectUser?.name}
                                        className="w-11 h-11 rounded-full border border-[#b2b2e5]"
                                    />
                                    <div>
                                        <div className="text-white font-semibold text-sm md:text-base">{selectUser.name}</div>
                                        <div className="text-xs text-[#a2a2b3]">В сети</div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-[#a2a2b3]">Выберите диалог</div>
                            )}
                        </div>

                        {/* Сообщения */}
                        <div className="md:h-full h-[70vh] flex overflow-y-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-3 custom-scrollbar bg-[#121216]">
                            {selectedDialog ? (
                                selectedDialog.length === 0 ? (
                                    <div className="text-[#666] text-center mt-8">Нет сообщений</div>
                                ) : (
                                    selectedDialog.map((msg, idx) => (
                                        <MessageBody key={idx} msg={msg} user={user} formatDate={formatDate} />
                                    ))
                                )
                            ) : (
                                <div className="text-[#666] text-center mt-8">Выберите диалог слева</div>
                            )}
                            <div ref={messageEndRef} />
                        </div>

                        {/* Инпут */}
                        {selectedDialog && (
                            <form
                                onSubmit={handleSend}
                                className="flex items-center gap-3 px-4 md:px-6 py-4 border-t border-[#23262F] bg-[#181A20]"
                            >
                                <textarea
                                    ref={textareaRef}
                                    placeholder="Введите сообщение..."
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        autoResizeTextarea();
                                    }}
                                    className="resize-none overflow-hidden flex-1 px-4 py-2 rounded-xl bg-[#23262F] text-white placeholder-[#a2a2b3] focus:outline-none focus:ring-2 focus:ring-[#b2b2e5] text-sm"
                                    style={{ maxHeight: textareaHeight + 'px' }}
                                    required
                                    maxLength={1000}
                                />
                                <button
                                    type="submit"
                                    className="bg-[#b2b2e5] hover:bg-[#a2a2b3] text-[#181A20] font-bold px-6 py-2 rounded-xl transition shadow-lg text-sm"
                                >
                                    Отправить
                                </button>
                            </form>
                        )}
                    </div>
                ) : null}

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                        background: #23262F;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #393E46;
                        border-radius: 8px;
                    }
                `}</style>
            </div>
        </AppLayout>
    );
};

export default Message;
