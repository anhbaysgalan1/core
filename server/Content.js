import { Meteor } from "meteor/meteor";

Meteor.methods({
  "content/getRandomFromCategory": async (category, skill) => {
    const mysql = await import("promise-mysql");

    console.log(`content/getRandomFromCategory ${category} ${skill}`);

    let connection;
    let categoryId;
    let skillId;

    const categoryTypeQuery = mysql.format(`
      SELECT row_id
      FROM cd_type
      WHERE name LIKE ?
    `, [`%${category}%`]);

    const skillTypeQuery = mysql.format(`
      SELECT row_id
      FROM cd_category
      WHERE name LIKE ?
    `, [`%${skill}%`]);

    return mysql.createConnection(Meteor.settings.mysql)
      .then((connectionObject) => connection = connectionObject)
      .then(() => connection.query(skillTypeQuery))
      .then((skillRow) => {
        if (skillRow[0] && skillRow[0].row_id) {
          console.log("Skill type rows", skillRow[0].row_id);

          skillId = skillRow[0].row_id;
        } else {
          throw new Meteor.Error("skill-not-found", `Couldn't find skill matching ${skill}`);
        }
      })
      .then(() => connection.query(categoryTypeQuery))
      .then((categoryRow) => {
        if (categoryRow[0] && categoryRow[0].row_id) {
          console.log("Category type row", categoryRow[0].row_id);

          categoryId = categoryRow[0].row_id;
        } else {
          throw new Meteor.Error("category-not-found", `Couldn't find category matching ${category}`);
        }
      })
      .then(() => {
        console.log("skillId", skillId);
        console.log("categoryId", categoryId);

        const query = mysql.format(`
          CALL get_content_by_typeANDcat(?,?);
        `, [categoryId, skillId]);

        return connection.query(query);
      })
      .then((results) => {
        console.log("getRandomFromCategory results", results[0]);

        connection.end();

        return results[0]; // Because of raw MySQL data structure. Return empty array if undefined.
      });
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
  },

  "content/like": (content) => {
    check(content, Object);

    console.log("Like", content);
  },

  "content/dislike": (content) => {
    check(content, Object);

    console.log("Dislike", content);
  }
});
