<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\Admin\StoreCategoryRequest;
use App\Http\Requests\Api\Admin\UpdateCategoryRequest;
use App\Models\Category;

/**
 * Admin Category Controller
 * 
 * Handles category management by admins.
 */
class AdminCategoryController extends BaseController
{
    /**
     * List all categories
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
                'count' => $cat->events->count(),
                'description' => $cat->description,
            ]);

        return $this->success($categories->all());
    }

    /**
     * Create category
     * 
     * @param StoreCategoryRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return $this->success([
            'id' => $category->id,
            'name' => $category->name,
            'icon' => $category->icon,
        ], 'Category created', 201);
    }

    /**
     * Update category
     * 
     * @param UpdateCategoryRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->notFound('Category not found');
        }

        $category->update($request->validated());

        return $this->success([
            'id' => $category->id,
            'name' => $category->name,
        ], 'Category updated');
    }

    /**
     * Delete category
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->notFound('Category not found');
        }

        if ($category->events()->count() > 0) {
            return $this->error('Cannot delete category with events', [], 400);
        }

        $category->delete();

        return $this->success(null, 'Category deleted');
    }
}
