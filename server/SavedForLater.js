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

      let bookmark;
      const results = [];

      for (const bookmarkId of contentIds) {
        bookmark = await connection.query(mysql.format(`CALL get_content_by_id(?)`, [`${bookmarkId}`]));

        results.push(bookmark[0][0]); // Pushing the results part of the first (and only) item returned by MySQL
      }

      connection.end();

      return results;
    }

    // throw new Meteor.Error("user-not-signed-in", "You need to be signed in to get your saved content");
  },

  removeSavedForLaterContent(contentId) {
    SavedForLater.remove({ user: Meteor.userId(), content: contentId });
  }
});
