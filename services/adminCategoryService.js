import Category from "../models/categoryModel.js";

// Admin creates a category service
const createCategoryService = async (name, description) => {
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  const newCategory = new Category({
    name,
    description,
  });

  await newCategory.save();

  return newCategory;
};

// Admin gets all categories service
const getAllCategoriesService = async () => {
  return await Category.find();
};

// Update Category service
const updateCategoryService = async (categoryId, name, description) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error("Category not found.");
  }

  category.name = name || category.name;
  category.description = description || category.description;

  await category.save();
  return category;
};

// Admin deletes a category service
const deleteCategoryService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found.");

  await category.deleteOne();
  return { message: "Category deleted successfully." };
};

export default {
  createCategoryService,
  getAllCategoriesService,
  updateCategoryService,
  deleteCategoryService,
};
