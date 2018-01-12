import { Meteor } from "meteor/meteor";
import { LiveMysql } from "meteor/numtel:mysql";

const liveDb = new LiveMysql(Meteor.settings.mysql);

Meteor.publish("allContent", () => {
  return liveDb.select("SELECT * FROM cd_raw_intake LIMIT 3", [ { "table": "cd_raw_intake" } ]);
});

const closeAndExit = function() {
  liveDb.end();
  process.exit();
};

// Close connections on hot code push
process.on('SIGTERM', closeAndExit);
// Close connections on exit (ctrl + c)
process.on('SIGINT', closeAndExit);

