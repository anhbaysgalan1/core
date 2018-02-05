import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import slugify from "slugify";
import { Category } from "./Category";

Meteor.publish("users", () => Meteor.users.find({   }));

Meteor.methods({
  "user/doesUserExist": (username) => {
    console.log("user/doesUserExist");
    console.log(Accounts.findUserByUsername(username));
    console.log(typeof Accounts.findUserByUsername(username));

    return typeof Accounts.findUserByUsername(username) === "object";
  },
  "user/awardPoints": (materialType, categories) => {
    console.log("Awarding points for", materialType);

    const currentXp = Meteor.user().profile.xp;
    const currentLevel = Meteor.user().profile.level;
    const currentTokens = Meteor.user().profile.tokens;
    const skills = Meteor.user().profile.skills;

    const categoriesAsArray = categories.split(",").map((current) => slugify(current).toLowerCase());

    let currentSkillXp;
    let skillIndex;

    console.log("Current XP =", currentXp);
    console.log("Current tokens =", currentTokens);

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
      console.log("Checking skill", skills[skill]);
      console.log("Looking for", categoriesAsArray);

      const skillSlug = Category.findOne({ slug: skills[skill].slug }).slug;

      if (categoriesAsArray.includes(skillSlug)) {
        currentSkillXp = skills[skill].xp;

        for (const category in categoriesAsArray) {
          console.log(`Current XP on ${categoriesAsArray[category]}`, currentSkillXp);
          console.log(`New XP on ${categoriesAsArray[category]}`, currentSkillXp + addedXp);

          skillIndex = skill;
        }
      }
    }

    console.log("New XP =", currentXp + addedXp);
    console.log("New tokens =", currentTokens + addedTokens);

    if (currentXp + addedXp > currentLevel * 1000) {
      console.log("Upgrading level");

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
  }
});
