const User = require("../Models/Users")

const Profile = require("../Models/Profile")


const { isValid, isValidName, isvalidEmail, isvalidMobile, isValidPassword, keyValid } = require('../Validator/validation')

const imgUpload = require("../AWS/aws-S3")

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')



const register = async function (req, res) {
    try {
        const data = req.body
        const files = req.files

        if (!isValid(files)) return res.status(400).send({ status: false, message: "Please Enter data to Register the User" })

        const { name, bio, phone, email, password,userName,role,isPublic} = data

        if (!isValid(name)) return res.status(400).send({ status: false, message: "name is mandatory and should have non empty String" })

        if (!isValidName.test(name)) return res.status(400).send({ status: false, message: "Please Provide name in valid formate and Should Starts with Capital Letter" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is mandatory and should have non empty String" })

        if (!isvalidEmail.test(email)) return res.status(400).send({ status: false, message: "email should be in  valid Formate" })

        if (await Profile.findOne({ email })) return res.status(400).send({ status: false, message: "This email is already Registered Please give another Email" })

        if (!isValid(userName)) return res.status(400).send({ status: false, message: "userName is mandatory and should have non empty String" })

        if (await User.findOne({ userName })) return res.status(400).send({ status: false, message: "This userName is already Registered Please give another Email" })

        if (!keyValid(files)) return res.status(400).send({ status: false, message: "profile Image is Mandatory" })

            // console.log(` ######################### file $$$$$$$$$$$$$$$$$$$$$$$$$$ `,files[0])

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone is mandatory and should have non empty Number" })

        if (!isvalidMobile.test(phone)) return res.status(400).send({ status: false, message: "please provide Valid phone Number with 10 digits starts with 6||7||8||9" })

        if (await Profile.findOne({ phone })) return res.status(400).send({ status: false, message: "This Phone is already Registered Please give another Phone" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is mandatory and should have non empty String" })

        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "please provide Valid password with 1st letter should be Capital letter and contains spcial character with Min length 8 and Max length 15" })

            if (!isValid(isPublic)) return res.status(400).send({ status: false, message: "isPublic is mandatory and should have non empty String" })

                console.log('####################################')

        let profileImage1 = await imgUpload.uploadFile(files[0])

        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')


        const encyptPassword = await bcrypt.hash(password, 10)

        let obj1 = {
            name, email, photo: profileImage1, phone,bio,isPublic
        }


        let obj = {
            userName, password: encyptPassword
        }


        if(role){
            obj.role=role   
        }

        const newUser = await User.create(obj)

        obj1.userId=newUser._id

        let profile=await Profile.create(obj1)

        console.log(`################## data $$$$$$$$$$$$$$$$ obj ${obj}  obj1 ${obj1}   new user ${newUser} new profile ${profile}`)

        return res.status(201).send({ status: true, message: "User created successfully", data: {...newUser,...profile }})

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const loginUser = async function (req, res) {
    try {
        let data = req.body
        const { userName, password } = data
        //=====================Checking the validation=====================//
        if (!keyValid(data)) return res.status(400).send({ status: false, msg: "Email and Password Required !" })

        //=====================Validation of EmailID=====================//
        if (!userName) return res.status(400).send({ status: false, msg: "userName is required" })


        //=====================Validation of Password=====================//
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })

        //===================== Checking User exsistance using Email and password=====================//
        const user = await User.findOne({ userName })
        if (!user) return res.status(400).send({ status: false, msg: "userName is Invalid Please try again !!" })

        const verifyPassword = await bcrypt.compare(password, user.password)

        if (!verifyPassword) return res.status(400).send({ status: false, msg: "Password is Invalid Please try again !!" })


        //===================== Creating Token Using JWT =====================//
        const token = jwt.sign({
            userId: user._id.toString()
        }, "this is a private key", { expiresIn: '25h' })

        res.setHeader("x-api-key", token)

        let obj = {
            userId: user._id,
            token: token
        }

        res.status(200).send({ status: true, message: "User login successfull", data: obj })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { register, loginUser}