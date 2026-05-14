import express from "express";
import * as db from "./data/db.js";
import { savePosts } from "./data/db.js";

const PORT = 3080;
const app = express();

app.use(express.json());

app.get("/posts",(req,res) =>{
    const posts = db.getAllPosts();
    res.status(200).json(posts);
})

app.get("/posts/:id",(req,res) =>{
    const posts = db.getPostById(req.params.id);
    if(!post){
        res.status(404).json({error: "Poszt nem található"})
    }

    res.status(200).json(posts);
})
app.post("/posts",(req,res) =>{
    const posts = (title,content)
    if(!title || !content){
        return res.status(404).json({error: "Poszt nem található"})
    }
    res.status(204).json(savePosts(posts));
})

app.listen(PORT, () => {console.log(`fut: ${PORT}`)})
