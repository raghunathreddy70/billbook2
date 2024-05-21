const BusinessSchema = require("../models/businessModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.userCreate = async (req, res) => {
  try {
    // Extract data from the request body
    const { profile, name, email, phone, role, adminId } = req.body;

    if (!adminId) {
      res.status(400).send({ error: "Error in fetching AdminId" });
    }

    const highestUser = await BusinessSchema.find()
      .sort({ userId: -1 })
      .collation({ locale: "en_US", numericOrdering: true });
    let nextUserId = highestUser ? parseInt(highestUser[0]?.userId) + 1 : 1;

    let userImage = profile;
    if (userImage) {
      const result = await cloudinary.uploader.upload(userImage, {
        folder: "billing",
      });

      userImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const userExist = await BusinessSchema.findOne({ adminId, phone });

    if (userExist) {
      return res
        .status(400)
        .send({ Error: "User with phone number already exist" });
    }

    const newUser = await BusinessSchema.create({
      userId: nextUserId,
      businessCount: 0,
      hasAdmin: true,
      status: "Active",
      userImage: userImage,
      name,
      email,
      phone,
      role,
      adminId,
      userCount: 1,
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Could not create user" });
  }
};



exports.fetchUser = async (req, res) => {
  const adminId = req.params.aid;
  try {
    const allUsers = await BusinessSchema.find({
      adminId,
      userId: { $ne: adminId },
    }).collation({ locale: "en_US", numericOrdering: true });

    res.status(200).json({ Users: allUsers });

    console.log("allUsers", allUsers);
  } catch (error) {}
};


exports.userUpdate = async (req, res) => {
  try {
    const userId  = req.params.id; 
    console.log("userIdxdvdvvd", userId)
    const editingData = req.body;

    console.log("editingData",editingData)


    const updatUserdata = await BusinessSchema.findByIdAndUpdate(userId, editingData,
      {
        new: true,
      }
    );
    console.log("updated userData", updatUserdata);

    if (!updatUserdata) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).json(updatUserdata);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Could not update user" });
  }
};

