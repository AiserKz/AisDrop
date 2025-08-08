import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';


const categoryImage = {
    "Электроника": "/categories/ilec.jpg",
    "Транспорт": "/categories/car.jpg",
    "Велосипеды": "/categories/velo.jpg",
    "Гаджеты": "/categories/mobile.jpg",
    "Бытовая техника": "/categories/kitchen.jpg",
    "Игровые приставки": "/categories/console.jpg",
}


export default function Categories({ categories }) {

    const selectCategory = (category) => {
        console.log(category);
        router.get(route('home'), { category_id: category.id }, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <AppLayout>
            <Head title="Категории" />
            <div className='py-12 '>
                <div className='max-w-7xl mx-auto px-6"'>
                    <h1 className="text-4xl font-bold mb-10 text-center text-white">
                        Категории
                    </h1>
                        
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
                        {categories?.map((category) => (
                            <div key={category.id} className='flex flex-col items-center group relative cursor-pointer' onClick={() => selectCategory(category)}>
                                <img src={categoryImage[category.name]} 
                                    className=" group-hover:scale-110 group-hover:delay-0 delay-300
                                    transition-all group-hover:-rotate-3 group-hover:brightness-[0.4]
                                    duration-500  w-48 h-48 object-cover mb-2 rounded-full mask-origin-padding" 
                                    alt={category.name} />
                         
                                    <h3 className='
                                        text-md font-semibold text-white 
                                        transition-all duration-500 transform 
                                        group-hover:-translate-y-20 group-hover:scale-110 
                                        group-hover:delay-0 
                                        delay-300 ease-in-out'>
                                        {category.name}
                                    </h3>
                            </div>
                        ))}
                
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}