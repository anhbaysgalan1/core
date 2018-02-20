import { Mongo } from "meteor/mongo";

export const Categories = new Mongo.Collection("categories");

export function getAllCategories() {
  return Categories.find().fetch();
}

export function getCategoryBySlug(slug) {
  return Categories.findOne({ slug: slug });
}
