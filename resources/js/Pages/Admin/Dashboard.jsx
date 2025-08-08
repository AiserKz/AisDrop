import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { route } from "ziggy-js";
import { Link, router, usePage } from "@inertiajs/react";

// Моковые данные для примера

const mockAdmins = [
  { id: 1, name: "Пользователь", role: "user" },
  { id: 2, name: "Модератор", role: "moderator" },
  { id: 3, name: "Админ", role: "admin" },
  { id: 4, name: "Суперадмин", role: "superadmin" },
];


const mockRoles = [
  { id: 1, name: "superadmin" },
  { id: 2, name: "moderator" },
  { id: 3, name: "support" },
];

const sections = [
  { key: "main", label: "Статистика" },
  { key: "users", label: "Пользователи" },
  { key: "ads", label: "Объявления" },
  { key: "reports", label: "Репорты" },
  { key: "roles", label: "Роли" },
];

const sectionIcons = {
  main: (
    <svg className="w-5 h-5 mr-3 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-2-2h-3.5M7 21a2 2 0 01-2-2v-7.5" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5 mr-3 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
    </svg>
  ),
  ads: (
    <svg className="w-5 h-5 mr-3 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M8 21h8" />
    </svg>
  ),
  reports: (
    <svg className="w-5 h-5 mr-3 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.414M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  roles: (
    <svg className="w-5 h-5 mr-3 text-[#b2b2e5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 8v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
    </svg>
  ),
};

