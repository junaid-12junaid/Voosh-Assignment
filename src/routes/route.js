const express = require('express')
const router = express.Router()
const { auth } = require("../middleware/auth")
const { isAdmin } = require("../middleware/isAdmin")

const userModel = require('../controllers/auth')
const profileModel = require('../controllers/profile')



//User Routes
router.post("/register", userModel.register)

router.post("/login", userModel.loginUser)


// Profile Routes
router.get("/viewProfileOwn",auth, profileModel.viewProfileOwn)
router.get("/viewProfileAll",auth, profileModel.viewProfileAll)
router.put("/updateUser", auth,profileModel.updateUser)
router.put("/visibility",auth,isAdmin, profileModel.visibility)





// for worng route=============================>

router.all('/*/', async function (req, res) {
    return res.status(404).send({ status: false, message: "Page Not Found" })
})


module.exports = router