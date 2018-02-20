import { Meteor } from "meteor/meteor";
import { SavedForLater } from "/imports/api/SavedForLater";

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
      const contentIds = SavedForLater
        .find({ user: currentUserId })
        .fetch()
        .map((current) => current.content);

      if (contentIds.length <= 0) {
        return [];
      }

      const query = `SELECT * FROM cd_raw_intake WHERE row_id IN (${contentIds})`;
      const results = await connection.query(query);

      return results;
    }

    // throw new Meteor.Error("user-not-signed-in", "You need to be signed in to get your saved content");
  },

  removeSavedForLaterContent(contentId) {
    SavedForLater.remove({ user: Meteor.userId(), content: contentId });
  }
});
