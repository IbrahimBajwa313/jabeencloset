"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: {
    _id: string
    name: string
  }
  isActive: boolean
  sortOrder: number
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  image: string
  parent: string
  isActive: boolean
  sortOrder: number
  seoTitle: string
  seoDescription: string
}

const initialFormData: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  image: "",
  parent: "",
  isActive: true,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
}

// Separate CategoryForm component to prevent re-rendering issues
function CategoryForm({
  formData,
  setFormData,
  categories,
  selectedCategory,
  isEdit = false,
  onSubmit,
  onCancel,
  isSubmitting,
  uploadingImage,
  onImageUpload,
}: {
  formData: CategoryFormData
  setFormData: (data: CategoryFormData) => void
  categories: Category[]
  selectedCategory: Category | null
  isEdit?: boolean
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isSubmitting: boolean
  uploadingImage: boolean
  onImageUpload: (file: File) => void
}) {
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }, [])

  const handleNameChange = useCallback(
    (name: string) => {
      setFormData({
        ...formData,
        name,
        slug: generateSlug(name),
      })
    },
    [formData, setFormData, generateSlug],
  )

  const handleInputChange = useCallback(
    (field: keyof CategoryFormData, value: string | number | boolean) => {
      setFormData({
        ...formData,
        [field]: value,
      })
    },
    [formData, setFormData],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onImageUpload(file)
      }
    },
    [onImageUpload],
  )

  const removeImage = useCallback(() => {
    setFormData({
      ...formData,
      image: "",
    })
  }, [formData, setFormData])

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-name" : "name"}>Category Name</Label>
          <Input
            id={isEdit ? "edit-name" : "name"}
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="Enter category name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-slug" : "slug"}>Slug</Label>
          <Input
            id={isEdit ? "edit-slug" : "slug"}
            value={formData.slug}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            required
            placeholder="category-slug"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-description" : "description"}>Description</Label>
        <Textarea
          id={isEdit ? "edit-description" : "description"}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Category description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-parent" : "parent"}>Parent Category</Label>
          <Select
            value={formData.parent}
            onValueChange={(value) => handleInputChange("parent", value === "none" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Parent</SelectItem>
              {categories
                .filter((cat) => cat._id !== selectedCategory?._id)
                .map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-sortOrder" : "sortOrder"}>Sort Order</Label>
          <Input
            id={isEdit ? "edit-sortOrder" : "sortOrder"}
            type="number"
            value={formData.sortOrder}
            onChange={(e) => handleInputChange("sortOrder", Number.parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>Category Image</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          {formData.image ? (
            <div className="relative inline-block">
              <Image
                src={formData.image || "/placeholder.svg"}
                alt="Category preview"
                width={200}
                height={150}
                className="rounded-lg object-cover mx-auto"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <Label htmlFor={isEdit ? "edit-image" : "image"} className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-500">Click to upload image</span>
                  <Input
                    id={isEdit ? "edit-image" : "image"}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploadingImage}
                  />
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
        {uploadingImage && <div className="text-center text-sm text-gray-500">Uploading image...</div>}
      </div>

      {/* SEO Section */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">SEO Settings</h4>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-seoTitle" : "seoTitle"}>SEO Title</Label>
          <Input
            id={isEdit ? "edit-seoTitle" : "seoTitle"}
            value={formData.seoTitle}
            onChange={(e) => handleInputChange("seoTitle", e.target.value)}
            placeholder="SEO title for search engines"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-seoDescription" : "seoDescription"}>SEO Description</Label>
          <Textarea
            id={isEdit ? "edit-seoDescription" : "seoDescription"}
            value={formData.seoDescription}
            onChange={(e) => handleInputChange("seoDescription", e.target.value)}
            placeholder="SEO description for search engines"
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id={isEdit ? "edit-isActive" : "isActive"}
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange("isActive", checked)}
        />
        <Label htmlFor={isEdit ? "edit-isActive" : "isActive"}>Active</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || uploadingImage}>
          {isSubmitting ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update Category" : "Add Category"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
  }, [])

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file) return

      setUploadingImage(true)

      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Error",
            description: "Please select only image files",
            variant: "destructive",
          })
          return
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "Image size should be less than 5MB",
            variant: "destructive",
          })
          return
        }

        const formDataUpload = new FormData()
        formDataUpload.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        })

        if (response.ok) {
          const data = await response.json()
          setFormData((prev) => ({
            ...prev,
            image: data.url,
          }))
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          })
        } else {
          throw new Error("Failed to upload image")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        })
      } finally {
        setUploadingImage(false)
      }
    },
    [toast],
  )

  const handleAddCategory = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        const categoryData = {
          ...formData,
          parent: formData.parent || undefined,
        }

        const response = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Category added successfully",
          })
          setIsAddDialogOpen(false)
          resetForm()
          fetchCategories()
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to add category")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add category",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, toast, resetForm],
  )

  const handleEditCategory = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!selectedCategory) return

      setIsSubmitting(true)

      try {
        const categoryData = {
          ...formData,
          parent: formData.parent || undefined,
        }

        const response = await fetch(`/api/admin/categories/${selectedCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Category updated successfully",
          })
          setIsEditDialogOpen(false)
          resetForm()
          setSelectedCategory(null)
          fetchCategories()
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update category")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update category",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, selectedCategory, toast, resetForm],
  )

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      if (!confirm("Are you sure you want to delete this category?")) return

      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Category deleted successfully",
          })
          fetchCategories()
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete category")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete category",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const openEditDialog = useCallback((category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      parent: category.parent?._id || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      seoTitle: category.seoTitle || "",
      seoDescription: category.seoDescription || "",
    })
    setIsEditDialogOpen(true)
  }, [])

  const handleAddDialogOpen = useCallback(() => {
    resetForm()
    setIsAddDialogOpen(true)
  }, [resetForm])

  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false)
    resetForm()
  }, [resetForm])

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false)
    resetForm()
    setSelectedCategory(null)
  }, [resetForm])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="bg-gray-300 h-12 w-12 rounded"></div>
                <div className="bg-gray-300 h-4 w-32 rounded"></div>
                <div className="bg-gray-300 h-4 w-24 rounded"></div>
                <div className="bg-gray-300 h-4 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Category Management</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddDialogOpen}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a new category for your products</DialogDescription>
                </DialogHeader>
                <CategoryForm
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  selectedCategory={null}
                  isEdit={false}
                  onSubmit={handleAddCategory}
                  onCancel={handleAddDialogClose}
                  isSubmitting={isSubmitting}
                  uploadingImage={uploadingImage}
                  onImageUpload={handleImageUpload}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Image
                          src={category.image || "/placeholder.svg?height=50&width=50"}
                          alt={category.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">{category.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                    </TableCell>
                    <TableCell>{category.parent?.name || "—"}</TableCell>
                    <TableCell>{category.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            selectedCategory={selectedCategory}
            isEdit={true}
            onSubmit={handleEditCategory}
            onCancel={handleEditDialogClose}
            isSubmitting={isSubmitting}
            uploadingImage={uploadingImage}
            onImageUpload={handleImageUpload}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
