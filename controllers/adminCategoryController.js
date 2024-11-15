import adminCategoryService from "../services/adminCategoryService.js";

// Create category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCategory = await adminCategoryService.createCategoryService(
      name,
      description
    );
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await adminCategoryService.getAllCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await adminCategoryService.updateCategoryService(
      categoryId,
      name,
      description
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const response = await adminCategoryService.deleteCategoryService(
      categoryId
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
