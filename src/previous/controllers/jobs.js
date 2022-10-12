import { v4 as uuidv4 } from "uuid";

let jobs = [];

export const getJobs = (req, res) => {
    console.log(`jobs in the database: ${jobs}`);

    res.send(jobs);
}

export const createJob = (req, res) => {   
    const job = req.body;

//   const id = ;
    jobs.push({...job, id: uuidv4()});
    
    console.log(`Job [${job}] added to the database.`);
};

export const getJob = (req, res) => {
    res.send(req.params.id)
};

export const deleteJob = (req, res) => { 
    console.log(`Job with id ${req.params.id} has been deleted`);
    
    jobs = jobs.filter((job) => job.id !== req.params.id);
};

export const updateJob =  (req,res) => {
    const job = jobs.find((job) => job.id === req.params.id);
    
    job.username = req.body.username;
    job.age = req.body.age;

    console.log(`username has been updated to ${req.body.username}.age has been updated to ${req.body.age}`)
};