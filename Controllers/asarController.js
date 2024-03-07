const mongoose = require('mongoose')
const Asar = require('../models/asarModel')

const getAsar = async (req, res) => {
    const asar = await Asar.find({}).sort({ createdAt: -1 })
    res.status(200).json(asar)
}

const getOneAsar = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد قياس أثر" })
    }

    const asar = await Asar.findById(id)

    if (!asar) {
        return res.status(404).json({ error: "قياس الأثر غير موجودة" })
    }

    res.status(200).json(asar)
}


const createAsar = async (req, res) => {
    try {
        const { project_info, project_goals, project_tahlils, m3neen, project_natiga, mod5alat } = req.body

        let kema_mogtama3ya = 0;

        for (let i = 0; i < project_natiga.length; i++) {
            kema_mogtama3ya += project_natiga[i].total_years;
        }
        let mod5alatNumber = parseInt(mod5alat)
        
        let safy_kema_mogtama3ya = Math.round(kema_mogtama3ya - mod5alatNumber)
        let aed = Math.round(safy_kema_mogtama3ya / mod5alatNumber)

        // Validate required fields
        if (!project_info || !project_goals || !project_tahlils || !m3neen || !project_natiga || !mod5alatNumber || !kema_mogtama3ya || !safy_kema_mogtama3ya || !aed) {
            return res.status(400).json({ error: "يجب ملأ جميع الخانات من فضلك" });
        }

        // Create comm
        const asar = await Asar.create({
            project_info, project_goals, project_tahlils, m3neen, project_natiga, mod5alat: mod5alatNumber, kema_mogtama3ya, safy_kema_mogtama3ya, aed
        });

        // Send success response
        res.status(200).json(asar);
    } catch (error) {
        // Handle potential errors
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "حدث خطأ أثناء إنشاء قياس الأثر" }); // Generic error message
    }
}

const deleteAsar = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد قياس أثر" });
    }

    let asar;
    try {
        asar = await Asar.findById(id);
    } catch (error) {
        console.error("Error finding Asar:", error);
        return res.status(500).json({ error: "خطأ في الخادم" });
    }

    if (!comm) {
        return res.status(404).json({ error: "قياس الأثر غير موجود" });
    }

    // Get the IDs of users in pendingUsers and approvedUsers arrays
    //const userIdsToDelete = [...comm.pendingMembers, ...comm.approvedMembers];

    // Delete users
    //for (const userId of userIdsToDelete) {
    //    try {
    //        await Users.findByIdAndDelete(userId);
    //    } catch (error) {
    //         console.error("Error deleting user:", error);
    //        // Handle error as per your requirement
    //    }
    //}


    try {
        await Asar.findByIdAndDelete(id);
        res.status(200).json(asar);
    } catch (error) {
        console.error("Error deleting Asar:", error);
        res.status(500).json({ error: "خطأ في الخادم" });
    }
};

const updateAsar = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد قياس أثر" })
    }

    const asar = await Asar.findOneAndUpdate({ _id: id }, { ...req.body })

    if (!asar) {
        return res.status(404).json({ error: "قياس الاُثر غير موجود" })
    }

    res.status(200).json(asar)
}

module.exports = { getAsar, getOneAsar, createAsar, updateAsar, deleteAsar }