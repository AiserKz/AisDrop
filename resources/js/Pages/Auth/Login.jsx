import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function AuthPage({ status, canResetPassword }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [animating, setAnimating] = useState(false);
    const isMobile = window.innerWidth < 768;

    // Login form
    const { data: loginData, setData: setLoginData, post: loginPost, processing: loginProcessing, errors: loginErrors, reset: loginReset } = useForm({
        phone: '',
        password: '',
        remember: false,
    });

    // Register form
    const { data: regData, setData: setRegData, post: regPost, processing: regProcessing, errors: regErrors, reset: regReset } = useForm({
        name: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSwitch = (to) => {
        setAnimating(true);
        setTimeout(() => {
            setMode(to);
            setAnimating(false);
        }, 500);
    };

    const submitLogin = (e) => {
        e.preventDefault();
        loginPost(route('login'), {
            onFinish: () => loginReset('password')
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();
        regPost(route('register'), {
            onFinish: () => regReset('password', 'password_confirmation')
        });
    };

    return (
        <AppLayout>
            <Head title={mode === 'login' ? 'Вход' : 'Регистрация'} />
            <div className="min-h-screen flex items-center justify-center bg-[#121216] py-10 px-4">
                <div className="relative w-full max-w-4xl min-h-[550px] overflow-hidden rounded-3xl shadow-xl">
                    {/* Контейнер с формами */}
                    <div
                        className="absolute top-0 left-0 flex transition-transform duration-500 ease-in-out"
                        style={{
                            width: '200%',
                            transform: isMobile
                                ? (mode === 'login' && !animating ? 'translateX(0%)' : 'translateX(-50%)')
                                : 'translateX(0%)',
                        }}
                    >
                        {/* Вход */}
                        <div className="w-1/2 md:w-1/4 flex flex-col justify-center px-6 md:px-12 py-8 bg-[#23232b] rounded-l-3xl border-r border-[#23234a]">

                            <h2 className="text-3xl font-bold text-white mb-8 text-center">Вход</h2>
                            <form onSubmit={submitLogin}>
                                <InputLabel htmlFor="phone" value="Телефон" />
                                <TextInput id="phone" type="tel" name="phone" value={loginData.phone} className="mt-1 block w-full" autoComplete="username" isFocused={true} onChange={e => setLoginData('phone', e.target.value)} placeholder="+7 777 777 77 77" />
                                <InputError message={loginErrors.phone} className="mt-2" />
                                <div className="mt-4">
                                    <InputLabel htmlFor="password" value="Пароль" />
                                    <TextInput id="password" type="password" name="password" value={loginData.password} className="mt-1 block w-full" autoComplete="current-password" onChange={e => setLoginData('password', e.target.value)} />
                                    <InputError message={loginErrors.password} className="mt-2" />
                                </div>
                                <div className="mt-4 flex items-center">
                                    <Checkbox name="remember" checked={loginData.remember} onChange={e => setLoginData('remember', e.target.checked)} />
                                    <span className="ms-2 text-sm text-gray-400">Запомнить меня</span>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-sm text-[#b2b2e5] hover:underline">Забыли пароль?</Link>
                                    )}
                                    <PrimaryButton className="ml-4" disabled={loginProcessing}>Войти</PrimaryButton>
                                </div>
                            </form>
                            <div className="mt-8 text-center">
                                <span className="text-gray-400">Нет аккаунта?</span>
                                <button className="ml-2 text-[#b2b2e5] hover:underline font-semibold" onClick={() => handleSwitch('register')}>Зарегистрироваться</button>
                            </div>
                        </div>

                        {/* Регистрация */}
                        <div className="w-1/2 md:w-1/4 flex flex-col justify-center px-6 md:px-12 py-8 bg-[#23232b] rounded-r-3xl border-l border-[#23234a]">

                            <h2 className="text-3xl font-bold text-white mb-8 text-center">Регистрация</h2>
                            <form onSubmit={submitRegister}>
                                <InputLabel htmlFor="name" value="Имя" />
                                <TextInput id="name" type="text" name="name" value={regData.name} className="mt-1 block w-full" autoComplete="name" onChange={e => setRegData('name', e.target.value)} />
                                <InputError message={regErrors.name} className="mt-2" />
                                <div className="mt-4">
                                    <InputLabel htmlFor="phone_reg" value="Телефон" />
                                    <TextInput id="phone_reg" type="tel" name="phone" value={regData.phone} className="mt-1 block w-full" autoComplete="tel" onChange={e => setRegData('phone', e.target.value)} placeholder="+7 777 777 77 77" />
                                    <InputError message={regErrors.phone} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="password_reg" value="Пароль" />
                                    <TextInput id="password_reg" type="password" name="password" value={regData.password} className="mt-1 block w-full" autoComplete="new-password" onChange={e => setRegData('password', e.target.value)} />
                                    <InputError message={regErrors.password} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <InputLabel htmlFor="password_confirmation" value="Подтвердите пароль" />
                                    <TextInput id="password_confirmation" type="password" name="password_confirmation" value={regData.password_confirmation} className="mt-1 block w-full" autoComplete="new-password" onChange={e => setRegData('password_confirmation', e.target.value)} />
                                    <InputError message={regErrors.password_confirmation} className="mt-2" />
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <span></span>
                                    <PrimaryButton className="ml-4" disabled={regProcessing}>Зарегистрироваться</PrimaryButton>
                                </div>
                            </form>
                            <div className="mt-8 text-center">
                                <span className="text-gray-400">Уже есть аккаунт?</span>
                                <button className="ml-2 text-[#b2b2e5] hover:underline font-semibold" onClick={() => handleSwitch('login')}>Войти</button>
                            </div>
                        </div>
                    </div>

                    {/* Боковая панель с текстом и логотипом */}
                    <div className={`absolute inset-y-0 right-0 w-1/2 
                        hidden md:flex flex-col items-center justify-center
                        transition-all duration-500 ease-in-out bg-gradient-to-br from-[#121216] to-[#23232b] z-5
                        ${mode === 'login' && !animating ? '' : '-translate-x-full'} ${animating ? 'pointer-events-none' : ''}`}
                        style={{ boxShadow: '0 0 20px 0 rgb(54, 54, 97), 0 0 0 1px rgb(54, 54, 97)' }}
                    >
                        <img src="/images/Icon.png" alt="AisDrop" className="w-72 h-72" />
                        <p className="text-lg text-white text-center max-w-xs">
                            Добро пожаловать в современный маркетплейс! Здесь вы можете покупать и продавать легко и безопасно.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
