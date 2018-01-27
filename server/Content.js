import { Meteor } from "meteor/meteor";

Meteor.methods({
  "content/getRandomFromCategory": async (category) => {
    import mysql from "promise-mysql";

    const connection = await mysql.createConnection(Meteor.settings.mysql);

    const query = mysql.format(`
      SELECT *
      FROM cd_raw_intake 
      WHERE material_type = ?
      ORDER BY RAND()
      LIMIT 3
    `, [category]);

    return await connection.query(query);
  }
});
