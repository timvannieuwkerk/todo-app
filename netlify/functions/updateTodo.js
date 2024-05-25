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
  const { id } = JSON.parse(event.body);
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      JSON.parse(event.body),
      {
        new: true,
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updatedTodo),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
