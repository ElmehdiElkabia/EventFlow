<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\BaseController;
use App\Models\Category;

/**
 * Public Category Controller
 * 
 * Handles public category browsing.
 */
class CategoryController extends BaseController
{
    /**
     * List all categories with event counts
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $categories = Category::with('events')
            ->get()
            ->map(fn($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'icon' => $cat->icon,
                'count' => $cat->events()->where('status', 'approved')->count(),
                'description' => $cat->description,
                'gradient' => $cat->gradient,
                'image' => $cat->image,
            ]);

        return $this->success($categories->all());
    }
}
