//const express = require("express");
//const router = express.Router();
//const User = require("../models/UserModel");

//const BusinessSchema = require("../models/businessModel");
//const roleAccess = require("../utils/registrationRoleAccess");
// const Test = require("../models/test");
// const userId=req.body
// const admimId=req.body
// if(adminId===userId){



// const express = require("express");
// const router = express.Router();
// const Business = require("../models/businessModel");

// router.post("/updateRole", async (req, res) => {
//   const { userId, adminId, role } = req.body;

//   try {
//     let business
//     if (adminId === userId) {
  
//       const business = await Business.findOne({ userId });
      
//       // const business = await Business.findByIdAndUpdate(
//       //   { _id: userId },
//       //   { $push: { role: role } },
      
//       // );
//       // if (role[0]) {
//       //   business.role[0] = role[0];
//       // }
//       // if (role[1]) {
//       //   business.role[1] = role[1];
//       // }
//       // if (role[2]) {
//       //   business.role[2] = roles[2];
//       // }

//       if (!business) {
//         return res.status(404).json({ message: "Business not found" });
//       }

//       business.role[0].push(role[0]);


    
//       await business.save();

//       return res.status(200).json({ message: "Role" });
//     } else {
//       return res.status(403).json({ message: "Unauthorized" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error" });
//   }
// });

// module.exports = router;
// ///

//role for admin is "" {empty string for each user there role is the key of role access} [Role Access will contain all the roles and there particular permissions]
const express = require("express");
const router = express.Router();
const Business = require("../models/businessModel");
const roleAccess = require("../utils/registrationRoleAccess");

router.post("/updateRole", async (req, res) => {
  const { userId, adminId, newRole } = req.body;

  try {
  
    if (adminId === userId) {
      
      const business = await Business.findOne({ userId });

      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      
      if (newRole === "") {
        
        business.role = "";
      } else {
        
        const permissions = roleAccess[role]; 
        business.role = { [newRole]: permissions }; 
      }

      
      await business.save();

      return res.status(200).json({ message: "Role updated successfully" });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: " Error" });
  }
});

module.exports = router;
