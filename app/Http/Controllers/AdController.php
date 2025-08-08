<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use App\Models\AdImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\City;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


class AdController extends Controller
{

    public function index(Request $request) {
        // dd($request->all());
        $query = Ad::with(['images', 'favoritedBy'])
            ->WithValidAds()
            ->withValidUsers();

        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $ads = $query->latest()->paginate(10)->appends($request->all());

        $city = City::all(['id', 'name']);
        $categories = Category::all(['id', 'name']);
        return Inertia::render('Home', [
            'ads' => $ads,
            'categories' => $categories,
            'cities' => $city,
            'filters' => $request->only(['title', 'city_id', 'category_id']), // ← тоже можно отдать
        ]);
    }

    public function indexApi(Request $request) {
        $query = Ad::query()
        ->WithValidAds()
        ->with([
            'images',
        ]);

        if ($request->filled('title')) {
            $query->where('title', 'LIKE', '%' . $request->title . '%');
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
   
        return response()->json($query->latest()->get());
    }


    public function show($id) {
        // Получаем объявление по ID с его изображениями и пользователем
        $ad = Ad::WithValidAds()->with([
            'images', 
            'favoritedBy', 
            'user:id,name,rating,avatar,phone,created_at',
            'category:id,name',
            'city:id,name'
        ])->find($id);

        if ($ad) {
            $ad->increment('views'); // Увеличиваем количество просмотров
        }
   
        if (request()->inertia()) {
            return Inertia::render('Home', [ // ⚠️ всё ещё Home
                'item' => $ad,
            ]);
        }

        return redirect()->route('home'); // на всякий случай
    }

    public function create() {
        // Получаем категории и города для формы
        $city = City::all(['id', 'name']);
        $categories = Category::all(['id', 'name']);

        return Inertia::render('CreateItem', [
            'categories' => $categories,
            'cities' => $city
        ]);

    }

    public function store(Request $request)
    {
        // dd($request->hasFile('image'));
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|exists:categories,name',
            'city' => 'required|exists:cities,name',
            // Вот это обязательно!
            'image' => 'nullable|array',
            'image.*' => 'nullable|file|max:5120',

            'cor_x' => 'nullable|numeric',
            'cor_y' => 'nullable|numeric',
        ]);
        
        // dd($request->all());
        // Получаем id по имени
        $categoryId = \App\Models\Category::where('name', $validated['category'])->value('id');
        $cityId = \App\Models\City::where('name', $validated['city'])->value('id');

        // Создаём объявление
        $ad = Ad::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'category_id' => $categoryId,
            'city_id' => $cityId,
            'user_id' => Auth::id(), // текущий пользователь
            'cor_x' => $validated['cor_x'] ?? 43.23319741022136, // временно захардкожено
            'cor_y' => $validated['cor_y'] ?? 76.90567016601564, // временно захардкожено
        ]);
        

        // Обработка изображений
        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $file) {
                $path = $file->store('ads', 'public');

                AdImage::create([
                    'ad_id' => $ad->id,
                    'url' => Storage::url($path),
                ]);
            }
        }

        return redirect()->route('item', $ad->id)->with('success', 'Объявление создано');

    }

    public function category() {
        $categories = Category::all(['id', 'name']);
        return Inertia::render('Categories', [
            'categories' => $categories
        ]);
    }
}
