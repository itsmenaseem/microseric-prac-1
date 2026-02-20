const express = require('express');
const axios = require("axios")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const events = [];

async function sendEvent(url,event) {
    try {
        await axios.post(url,event);
    } catch (error) {
        console.log(error.message);
        console.log(`failed to sent event at location ${url} and event  : ${JSON.stringify(event)}`);
    }
}

app.get("/test",(req,res)=>{
    res.send("Hello World");
})

app.post("/api/events",async (req,res)=>{
    const event = req.body;
    events.push(event);
    await sendEvent("http://localhost:3003/api/events",event);
    await sendEvent("http://localhost:3001/api/events",event)
    res.send("OK");
})

app.get("/api/events",(req,res)=>{
    res.send(events);
})
app.listen(3010,(req,res)=>{
    console.log("Event Bus is running on port 3010");
})