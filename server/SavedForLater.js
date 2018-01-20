import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

const formatContentIds = (contentIds) => contentIds.map((current, index, all) => {
  // if (index !== all.length - 1) {
  //   console.log("Adding a coma after", current);
    // return (current + ",");
  // }

  return current;
});

export const SavedForLater = new Mongo.Collection("savedForLater");

Meteor.publish("savedForLater", () => SavedForLater.find());

Meteor.methods({
  "content/saveForLater": (id) => {
    const currentUserId = Meteor.userId();

    if (currentUserId) {
      return SavedForLater.insert({ user: currentUserId, content: id });
    }

    throw new Meteor.Error("user-not-signed-in", "You need to be signed in to save content for later");
  },

  async getSavedForLater() {
    import mysql from "promise-mysql";

    const connection = await mysql.createConnection(Meteor.settings.mysql);

    const currentUserId = Meteor.userId();

    if (currentUserId) {
      console.log("User is logged in:", currentUserId);

      const contentIds = SavedForLater
        .find({ user: currentUserId })
        .fetch()
        .map((current) => current.content);

      console.log("Returning saved for later:", contentIds);

      const query = `SELECT * FROM cd_raw_intake WHERE row_id IN (${contentIds})`;
      console.log("Using query", query);
      const results = await connection.query(query);

      console.log("Final content:", results);

      return results;

    }

    // throw new Meteor.Error("user-not-signed-in", "You need to be signed in to get your saved content");
  }
});
