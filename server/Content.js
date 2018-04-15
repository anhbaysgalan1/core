import { Meteor } from "meteor/meteor";

Meteor.methods({
  "content/getRandomFromCategory": async (category, skill) => {
    const mysql = await import("promise-mysql");

    let connection;
    let categoryId;
    let skillId;

    const categoryTypeQuery = mysql.format(`
      SELECT row_id
      FROM cd_type
      WHERE ty_name LIKE ?
    `, [`%${category}%`]);

    const skillTypeQuery = mysql.format(`
      SELECT row_id
      FROM cd_category
      WHERE ca_name LIKE ?
    `, [`%${skill}%`]);

    return mysql.createConnection(Meteor.settings.mysql)
      .then((connectionObject) => connection = connectionObject)
      .then(() => connection.query(skillTypeQuery))
      .then((skillRow) => {
        if (skillRow[0] && skillRow[0].row_id) {
          skillId = skillRow[0].row_id;
        } else {
          throw new Meteor.Error("skill-not-found", `Couldn't find skill matching ${skill}`);
        }
      })
      .then(() => connection.query(categoryTypeQuery))
      .then((categoryRow) => {
        if (categoryRow[0] && categoryRow[0].row_id) {
          categoryId = categoryRow[0].row_id;
        } else {
          throw new Meteor.Error("category-not-found", `Couldn't find category matching ${category}`);
        }
      })
      .then(() => {
        const query = mysql.format(`
          CALL get_content_by_typeANDcat(?,?);
        `, [categoryId, skillId]);

        return connection.query(query);
      })
      .then((results) => {
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

    const query = mysql.format(`CALL get_cd_search(?)`, [`%${term}%`]);

    const results = await connection.query(query);

    connection.end();

    return results[0];
  },

  "content/like": async (data) => {
    check(data, Object);

    const mysql = await import("promise-mysql");

    const userId = Meteor.userId();
    const { platformId } = data || 4; // Unknown platform by default
    const { sessionId } = data || "";
    const { contentId } = data || "";
    const { eventStartTime } = data || 0;

    let connection;

    mysql.createConnection(Meteor.settings.mysql)
      .then((connectionObject) => connection = connectionObject)
      .then(() => connection.query(mysql.format(`
        CALL put_ud_into_raw_intake(?,?,?,?,?,?,?,?,?)
      `), [
        sessionId,
        userId,
        platformId,
        contentId,
        0, // Event duration
        eventStartTime,
        2, // Event type "Rating"
        "Like",
        1 // Liking
      ]))
      .then(() => connection.end());
  },

  "content/dislike": async (data) => {
    check(data, Object);

    const mysql = await import("promise-mysql");

    const userId = Meteor.userId();
    const { platformId } = data || 4; // Unknown platform by default
    const { sessionId } = data || "";
    const { contentId } = data || "";
    const { eventStartTime } = data || 0;

    let connection;

    mysql.createConnection(Meteor.settings.mysql)
      .then((connectionObject) => connection = connectionObject)
      .then(() => connection.query(mysql.format(`
        CALL put_ud_into_raw_intake(?,?,?,?,?,?,?,?,?)
      `), [
        sessionId,
        userId,
        platformId,
        contentId,
        0, // Event duration
        eventStartTime,
        2, // Event type "Rating"
        "Dislike", // Event message
        -1 // Disliking
      ]))
      .then(() => connection.end());
  }
});
