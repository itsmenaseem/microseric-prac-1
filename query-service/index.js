const express = require("express");
const axios  = require("axios");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())
const posts = {}; // {postId : {id,title,comments:[]}}


function handleEvent(type,payload) {
    console.log(type);
    if(type =="postCreated"){
        const {postId,content} = payload;
        posts[postId] = {id: postId,content,comments:[]};
    }
    else if(type == "commentCreated"){ 
        const {id,content,postId} = payload;
        const post = posts[postId];
        if(post){
            post.comments.push({id,content});
        }
    }
}

app.post("/api/events",(req,res)=>{
    const {type,payload} = req.body;
    handleEvent(type,payload);
    res.send({});   
})

app.get("/api/posts",(req,res)=>{
    res.send(posts);
} )   

app.listen(3003,async ()=>{
    console.log("Server is listening on port : 3003");
    // get all events
    try {
        const response = await axios.get("http://localhost:3010/api/events");
        const events = response.data;
        for(let event of events){
            handleEvent(event.type,event.payload);
        }   
    } catch (error) {
        console.log("Error fetching events:", error);
    }
    
})
