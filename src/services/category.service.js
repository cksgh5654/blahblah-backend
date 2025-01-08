const Category = require("../schemas/category.schema");

const createCategory = async (data) => {
  try {
    const document = await Category.create(data);
    console.log(document);
    return true;
  } catch (err) {
    console.log(`createCategory 에러 ${err}`);
    return false;
  }
};

const getAllCategories = async () => {
  try {
    const categories = await Category.find({}).select("_id name");
    return categories;
  } catch (err) {
    console.log(`getCategory 에러 ${err}`);
    return false;
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};