export default function Dashboard() {
  const [section, setSection] = useState("main");
  const { users, ads, reports } = usePage().props;
  // console.log(users);

  const [isRedactingUser, setIsRedactingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [error, setError] = useState('');
  

  const dateConverter = (date) => {
    const newDate = new Date(date);

    const day = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const year = newDate.getFullYear();

    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const submitStatusUser = (e, user) => {
    e.preventDefault();
    router.post(route('admin.user.update.role'), {
      user_id: user.id,
      role: e.target.value
    },
    {
      preserveScroll: true
    }
  )}

  const submitIsBannedUser = (is_banned, user) => {

    console.log(is_banned, user.id, banReason);

    router.post(
      route('admin.user.update.banned'),
      {
        user_id: user.id,
        is_banned: is_banned,
        ban_reason: is_banned ? banReason : ''
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsRedactingUser(false);
          console.log('success', isRedactingUser);
        }
      }
    );
  }

  const submitStatusAds = (status, ad) => {
    
    router.post(route('admin.ads.update.status'), {
      ad_id: ad.id,
      status: status
    }, {
      preserveScroll: true
    })
  }

  const submitStatusReport = (status, report) => {
    router.post(route('admin.report.update.status'), {
      report_id: report.id,
      status: status,
      item_id: report.ad_id,
      reason: report.reason
    }, {
      preserveScroll: true
    })
  }

  return (
    <AppLayout>
      <div className="flex min-h-[80vh] max-w-8xl mx-auto mt-10 rounded-2xl shadow-2xl overflow-hidden border border-[#23262F] bg-[#181A20]">
        {/* Левая панель */}
        <aside className="w-72 bg-[#23262F] border-r border-[#393E46] flex flex-col py-8 px-4 gap-2 relative">
 
          <Link
            href={route('home')}
            className="absolute left-4 top-9  flex items-center  text-white hover:text-[#b2b2e5] font-semibold text-base px-2 py-2 rounded-3xl transition shadow "
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
     
          </Link>
          <h2 className="text-2xl font-bold text-[#b2b2e5] mb-10 text-center mt-2">Ais|Drop Admin</h2>
          <div className="flex flex-col gap-2 mt-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`w-full flex items-center text-left px-5 py-3 rounded-xl font-semibold text-lg transition mb-1 border border-transparent ${
                  section === s.key
                    ? "bg-[#b2b2e5] text-white shadow-lg border-[#b2b2e5]"
                    : "bg-[#181A20] text-white hover:bg-[#23262F] hover:border-[#393E46]"
                }`}
              >
                {sectionIcons[s.key]}
                <span className="text-white">{s.label}</span>
              </button>
            ))}
          </div>
        </aside>
        {/* Правая часть */}
        <main className="flex-1 p-10 overflow-y-auto">
          {section === "main" && (
            <div>
              <h1 className="text-3xl font-bold mb-8 text-white">Статистика</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-[#23262F] rounded-2xl p-8 flex flex-col items-center shadow-md">
                  <span className="text-5xl font-bold text-[#b2b2e5]">{users.length}</span>
                  <span className="text-lg text-[#a2a2b3] mt-2">Пользователей</span>
                </div>
                <div className="bg-[#23262F] rounded-2xl p-8 flex flex-col items-center shadow-md">
                  <span className="text-5xl font-bold text-[#b2b2e5]">{ads.length}</span>
                  <span className="text-lg text-[#a2a2b3] mt-2">Объявлений</span>
                </div>
                <div className="bg-[#23262F] rounded-2xl p-8 flex flex-col items-center shadow-md">
                  <span className="text-5xl font-bold text-[#b2b2e5]">{reports.length}</span>
                  <span className="text-lg text-[#a2a2b3] mt-2">Репортов</span>
                </div>
              </div>
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-white">Последние объявления</h2>
                <div className="bg-[#23262F] rounded-2xl p-6 overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-[#b2b2e5] text-lg">
                        <th className="py-2">ID</th>
                        <th>Заголовок</th>
                        <th>Пользователь</th>
                        <th>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ads.slice(0, 6).map((ad) => (
                        <tr key={ad.id} className="bg-[#181A20] rounded-xl shadow hover:bg-[#23262F] transition ">
                          <td className="py-2 px-3 rounded-l-xl font-bold">{ad.id}</td>
                          <td className="px-3">{ad.title}</td>
                          <div className="flex items-center gap-0 px-1">
                          <img className="w-12 h-12 object-cover rounded-lg" src={ad.user.avatar || `https://ui-avatars.com/api/?name=${ad.user.name}`} /> 
                          <td className="px-3"> {ad.user.name}</td>
                          </div>
                          <td className="px-3 rounded-r-xl text-sm text-[#a2a2b3]">{dateConverter(ad.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">Роли админов</h2>
                <div className="bg-[#23262F] rounded-2xl p-6 flex flex-wrap gap-4">
                  {mockAdmins.map((a) => (
                    <div key={a.id} className="px-6 py-3 rounded-xl bg-[#b2b2e5] text-[#181A20] font-semibold text-lg shadow border border-[#b2b2e5]">
                      {a.name} <span className="text-sm text-[#393E46] ml-2">({a.role})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {section === "users" && (
            <div>
              <h1 className="text-3xl font-bold mb-8 text-white">Пользователи</h1>
              <div className="bg-[#23262F] rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead className="text-center">
                    <tr className="text-[#b2b2e5] text-lg">
                      <th>ID</th>
                      <th>Аватар</th>
                      <th>Имя</th>
                      <th>Телефон</th>
                      <th>Рейтинг</th>
                      <th>Дата регистрации</th>
                      <th>Роль</th>

                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="bg-[#181A20] rounded-xl shadow hover:bg-[#23262F] transition">
                        <td className="px-3 py-2 rounded-l-xl font-bold">{u.id}</td>
                        <td className="px-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover"  />
                          ) : (
                            <img src={'https://ui-avatars.com/api/?name=' + u.name} alt={u.name} className="w-12 h-12 rounded-full" />
                          )}
                        </td>
                        <td className="px-3">{u.name}</td>
                        <td className="px-3">{u.phone}</td>
                        <td className="px-3">{u.rating}</td>
                        <td className="px-3">{dateConverter(u.created_at)}</td>
                        <td className="px-3">
                          <select name="" id="" className="bg-[#181A20] text-white border border-[#393E46] rounded-lg py-2 w-full text-center" 
                            onChange={(e) => submitStatusUser(e, u)}
                          >
                            <option value="1" selected={Number(u.role) === 1}>Пользователь</option>
                            <option value="2" selected={Number(u.role) === 2}>Модератор</option>
                            <option value="3" selected={Number(u.role) === 3}>Админ</option>
                            <option value="4" selected={Number(u.role) === 4}>Суперадмин</option>
                          </select>
                          
                        </td>
                        {u.is_banned ? (
                            <button onClick={() => {
                              setIsRedactingUser(true); 
                              setSelectedUser(u);
                            }} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                              Разбанить
                            </button>
                        ) : (
                          <td>
                            <button onClick={() => {
                              setIsRedactingUser(true); 
                              setSelectedUser(u);
                            }} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                             Забанить
                            </button>
                          </td>
                        )}
              
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {isRedactingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-[#23262F] rounded-2xl p-8 shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                      Бан пользователя {selectedUser ? selectedUser.name : "Пользователь"}
                    </h2>
                    {selectedUser.is_banned ? (
                      <p className="mb-4 text-white">
                        Пользователь {selectedUser ? selectedUser.name : "Пользователь"} забанен,<br />
                        Причина: {selectedUser?.ban_reason || "Причина не указана"}
                      </p>
                    ) : (
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-white">
                        Причина бана
                      </label>
                      <textarea
                        rows="4"
                        id="banReason"
                        className="bg-[#181A20] w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setBanReason(e.target.value)}
                        defaultValue={selectedUser?.ban_reason || ""}
                      />
                    </div>
          
                    )}
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={() => {
                        const is_banned = selectedUser.is_banned ? 0 : 1;
                        submitIsBannedUser(is_banned, selectedUser);
                      }
                      }
                      >
                      {selectedUser && selectedUser.is_banned ? "Разбанить" : "Забанить"}
                    </button>
                    <button
                      className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      onClick={() => setIsRedactingUser(false)}
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {section === "ads" && (
            <div>
              <h1 className="text-3xl font-bold mb-8 text-white">Объявления</h1>
              <div className="bg-[#23262F] rounded-2xl p-6 overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[#b2b2e5] text-sm md:text-base">
                    <th>ID</th>
                    <th>Заголовок</th>
                    <th>Категория</th>
                    <th>Город</th>
                    <th>Цена</th>
                    <th>Просмотры</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
              {ads.reverse().map((ad) => (
                <tr key={ad.id} className="bg-[#181A20] rounded-xl shadow hover:bg-[#23262F] transition text-sm md:text-base text-center ">
                  <td className="px-3 py-2 rounded-l-xl font-bold">{ad.id}</td>
                  <td className="px-3 font-semibold">{ad.title}</td>
                  <td className="px-3">{ad.category?.name || `#${ad.category_id}`}</td>
                  <td className="px-3">{ad.city?.name || `#${ad.city_id}`}</td>
                  <td className="px-3 text-yellow-400 text-ellipsis">{ad.price} ₸</td>
                  <td className="px-3">{ad.views}</td>
                  <td className="px-3">{dateConverter(ad.created_at)}</td>
                  <td className="px-3">
                    {ad.status === 0 ? (
                      <span className="text-yellow-400 font-bold">На модерации</span>
                    ) :  ad.status === 1 ? (
                      <span className="text-green-400 font-bold">Активно</span>
                    ) : ad.status === 2 ? (
                      <span className="text-red-400 font-bold">Отклонено</span>
                    ) : (
                      <span className="text-red-600 font-bold">Забанено</span>
                    )}
                  </td>
                  <td className="px-3 rounded-r-xl flex gap-2 flex-wrap ">
                    {/* 0 - На модерации 1 - Активно 2 - отклонено */}
                    {ad.status === 0 && (
                      <button
                        className="bg-[#b2b2e5] text-[#181A20] px-3 py-1 rounded-lg font-semibold hover:bg-[#a2a2b3] transition"
                        onClick={() => submitStatusAds(1, ad)}
                      >
                        Одобрить
                      </button>
                    )}
                    {ad.status === 3 && (
                      <button
                        className="bg-[green] text-[white] px-3 py-1 rounded-lg font-semibold hover:bg-[#3b3b3b] transition"
                        onClick={() => submitStatusAds(1, ad)}
                      >
                        Разбанить
                      </button>
                    )}
                    {(ad.status === 0 || ad.status === 1) && (
                      <button
                        className="bg-[#FF4C4C] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#D32F2F] transition"
                        onClick={() => submitStatusAds(ad.status === 0 ? 2 : 3 , ad)}
                      >
                        {ad.status === 0 ? "Отклонить" : "Забанить"}
                      </button>
                    )}
                  </td>
                </tr>
                  ))}
                </tbody>
              </table>

              </div>
            </div>
          )}
          {section === "reports" && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Репорты</h1>
            <div className="bg-[#23262F] rounded-2xl p-6 overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2 text-center">
                <thead>
                  <tr className="text-[#b2b2e5] text-lg">
                    <th className="min-w-[60px]">ID</th>
                    <th className="min-w-[180px]">Объявление</th>
                    <th className="min-w-[150px]">Причина</th>
                    <th className="min-w-[130px]">Статус</th>
                    <th className="min-w-[120px]">Дата</th>
                    <th className="min-w-[180px]">Пользователь</th>
                    <th className="min-w-[180px]">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr
                      key={r.id}
                      className="bg-[#181A20] rounded-lg shadow-md hover:bg-[#2b2e38] hover:shadow-lg transition-all"
                    >
                      <td className="px-3 py-2 rounded-l-lg font-bold">{r.id}</td>

                      <td className="px-3">
                        <Link href={route('item', r.ad.id)} className="text-[#94b0ff] hover:underline">
                          {r.ad.title}
                        </Link>
                      </td>

                      <td className="px-3">{r.reason}</td>

                      <td className="px-3">
                        {r.status === 0 ? (
                          <span className="text-yellow-400 font-semibold">На модерации</span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              r.status === 1 ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {r.status === 1 ? 'Принят' : 'Отклонен'}
                          </span>
                        )}
                      </td>

                      <td className="px-3">{dateConverter(r.created_at)}</td>

                      <td className="px-3">
                        <div className="flex items-center gap-2 justify-center">
                          <img src={r.user.avatar || 'https://ui-avatars.com/api/?name=' + r.user.name} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                          <span className="text-white">{r.user.name}</span>
                        </div>
                      </td>
                      {/* 0 - На модерации 1 - Принять 2 - отклонено */}
                      {r.status == 0 ? (
                        <td className="px-3 py-2 rounded-r-lg flex gap-2 justify-center">
                          <button
                            className="bg-yellow-300 text-[#181A20] px-4 py-1 rounded-md font-semibold hover:bg-yellow-400 transition-all"
                            onClick={() => submitStatusReport(1, r)}
                          >
                            Принять
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-1 rounded-md font-semibold hover:bg-red-600 transition-all"
                            onClick={() => submitStatusReport(2, r)}
                          >
                            Отклонить
                          </button>
                        </td>
                        ) : (
                        <td className="px-3 py-2 rounded-r-lg flex gap-2 justify-center rounded-r-lg">

                        </td>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          )}
          {section === "roles" && (
            <div>
              <h1 className="text-3xl font-bold mb-8 text-white">Роли</h1>
              <div className="bg-[#23262F] rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[#b2b2e5] text-lg">
                      <th>ID</th>
                      <th>Название</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRoles.map((role) => (
                      <tr key={role.id} className="bg-[#181A20] rounded-xl shadow hover:bg-[#23262F] transition">
                        <td className="px-3 py-2 rounded-l-xl font-bold">{role.id}</td>
                        <td className="px-3">{role.name}</td>
                        <td className="px-3 rounded-r-xl flex gap-2">
                          <button className="bg-[#b2b2e5] text-[#181A20] px-4 py-1 rounded-lg font-semibold hover:bg-[#a2a2b3] transition">
                            Редактировать
                          </button>
                          <button className="bg-[#23262F] text-white px-4 py-1 rounded-lg font-semibold hover:bg-[#393E46] transition">
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6">
                  <button className="bg-[#b2b2e5] text-[#181A20] px-6 py-2 rounded-xl font-bold hover:bg-[#a2a2b3] transition">
                    Добавить роль
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
