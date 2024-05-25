const mongoose = require("mongoose");
require("dotenv").config();

const Todo = mongoose.model("Todo", {
  title: String,
  category: String,
  date: String,
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async (event, context) => {
  try {
    const todos = await Todo.find();
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
