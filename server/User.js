import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import slugify from "slugify";
import { Category } from "./Category";

Meteor.publish("users", () => Meteor.users.find({   }));

Meteor.methods({
  "user/doesUserExist": (username) => {
    return typeof Accounts.findUserByUsername(username) === "object";
  },

  "user/awardPoints": (materialType, categories) => {
    const currentXp = Meteor.user().profile.xp;
    const currentLevel = Meteor.user().profile.level;
    const currentTokens = Meteor.user().profile.tokens;
    const skills = Meteor.user().profile.skills;

    const categoriesAsArray = categories.split(",").map((current) => slugify(current).toLowerCase());

    let currentSkillXp;
    let skillIndex;

    let addedXp = 0;
    let addedTokens = 0;
    let addedLevel = false;

    if (materialType === "Lectures") {
      addedXp = 500;
      addedTokens = 20;
    } else if (materialType === "video") {
      addedXp = 100;
      addedTokens = 3;
    } else {
      addedXp = 75;
      addedTokens = 3;
    }

    for (const skill in skills) {
      const skillSlug = Category.findOne({ slug: skills[skill].slug }).slug;

      if (categoriesAsArray.includes(skillSlug)) {
        currentSkillXp = skills[skill].xp;

        for (const category in categoriesAsArray) {
          skillIndex = skill;
        }
      }
    }

    if (currentXp + addedXp > currentLevel * 1000) {
      addedLevel = true;

      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.xp": (currentXp + addedXp) - currentLevel * 1000,
          "profile.tokens": currentTokens + addedTokens + 25,
          "profile.level": currentLevel + 1
        }
      })
    } else {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.xp": currentXp + addedXp,
          "profile.tokens": currentTokens + addedTokens
        }
      })
    }

    if (skillIndex) {
      const selector = `profile.skills.${skillIndex}.xp`;

      Meteor.users.update(Meteor.userId(), {
        $set: {
          [selector]: currentSkillXp + addedXp
        }
      });
    }

    return {
      addedTokens,
      addedXp,
      addedLevel
    }
  },

  "user/storeAnalyticData": async (data) => {
    console.log("user/storeAnalyticData", data);

    const mysql = await import("promise-mysql");

    const userId = Meteor.userId();
    const { platformId } = data || 4; // 4 is unknown platform id
    const { sessionId } = data || "";
    const { contentId } = data || "";
    const { durationSeconds } = data || 0;
    const { eventStartTime } = data || 0;
    const { eventTypeId } = data || 0;
    const { eventMessage } = data || "";

    let connection;

    mysql.createConnection(Meteor.settings.mysql)
      .then((connectionObject) => connection = connectionObject)
      .then(() => connection.query(mysql.format(`
        CALL put_ud_into_raw_intake(?,?,?,?,?,?,?,?)
      `), [
        sessionId,
        userId,
        platformId,
        contentId,
        durationSeconds,
        eventStartTime,
        eventTypeId,
        eventMessage
      ]))
      .then(() => connection.end());
  },

  "user/replaceEmail": async (email) => {
    check(email, String);

    const { Accounts } = await import("meteor/accounts-base");

    const oldEmail = Meteor.user().emails[0].address;

    Accounts.addEmail(Meteor.userId(), email);

    Accounts.removeEmail(Meteor.userId(), oldEmail);
  },

  "user/deleteAccount": (userId) => {
    check(userId, String);

    if (userId === Meteor.userId()) {
      Meteor.users.remove(userId);
    }
  }
});
