
const Profile = require('../Models/Profile');
const User = require('../Models/Users');

const { isValid, isValidName, isvalidEmail, isvalidMobile, isValidPassword } = require('../Validator/validation')



const { isValidObjectId } = require("mongoose")

// Get profile details
let viewProfileOwn = async (req, res) => {
    try {

        const UserIdData = req.params.userId

        const decodedToken = req.decodedToken

        if (!isValidObjectId(UserIdData)) return res.status(400).send({ status: false, message: 'userId is not valid' })

        let user = await User.findById(UserIdData)
        let user1 = await Profile.findById({userId:UserIdData})

        if (!user) return res.status(404).send({ status: false, messgage: ' user not found' })

        if (UserIdData !== decodedToken) return res.status(401).send({ status: false, messgage: 'Unauthorized access!' })

        return res.status(200).send({ status: true, message: 'User profile details', data: {...user,...user1} })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


let viewProfileAll = async (req, res) => {
    try {
        const decodedToken = req.decodedToken

      
        let user1 = await User.findById({_id:decodedToken})

        if (!user1) return res.status(404).send({ status: false, messgage: ' user not found' })

            var allUsers
       if(user1.role=="admin"){
        allUsers=await Profile.find()
       }else{
        allUsers=await Profile.find({isPublic:true})
       }

        return res.status(200).send({ status: true, message: 'User profile details', data:allUsers})
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

// Edit profile
const updateUser = async function (req, res) {
    try {
        let body = req.body
        const decodedToken = req.decodedToken

        const files = req.files

        let user = await User.findById(userId)

        if (!user) return res.status(404).send({ status: false, messgage: ' user not found' })

        if (!isValid(files)) return res.status(400).send({ status: false, message: "Please Enter data to update the User" })

        const data = {}
        if (files) {
            if (!validString(body.profileImage)) return res.status(400).send({ status: false, message: "please provide profile image" })
            if (files.length > 0) {
                data.photo = await imgUpload.uploadFile(files[0])
            }
        }

        const  { name, bio, phone, email,password,isPublic} = body

        if (!validString(name)) return res.status(400).send({ status: false, message: "fname can not be empty" })
        if (name) {
            if (!isValidName.test(fname)) return res.status(400).send({ status: false, message: "Please Provide name in valid formate and Should Starts with Capital Letter" })
            data.name = name
        }

       

        if (!validString(email)) return res.status(400).send({ status: false, message: "Email can not be empty" })
        if (email) {
            if (!isvalidEmail.test(email)) return res.status(400).send({ status: false, message: "email should be in  valid Formate" })
            if (await userModel.find({ email })) return res.status(400).send({ status: false, message: `Unable to update email. ${email} is already registered.` })
            data.email = email
        }

        if (!validString(phone)) return res.status(400).send({ status: false, message: "phone can not be empty" })
        if (phone) {
            if (!isvalidMobile.test(phone)) return res.status(400).send({ status: false, message: "please provide Valid phone Number with 10 digits starts with 6||7||8||9" })
            if (await userModel.findOne({ phone })) return res.status(400).send({ status: false, message: `Unable to update phone. ${phone} is already registered.` })
            data.phone = phone
        }

        let data1={}

        if (!validString(password)) return res.status(400).send({ status: false, message: "password can not be empty" })
        if (password) {
            if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "please provide Valid password with 1st letter should be Capital letter and contains spcial character with Min length 8 and Max length 15" })
            data1.password = await bcrypt.hash(password, 10)
        }

        if (!validString(isPublic)) return res.status(400).send({ status: false, message: "isPublic can not be empty" })
        if (isPublic) {
            
            data.isPublic = isPublic
        }

        if (!validString(bio)) return res.status(400).send({ status: false, message: "bio can not be empty" })
        if (isPublic) {
            
            data.bio = bio
        }

    
        
        const newUser = await Profile.findByIdAndUpdate({userId:decodedToken}, data, { new: true })

        if(Object.keys(data1).length>0) await User.findByIdAndUpdate({userId:decodedToken}, data1, { new: true })


        return res.status(200).send({ status: true, message: "User updated successfully", data: newUser })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}


// Set profile as public or private
// router.put('/visibility', isAdmin, async (req, res) => {

async function visibility(req,res){
    try {
        const { userId, isPublic } = req.body;


        const decodedToken = req.decodedToken

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'userId is not valid' })

            if (!isValid(isPublic)) return res.status(400).send({ status: false, message: "isPublic is mandatory and should have non empty String" })

        await Profile.updateOne({ userId }, { $set: { isPublic } });
        res.json({ message: 'Profile visibility updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {visibility,updateUser,viewProfileAll,viewProfileOwn};
