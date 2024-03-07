const Comm = require('../models/commModel')
const Users = require('../models/userModel')
const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '7d'})
}

const getComm = async (req, res) => {
    const comm = await Comm.find({}).sort({createdAt: -1})
    res.status(200).json(comm)
}

const getOneComm = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "لا يوجد مؤسسة"})
    }

    const comm = await Comm.findById(id)

    if(!comm){
        return res.status(404).json({error: "المؤسسة غير موجودة"})
    }

    res.status(200).json(comm)
}


const createComm = async (req, res) => {
    try {
      const { comm_name, comm_email, comm_password, comm_file , comm_dob} = req.body
  
      // Validate required fields
      if (!comm_name || !comm_email || !comm_password || !comm_file || !comm_dob) {
        return res.status(400).json({ error: "يجب ملأ جميع الخانات من فضلك" });
      }
  
      // Validate email format
      if (!validator.isEmail(comm_email)) {
        return res.status(400).json({ error: "البريد الالكتروني ليس بالشكل الصحيح" });
      }
  
      // Check for existing comm
      const exists = await Comm.findOne({ comm_email });
      if (exists) {
        return res.status(400).json({ error: "البريد الالكتروني مؤسسة" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(comm_password, salt);
  
      // Create comm
      const comm = await Comm.create({
        comm_name, comm_email, comm_password: hash, comm_file , comm_dob
      });
  
      // Generate token
      const token = createToken(comm._id);
  
      // Send success response
      res.status(201).json({ comm, token }); // Use 201 for successful creation
    } catch (error) {
      // Handle potential errors
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "حدث خطأ أثناء إنشاء المؤسسة" }); // Generic error message
    }}
    
const logComm = async (req, res) => {
    const {comm_email, comm_password} = req.body

    const comm = await Comm.findOne({ comm_email, approved: true });

    if(!comm){
        res.status(400).json({error: "البريد الالكتروني خاطئ"})
    }else{
        const token = createToken(comm._id)
        const match = await bcrypt.compare(comm_password, comm.comm_password)
        if(!match){
            res.status(404).json({error: "كلمة المرور الخاظئة"})
        }else{
            if(comm.approved == false){
                res.status(400).json({error: "انتظر حتي يتم قبولك و جرب مرة أخري"})
            }else{
                res.status(200).json({comm, token})
            }
    }
    }




}

const deleteComm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "لا يوجد مؤسسة" });
  }

  let comm;
  try {
      // Find the community by ID
      comm = await Comm.findById(id);
  } catch (error) {
      console.error("Error finding community:", error);
      return res.status(500).json({ error: "خطأ في الخادم" });
  }

  if (!comm) {
      return res.status(404).json({ error: "المؤسسة غير موجود" });
  }

  // Get the IDs of users in pendingUsers and approvedUsers arrays
  const userIdsToDelete = [...comm.pendingMembers, ...comm.approvedMembers];

  // Delete users
  for (const userId of userIdsToDelete) {
      try {
          await Users.findByIdAndDelete(userId);
      } catch (error) {
          console.error("Error deleting user:", error);
          // Handle error as per your requirement
      }
  }

  try {
      // Delete the community
      await Comm.findByIdAndDelete(id);
      res.status(200).json(comm);
  } catch (error) {
      console.error("Error deleting community:", error);
      res.status(500).json({ error: "خطأ في الخادم" });
  }
};



const approveComm = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "لا يوجد مؤسسة"})
    }

    const comm = await Comm.findOneAndUpdate({_id: id}, {approved: true})

    if(!comm){
        return res.status(404).json({error: "المؤسسة غير موجود"})
    }
    res.status(200).json(comm)
}

const getFalseComm = async (req, res) => {
        const unapprovedComms = await Comm.find({ approved: false });
        res.status(200).json(unapprovedComms)
  }

const getTrueComm = async (req, res) => {
        const unapprovedComms = await Comm.find({ approved: true });
        res.status(200).json(unapprovedComms)
  }

const approveMember = async (req, res) => {
    try {
      const comm_id = req.params.id;
      const { user_id } = req.body;
  
      const comm = await Comm.findById(comm_id);
      const user = await Users.findOneAndUpdate({_id: user_id}, {approved: true})
      
      
      if (!comm) {
        return res.status(404).json({ error: 'المؤسسة غير موجودة' });
      }
  
      // Check if user is in pending members
      const index = comm.pendingMembers.indexOf(user_id);
      if (index === -1) {
        return res.status(400).json({ error: 'المسخدم غير طالب للانضمام' });
      }
  
      // Remove user from pending members and add to approved members
      comm.pendingMembers.splice(index, 1);
      comm.approvedMembers.push(user_id);

      await comm.save();
      await user.save();
  
      res.json({ message: 'تم قبول العضو' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'حدثت مشكلة اثناء قبول العضو' });
    }
  }

  const removeMember = async (req, res) => {
    try {
      const comm_id = req.params.id;
      const { user_id } = req.body;

      
  
      const comm = await Comm.findById(comm_id);
      if (!comm) {
        return res.status(404).json({ error: 'المؤسسة غير موجودة' });
      }
  
      // Check if user is in pending members
      const index = comm.approvedMembers.indexOf(user_id);
      const user = await Users.findOneAndDelete({_id: user_id})
      if (index === -1) {
        return res.status(400).json({ error: 'المسخدم غير منضم أو موجود ' });
      }
  
      // Remove user from pending members and add to approved members
      comm.approvedMembers.splice(index, 1);
      await comm.save();
  
      res.json({ message: 'تم رفد العضو' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'حدثت مشكلة اثناء قبول العضو' });
    }
  }
  

module.exports = {createComm,logComm,getOneComm,approveComm,getComm,deleteComm,getFalseComm,getTrueComm,approveMember,removeMember}