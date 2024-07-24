const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const authenticateToken = require("./auth");
const { route } = require("./user");

router.post("/CreateTask", authenticateToken, async(req,res) => { 

 try{
    const {title, desc} = req.body;
    const {id} = req.headers;

    const newTask = new Task({
        title: title,
        desc: desc,
    })

    const saveTask = await newTask.save();
    const taskId = saveTask._id;
    await User.findByIdAndUpdate(id, {$push:  {tasks: taskId._id}});
    return res.status(200).json({
        message: "Task Created "
    })
 }
 catch(error){
    console.log(error);
    res.status(400).json({
        message: "Internal Server error"
    })
 }

})

router.get("/getAllTasks",authenticateToken, async (req,res) => {
      try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
            path: "tasks",
            options: { sort: {createdAt:-1}},
        });
        res.status(200).json({
            data: userData
        })
      }
      catch(error){
        console.log(error);
        res.status(400).json({
            message: "Internal Server error"
        })
      }
})


router.delete("/deleteTask/:id", authenticateToken, async (req,res) => {
    try{
      const {id} = req.params;
      const userId = req.headers.id;

      await Task.findByIdAndDelete(id);
      await User.findByIdAndUpdate( userId, { $pull: {tasks:id}})
       res.status(200).json({
        message: " Task deleted Successfully"
    })
    }
    catch(error){
      console.log(error);
      res.status(400).json({
          message: "Internal Server error"
      })
    }
})

router.put("/updateTask/:id", authenticateToken, async (req,res) => {
    try{
      const {id} = req.params;
      const {title, desc} = req.body;
      await Task.findByIdAndUpdate( id, { title:title, desc: desc})
      res.status(200).json({
        message: " Task updated Successfully"
    })
    }
    catch(error){
      console.log(error);
      res.status(400).json({
          message: "Internal Server error"
      })
    }
})

router.put("/updateImportantTask/:id", authenticateToken, async (req,res) => {
    try{
      const {id} = req.params;
      const TaskData =  await Task.findById( id)
      const ImpTask =TaskData.important;
      await Task.findByIdAndUpdate( id, { important: !ImpTask})
      return res.status(200).json({
        message: " Task updated Successfully"
    })
    }
    catch(error){
      console.log(error);
      res.status(400).json({
          message: "Internal Server error"
      })
    }
})


router.put("/completeTask/:id", authenticateToken, async (req,res) => {
    try{
      const {id} = req.params;
      const TaskData =  await Task.findById( id)
      const CompTask =TaskData.complete;
      await Task.findByIdAndUpdate( id, { complete: !CompTask})
      return res.status(200).json({
        message: " Task updated Successfully"
    })
    }
    catch(error){
      console.log(error);
      res.status(400).json({
          message: "Internal Server error"
      })
    }
})


router.get("/getCompleteTasks", authenticateToken, async (req,res) => {
    try{
      const {id} = req.headers;
      const Data = await User.findById(id).populate({
          path: "tasks",
          match: {complete:true},
          options: { sort: {createdAt:-1}},
      });

      const CompTaskData = Data.tasks;
      return res.status(200).json({
          data: CompTaskData
      })
    }
    catch(error){
      console.log(error);
      res.status(400).json({
          message: "Internal Server error"
      })
    }
})


router.get("/getImpTasks", authenticateToken, async (req,res) => {
  try{
    const {id} = req.headers;
    const Data = await User.findById(id).populate({
        path: "tasks",
        match: {important:true},
        options: { sort: {createdAt:-1}},
    });

    const ImpTaskData = Data.tasks;
    return res.status(200).json({
        data: ImpTaskData
    })
  }
  catch(error){
    console.log(error);
    res.status(400).json({
        message: "Internal Server error"
    })
  }
})


router.get("/getIncompleteTasks",authenticateToken, async (req,res) => {
    try{
      const {id} = req.headers;
      const Data = await User.findById(id).populate({
          path: "tasks",
          match: {complete:false},
          options: { sort: {createdAt:-1}},
      });

      const IncompTaskData = Data.tasks;
      return res.status(200).json({
          data:  IncompTaskData
      })
    }
    catch(error){
      console.log(error);
      res.status(400).json({
          message: "Internal Server error"
      })
    }
})




module.exports = router;