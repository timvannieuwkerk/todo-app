const mongoose = require("mongoose");
require("dotenv").config();

const Category = mongoose.model("Category", {
  category: String,
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const newCategory = new Category(data);
    const savedCategory = await newCategory.save();
    return {
      statusCode: 201,
      body: JSON.stringify(savedCategory),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
