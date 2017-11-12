import { Mongo } from "meteor/mongo";

export const Messages = new Mongo.Collection("conversations");

export function getMessages() {
  return Messages.find({ userId }).fetch();
}
