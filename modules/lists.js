const express = require("express");
const db = require("./db.js");
const router = express.Router();
const protect = require("./auth.js");



router.get("/list", protect, async function(req, res, next) {

    let userId = res.locals.userid;

    try{

        let data = await db.getList(userId);

        if (data.rowCount == 0) {
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




router.get("/public", async function(req, res, next) {

    try{

        let data = await db.getPublicItems();
        if (data.rowCount == 0) {
            res.status(403).json({
                error: "Public items not found."
            }).end();
        }
        else {
            res.status(200).json(data.rows).end();

            }
        }
        catch (err) {
            next(err);
        }
    });


router.get("/publicAdmin", protect, async function(req, res, next) {

    let userId = res.locals.userid;

    try{

        let data = await db.getPublicAdmin(userId);
        if (data.rowCount == 0) {
            res.status(403).json({
                error: "Public items not found."
            }).end();
        }
        else {
            res.status(200).json(data.rows).end();

            }
        }
        catch (err) {
            next(err);
        }
    });



router.delete("/deletePublicItemAdmin", protect, async function(req, res, next) {

    let listId = req.body.id;
    let userId = res.locals.userid;

    try{
            
            let data = await db.adminDeletePublicItem(listId, userId);
    
            if (data.rowCount == 0) {
                res.status(403).json({
                    error: "Could not delete item."
                }).end();
            } else {
                res.status(200).json(data.rows).end();
            }
    
        } catch (err) {
            next(err);
        }
    });
    

    


router.delete("/deleteItem", protect, async function(req, res, next) {

    let listId = req.body.id;
    let userId = res.locals.userid;

    try{
        
        let data = await db.deleteListItem(listId, userId);

        if (data.rowCount == 0) {
            res.status(403).json({
                error: "Could not delete item."
            }).end();
        } else {
            res.status(200).json(data.rows).end();
        }

    } catch (err) {
        next(err);
    }
});




router.post("/list", protect, async function(req, res, next) {		

	let updata = req.body;
	let userid = res.locals.userid;
	let username = res.locals.username;

	try{

		let data = await db.addListItem(updata.inputHeading, updata.inputDescription, userid, username, updata.dueDate, updata.publicStatus);

		if (data.rows.length > 0){
			res.status(200).json({msg: "List item was posted."}).end();
		}

		else {
			res.status(403).json({error: "List item could not be posted."}).end();
		}
	}
	catch(err){
		next(err);
	}
});



router.post("/editItem", protect, async function(req, res, next) {

    let updata = req.body;
    let userId = res.locals.userid;

    try{
            
        let data = await db.editListItem(updata.header, updata.text, updata.dueDate, updata.status, updata.id, userId);

        if (data.rows.length > 0){
            res.status(200).json({msg: "Item was edited. Redirecting..."}).end();
        }

        else {
            res.status(403).json({error: "Item could not be edited."}).end();
        }
    }
    catch(err){
        next(err);
    }
});



module.exports = router;