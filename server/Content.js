import { Meteor } from "meteor/meteor";

Meteor.methods({
  "content/getRandomFromCategory": async (category, skill) => {
    const mysql = await import("promise-mysql");

    const connection = await mysql.createConnection(Meteor.settings.mysql);

    const query = mysql.format(`
      SELECT *
      FROM cd_raw_intake 
      WHERE material_type LIKE ?
      AND categories LIKE ?
      ORDER BY RAND()
      LIMIT 3
    `, [`%${category}%`, `%${skill}%`]);

    const results = await connection.query(query);

    connection.end();

    return results;
  },

  "content/report": async (link) => {
    const { Email } = await import("meteor/email");

    Email.send({
      from: "undermindops@gmail.com",
      to: "undermindops@gmail.com",
      subject: "New content reported",
      text: `The following content was reported by user ${Meteor.user().username}: ${link}`
    });
  },

  "content/search": async (term) => {
    const mysql = await import("promise-mysql");

    const connection = await mysql.createConnection(Meteor.settings.mysql);

    const query = mysql.format(`
      SELECT *
      FROM cd_raw_intake 
      WHERE title LIKE ?
      ORDER BY RAND()
      LIMIT 3
    `, [`%${term}%`]);

    const results = await connection.query(query);

    connection.end();

    console.log(`Searched for ${term} with results`, results);

    return results;
  }
});
