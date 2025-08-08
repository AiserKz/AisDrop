import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

export default function About() {
    return (
        <AppLayout>
            <Head title="О нас" />
            <div className="py-12 bg-[#121216] min-h-screen text-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-6 text-center text-[#fafafa]">
                        О Ais|Drop
                    </h1>
                    <p className="text-lg text-[#fafafa] text-center mb-10">
                        AisDrop — современная площадка для покупки и продажи б/у и новых вещей. Мы делаем процесс максимально простым, безопасным и удобным для каждого пользователя.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-[#23232b] rounded-2xl p-6 shadow border border-[#2c2c35] flex flex-col items-center">
                            <svg className="w-12 h-12 mb-4 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" /></svg>
                            <h2 className="text-2xl font-bold mb-2">Безопасные сделки</h2>
                            <p className="text-base text-[#fafafa] text-center">Все пользователи проходят верификацию, а сделки защищены современными технологиями.</p>
                        </div>
                        <div className="bg-[#23232b] rounded-2xl p-6 shadow border border-[#2c2c35] flex flex-col items-center">
                            <svg className="w-12 h-12 mb-4 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" /></svg>
                            <h2 className="text-2xl font-bold mb-2">Удобство и простота</h2>
                            <p className="text-base text-[#fafafa] text-center">Интуитивный интерфейс, быстрый поиск, фильтры и чат для общения между продавцом и покупателем.</p>
                        </div>
                        <div className="bg-[#23232b] rounded-2xl p-6 shadow border border-[#2c2c35] flex flex-col items-center">
                            <svg className="w-12 h-12 mb-4 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                            <h2 className="text-2xl font-bold mb-2">Экономия времени и денег</h2>
                            <p className="text-base text-[#fafafa] text-center">Покупайте и продавайте вещи рядом с вами, экономьте на доставке и находите лучшие предложения.</p>
                        </div>
                        <div className="bg-[#23232b] rounded-2xl p-6 shadow border border-[#2c2c35] flex flex-col items-center">
                            <svg className="w-12 h-12 mb-4 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>
                            <h2 className="text-2xl font-bold mb-2">Сообщество</h2>
                            <p className="text-base text-[#fafafa] text-center">Тысячи пользователей ежедневно находят нужные вещи и новых друзей на AisDrop.</p>
                        </div>
                    </div>
                    <div className="bg-[#23232b] rounded-2xl p-8 shadow border border-[#2c2c35] mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-[#b2b2e5] text-center">Кто мы?</h2>
                        <p className="text-base text-[#fafafa] text-center mb-2">AisDrop — это команда энтузиастов, которые хотят сделать рынок б/у вещей честным, удобным и современным. Мы вдохновляемся лучшими мировыми сервисами, но делаем продукт для наших людей и наших городов.</p>
                        <p className="text-base text-[#fafafa] text-center">Наша цель — чтобы каждая вещь нашла нового владельца, а каждый пользователь чувствовал себя в безопасности и комфорте.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 bg-[#23232b] rounded-2xl p-6 shadow border border-[#2c2c35] flex flex-col items-center mb-6 md:mb-0">
                            <h3 className="text-xl font-bold mb-2 text-[#b2b2e5]">Присоединяйтесь к нам!</h3>
                            <p className="text-base text-[#fafafa] text-center mb-4">Зарегистрируйтесь, чтобы продавать и покупать легко, быстро и безопасно.</p>
                            <a href="/register" className="bg-[#b2b2e5] hover:bg-[#a2a2b3] text-[#121218] font-bold py-3 px-8 rounded-xl text-lg transition">Создать аккаунт</a>
                        </div>
                        <div className="flex-1 bg-[#23232b] rounded-2xl p-6 shadow border border-[#2c2c35] flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-2 text-[#b2b2e5]">Есть вопросы?</h3>
                            <p className="text-base text-[#fafafa] text-center mb-4">Свяжитесь с нашей поддержкой — мы всегда готовы помочь!</p>
                            <a href="mailto:support@aisdrop.kz" className="bg-transparent border border-[#b2b2e5] hover:bg-[#b2b2e5] hover:text-[#121218] text-[#b2b2e5] font-bold py-3 px-8 rounded-xl text-lg transition">Написать в поддержку</a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
