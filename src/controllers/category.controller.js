const {
  createCategory,
  getAllCategories,
} = require("../services/category.service");

const categoryController = require("express").Router();

categoryController.post("/create/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const createResult = await createCategory({ name });
    if (!createResult) {
      return res
        .status(500)
        .json({ isError: true, message: "카테고리 등록 실패" });
    }
    return res
      .status(201)
      .json({ isError: false, message: "카테고리 등록 성공" });
  } catch (error) {
    console.error(error);
    return res.json({ isError: true, message: error.message });
  }
});

categoryController.get("/board", async (_req, res) => {
  try {
    const categories = await getAllCategories();
    if (!categories) {
      return res
        .status(500)
        .json({ isError: true, message: "카테고리가 없습니다" });
    }
    return res.status(200).json({ isError: false, categories });
  } catch (error) {
    console.error(error);
    return res.json({ isError: true, message: error.message });
  }
});

module.exports = categoryController;
