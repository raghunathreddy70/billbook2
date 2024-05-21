const Business = require("../models/businessModel");
const jwt = require('jsonwebtoken');

exports.registerVerification = async (req, res) => {
    try {
        const { token , currentBusiness } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (Date.now() >= decodedToken.exp * 1000) {
            return res.status(401).json({ success: false, message: "Token expired, please log out" });
        }


        console.log("currentBusiness", JSON.parse(currentBusiness))
        const AllBusiness = await Business.find({phone : decodedToken.data.phone})
        console.log("AllBusiness",AllBusiness)
        
        businessValues = AllBusiness.map(item => ({ [item._id]: item.businessName|| "" }));



        console.log("businessValues",businessValues)


        // return;

        const user = await Business.findById(JSON.parse(currentBusiness));

        console.log("user full 001",user)
        let userDetails = {...user._doc} 
        if(user.userId !== user.adminId){
        //handling case where user isn't the admin
        // const admin = await Business.findOne({userId : user.adminId});

        // console.log("admin",admin)

        
        // userDetails = {...user._doc, _id: admin._id}
        }

        console.log("user",userDetails)
    

        if (user) {
            const updatedToken = jwt.sign({ data: userDetails, currentBusiness: currentBusiness, AllBusiness:businessValues }, process.env.JWT_SECRET, { expiresIn: '24h' });

            return res.status(200).json({ success: true, message: "JWT token regenerated successfully", token: updatedToken });
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("Error in registerVerification:", error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: "Token expired, please log out" });
        }
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
