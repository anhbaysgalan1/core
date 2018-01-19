import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const Category = new Mongo.Collection("categories");

Meteor.publish("categories", () => Category.find());
