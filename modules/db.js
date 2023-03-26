const pg = require("pg");
require("dotenv").config();
const connstring = process.env.DATABASE_URL;
const pool = new pg.Pool({connectionString: connstring, ssl: {rejectUnauthorized: false}});

let dbMethods = {};

// -------------- USERS ----------------

dbMethods.getUser = function(username) {
    let sql = "SELECT * FROM userstodo WHERE username = $1";
    let values = [username];
    return pool.query(sql, values);
};

dbMethods.createUser = function(username, password, salt) {
    let sql = "INSERT INTO userstodo (id, username, password, salt) VALUES (DEFAULT, $1, $2, $3) RETURNING *";
    let values = [username, password, salt];
    return pool.query(sql, values);
};



// -------------- LISTS ----------------


dbMethods.getList = function(userId) {
    let sql = "SELECT * FROM todolists WHERE userid = $1";
    let values = [userId];
    return pool.query(sql, values);
}

dbMethods.addListItem = function(heading, details, userid, username, date, public) {
    let sql = "INSERT INTO todolists (id, heading, details, userid, username, date, public) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING *";
    let values = [heading, details, userid, username, date, public];
    return pool.query(sql, values);
}

dbMethods.editListItem = function(heading, details, date, public, id, userid) {
    let sql = "UPDATE todolists SET heading = $1, details = $2, date = $3, public = $4 WHERE id = $5 AND userid = $6 RETURNING *";
    let values = [heading, details, date, public, id, userid];
    return pool.query(sql, values);
}

dbMethods.deleteListItem = function(listId, userId) {
    let sql = "DELETE FROM todolists WHERE id = $1 AND userid = $2 RETURNING *";
    let values = [listId, userId];
    return pool.query(sql, values);
}


dbMethods.adminDeletePublicItem = function(listId, userId) {
    let adminSql = "SELECT role FROM userstodo WHERE id = $1";
    let values = [userId];
    return pool.query(adminSql, values)
        .then(data=> {
            let admin = data.rows[0].role;
            if (admin == "admin") {
                let sql = "DELETE FROM todolists WHERE id = $1 RETURNING *";
                let values = [listId];
                return pool.query(sql, values);
            }
            else {
                throw new Error("You do not have permission to delete this item.");
            }
        })
}


dbMethods.getPublicItems = function() {
    let sql = "SELECT * FROM todolists WHERE public LIKE '%public%'";
    return pool.query(sql);
}

dbMethods.getPublicAdmin = function(userid) {
    let sql = "SELECT role FROM userstodo WHERE id = $1";
    let values = [userid];
    return pool.query(sql, values)
        .then(data=> {
            let role = data.rows[0].role;
            if (role == "admin") {
                return dbMethods.getPublicItems();
            }
            else {
                throw new Error("You do not have permission to view this page.");
            }
        })
}


module.exports = dbMethods;