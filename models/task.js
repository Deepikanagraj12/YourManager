const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title:{
       type: String,
    },
    desc:{
        type: String,
    },
    important:{
        type:Boolean,
        default:false,
    },
    complete:{
        type:Boolean,
        default:false,
    },

},{timestamps:true})
module.exports = mongoose.model("task", taskSchema);