const MONGODB_URI =
  "mongodb+srv://timvannieuwkerk:QHgwFPmLbM0NZBcv@todocluster.fsw0fu1.mongodb.net/?retryWrites=true&w=majority&appName=todocluster";

const mongoose = require("mongoose");
require("dotenv").config();

const Category = mongoose.model("Category", {
  category: String,
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  const { id } = JSON.parse(event.body);
  try {
    await Category.findByIdAndDelete(id);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Category deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
