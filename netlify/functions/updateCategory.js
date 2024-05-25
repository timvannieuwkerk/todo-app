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
  const { id } = JSON.parse(event.body);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      JSON.parse(event.body),
      {
        new: true,
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updatedCategory),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
