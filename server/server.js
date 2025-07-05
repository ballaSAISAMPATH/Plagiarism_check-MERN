const express = require("express");
const cors=require("cors");
const app = express();
const port = 3000;
const axios=require("axios");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const API_KEY=process.env.REACT_APP_PLAG_API;
const URL="https://plagiarismcheck.org/api/v1"

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
app.post("/submit",async (req,res)=>{
    const text=req.body.text;
    console.log(text);
    try{
        let textID=0;
        let state=0;
        let response =await axios.post(`${URL}/text`,
            new URLSearchParams({language:"en",text}),
            {headers:{'X-API-TOKEN':API_KEY}});
        textID=response.data.data.text.id;

        for(let count=0;count<24;count++){
            await new Promise ((r)=>{
                setTimeout(r, 5000)})
                
                     state =await checkPlagiarismState(textID);
                
            if (state==4 || state==5){
                break;
            }
        }
    

        if (state==5){
            console.log("success at state 5");
            
            const result = await fetchData(textID);
            return res.json({result});
        }

        if (state==4){
            console.log("failure at state 4");
            
           return res.json({error:"error occured"});
        }
        console.log("failure at state else");
        
        return res.status(400).json({ error: "Timed out while checking plagiarism." });

       
    }
    catch(err){
        res.status(500).json({err:"error oocured"})
    }
}
)
async function checkPlagiarismState(textID) {
  const response = await axios.get(`${URL}/text/${textID}`, {
    headers: { "X-API-TOKEN": API_KEY },
  });
  return response.data.data.state;
}

async function fetchData(textID) {
  const response = await axios.get(`${URL}/text/report/${textID}`, {
    headers: { "X-API-TOKEN": API_KEY },
  });
  return response.data;
}

