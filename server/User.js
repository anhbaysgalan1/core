import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

Meteor.publish("users", () => Meteor.users.find({   }));

Meteor.methods({
  "user/doesUserExist": (username) => {
    console.log("user/doesUserExist");
    console.log(Accounts.findUserByUsername(username));
    console.log(typeof Accounts.findUserByUsername(username));

    return typeof Accounts.findUserByUsername(username) === "object";
  }
});
