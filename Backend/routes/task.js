const express = require("express");
const {
    addtask,
    edittask,
    deletetask,
    gettask
} = require("../controllers/task");

const router = express.Router();


//CRUD 
router.post("/addtask", addtask)
router.put("/tasks/:id", edittask)
router.delete("/deltasks/:id",  deletetask)
router.get("/gettasks",gettask)



module.exports = router;
