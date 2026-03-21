import Notice from "../models/notification.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try{
        const { title, team, stage, data, priority, assets } = req.body;
        const task = await Task.create({
            title, team, stage: stage.toLowerCase(), date, priority: priority.toLowerCase(), assets,
        });
        let text = " New task has been assigned to you ";
         if(task.team.length > 1){
            text = text + ` and ${task.team.length-1} others`;

         }
         text = 
            text + 
            `The task priority is set a ${
                task.priority
            } priority, so check and act accordingely. The task is ${task.date.toDateString()}
            Thank you !!!`;

        await  Notice.create({
            team, text, task: task._id,
        });
        
        res
            .status(200)
            .json({ status: true, message: "Task created successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const duplicateTask = async (req, res) => {
    try {
        const {id} = req.params;

        const task = await Task.findById(id);
        const newTask = await Task.create({
            ...task, 
            title: task.title + " - Duplicate",
        });

        newTask.team = task.team;
        newTask.subTasks = task.subTasks;
        newTask.assets = task.assets;
        newTask.priority = task.priority;
        newTask.stage = task.stage;

        await newTask.save();

        let text = "New task has been assigned to you";
        if(task.team.length > 1) {
            text = text + `and ${task.team.length - 1} others.`;
        }

        text = 
            text + 
            ` The task priority is set a ${
                task.priority
            } priority, so check and act accordingely. The task date is ${task.date.toDateString()}.
            Thank you !!!`;
        await Notice.create({
            team: task.team,
            text,
            task: newTask._id,
        });
        res
            .status(200)
            .json({ status: true, message: "Task duplicated successfully."});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const postTaskActivity = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.user;
        const {type, activity} = req.body;

        const task = await Task.findById(id);

        const data = {
            type,
            activity,
            by: userId,
        };
        task.activities.push(data);
        await task.save();

        res
            .status(200)
            .json({ status: true, message: "Activity posted successfully."});
    } catch (error) {
        console.log(error);
        return res.status(400).json ({ message: error.message, status: false });
    }
};