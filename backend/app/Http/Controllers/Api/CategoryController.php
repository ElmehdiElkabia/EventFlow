<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;

class CategoryController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::paginate(15);
        return $this->successResponse(CategoryResource::collection($categories)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = Category::create($request->validated());
            return $this->successResponse(new CategoryResource($category), 'Category created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create category', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return $this->successResponse(new CategoryResource($category));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            $category->update($request->validated());
            return $this->successResponse(new CategoryResource($category), 'Category updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update category', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            $category->delete();
            return $this->successResponse(null, 'Category deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete category', 500, ['error' => $e->getMessage()]);
        }
    }
}
