const axios = require("axios");

async function post(url, body) {
    try {
        const response = await axios.post(url, body);
        console.log(response.data);
    } catch (err) {
        console.error("Request failed:", err.message);
    }
}


async function get(url){
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (err) {
        console.error("Request failed:", err.message);
    }
}




// create a post 

post("http://localhost:3000/api/post",{content:"new post!"});

// query all posts

get("http://localhost:3003/api/posts");

// create a comment for a post

post("http://localhost:3001/api/post/f4a3382b:/comment",{content:"new comment!"});