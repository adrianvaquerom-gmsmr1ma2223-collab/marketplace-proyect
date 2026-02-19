const { z } = require("zod");

const courseSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  description: z.string().min(10, "Description must have at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().optional(),
  image: z.string().optional(),
});

module.exports = { courseSchema };