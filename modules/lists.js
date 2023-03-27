// ----------------------- Routes for to-do list item stuff ----------------------- //

const express = require("express");
const db = require("./db.js");
const router = express.Router();
const protect = require("./auth.js");


// Get list items.
router.get("/list", protect, async function(req, res, next) {

    let userId = res.locals.userid; // get id of the logged in user making the request.

    try{

        let data = await db.getList(userId); //ask db.js for list items containing that user id.

        if (data.rowCount == 0) { //the user either has lists or s/he doesnt. If they do, send list, if not send error.
            res.status(403).json({
                error: "List not found."
            }).end();
        } else {
            res.status(200).json(data.rows).end();
        }

    } catch (err) {
        next(err);
    }
});



// get public items
router.get("/public", async function(req, res, next) {

    try{

        let data = await db.getPublicItems(); //ask db.js for public list items
        if (data.rowCount == 0) {
            res.status(403).json({
                error: "Public items not found."
            }).end();
        }
        else {
            res.status(200).json(data.rows).end(); //return them if found.

            }
        }
        catch (err) {
            next(err);
        }
    });


// get public items for admin
router.get("/publicAdmin", protect, async function(req, res, next) {

    let userId = res.locals.userid; //get id of the request making user.

    try{

        let data = await db.getPublicAdmin(userId); //send id to and call a function in db.js
        if (data.rowCount == 0) {
            res.status(403).json({
                error: "Public items not found."
            }).end();
        }
        else {
            res.status(200).json(data.rows).end(); //send to client if found.

            }
        }
        catch (err) {
            next(err);
        }
    });


// delete public item for admin
router.delete("/deletePublicItemAdmin", protect, async function(req, res, next) {

    let listId = req.body.id;//get list item id.
    let userId = res.locals.userid;// get user id.

    try{
            
            let data = await db.adminDeletePublicItem(listId, userId); //send info to adminDeletePublicItem function in db.js
    
            if (data.rowCount == 0) {
                res.status(403).json({
                    error: "Could not delete item."
                }).end();
            } else {
                res.status(200).json(data.rows).end(); //if delete was successful, send updated list.
            }
    
        } catch (err) {
            next(err);
        }
    });
    

    

// delete item
router.delete("/deleteItem", protect, async function(req, res, next) {

    let listId = req.body.id;//get list item id.
    let userId = res.locals.userid; // get user id.

    try{
        
        let data = await db.deleteListItem(listId, userId); //send info to deleteListItem function in db.js

        if (data.rowCount == 0) {
            res.status(403).json({
                error: "Could not delete item."
            }).end();
        } else {
            res.status(200).json(data.rows).end(); //if delete was successful, send updated list.
        }

    } catch (err) {
        next(err);
    }
});



// add list item
router.post("/list", protect, async function(req, res, next) {		

	let updata = req.body;//get item data from client.
	let userid = res.locals.userid; //get user id.
	let username = res.locals.username;//get username.

	try{
        //send data to addListItem function in db.js with information from above.
		let data = await db.addListItem(updata.inputHeading, updata.inputDescription, userid, username, updata.dueDate, updata.publicStatus);

		if (data.rows.length > 0){
			res.status(200).json({msg: "List item was posted."}).end();
		}

		else {// if successful send message, if not send error.
			res.status(403).json({error: "List item could not be posted."}).end();
		}
	}
	catch(err){
		next(err);
	}
});


// edit list item
router.post("/editItem", protect, async function(req, res, next) {

    let updata = req.body;//get item data from client.
    let userId = res.locals.userid;//get user id.

    try{
        // send data to editListItem function in db.js with information from above.
        let data = await db.editListItem(updata.header, updata.text, updata.dueDate, updata.status, updata.id, userId);

        if (data.rows.length > 0){
            res.status(200).json({msg: "Item was edited. Redirecting..."}).end();
        }

        else {// if successful send message, if not send error.
            res.status(403).json({error: "Item could not be edited."}).end();
        }
    }
    catch(err){
        next(err);
    }
});



module.exports = router;