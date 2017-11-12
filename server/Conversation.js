import { Meteor } from "meteor/meteor";

// Meteor.publish("conversation", function() {
//   return Messages.find({ userId: this.userId });
// });
//
// Meteor.methods({
//   "conversation/sendMessage": ({ text, sender }) => {
//     console.log(`${text} ${sender}`);
//
//     if (Meteor.userId()) {
//       Messages.insert({
//         message: text,
//         createdAt: new Date(),
//         userId: Meteor.userId()
//       });
//     }
//   }
// });
