import { Meteor } from "meteor/meteor";

Meteor.methods({
  "content/getRandomFromCategory": async (category, skill) => {
    import mysql from "promise-mysql";
    import Analytics from "analytics-node";

    const connection = await mysql.createConnection(Meteor.settings.mysql);

    console.log(`Getting 3 random items from category ${category}, with skill ${skill}`);

    const query = mysql.format(`
      SELECT *
      FROM cd_raw_intake 
      WHERE material_type = ?
      AND categories LIKE ?
      ORDER BY RAND()
      LIMIT 3
    `, [category, `%${skill}%`]);

    console.log("-- SQL Query:", query);

    const analytics = new Analytics(Meteor.settings.segmentWriteKey);

    analytics.track({
      userId: "0000000",
      event: "Show discover program"
    });

    return await connection.query(query);
  },

  "content/report": (id) => {
    // Meteor.send
  }
});
