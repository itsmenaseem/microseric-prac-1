const express = require('express');
const app = express();
const cors = require("cors");
const axios = require("axios");
const {randomBytes} = require("crypto")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const comments = {}; // {postId : [{id,content}]}
app.post("/api/events",(req,res)=>{
    const {type,payload} = req.body;
    if(type === "postCreated"){
        const {postId} = payload;
        comments[postId] = [];
        console.log(comments);
        
    }
    res.send("OK");
})

app.post("/api/post/:id/comment",async (req,res)=>{
    const {id:postId} = req.params;
    const post = comments[postId];
    if(!post){
        return res.status(404).json({message:"Post not found"});
    }
    const {content} = req.body;
    const commentId = randomBytes(4).toString("hex");
    post.push({id:commentId,content});
    // send event to event bus
    try {
        await axios.post("http://localhost:3010/api/events",{
            type:"commentCreated",
            payload:{   id:commentId,
                        content,
                        postId
                    }
        })      
    } catch (error) {
        console.log(error);
    }
    res.status(201).json({message:"Comment created successfully",comment:{id:commentId,content}});
})

app.listen(3001, async () => {
    console.log("Comment Service is running on port 3001");
    try {
        const response = await axios.get("http://localhost:3010/api/events");
        const events = response.data;
        for(let event of events){
            const {type,payload} = event;
            if(type === "postCreated"){
                const {postId} = payload;
                comments[postId] = [];
                console.log(comments);  
            }
        }
    } catch (error) {
        console.log("Error fetching events:", error);
    }
})