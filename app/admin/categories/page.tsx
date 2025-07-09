import { CategoryManagement } from "@/components/category-management"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-gray-600">Manage your product categories</p>
      </div>
      <CategoryManagement />
    </div>
  )
}
