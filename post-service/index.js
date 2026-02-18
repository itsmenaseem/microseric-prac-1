const express = require('express');
const {randomBytes}  = require("crypto");
const axios = require('axios');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const posts = {};
app.post("/api/post",async (req,res)=>{
    const {content} = req.body;
    const postId = randomBytes(4).toString("hex");
    posts[postId] = content;
    // send to event-bus
    try {
        await axios.post("http://localhost:3010/api/events",{
            type:"postCreated",
            payload:{
                postId,content
            }
        })
    } catch (error) {
        console.log(error);
        
    }
    console.log("Event sent to event-bus");
    
    res.status(201).json({message:"Cretaed!!"});
})


app.listen(3000,()=>{
    console.log("Server is listening on port : ",3000);
    
})
