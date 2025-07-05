import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'
export default function () {
  const [text,SetText]=useState("");
  const [fileName,setFileName]=useState("");
  const [fileType,setFileType]=useState("");
  const [percentage,setPercentage]=useState(0);
  const [fileSize,setFileSize]=useState(0);
   function formSubmitted(event){
    event.preventDefault();
    const file=(event.target.files[0]);
    const reader=new FileReader();
    reader.readAsText(file);
    reader.onload= async (ev)=>{
      SetText(ev.target.result);
      if((ev.target.result.toString()).length>=80){
        console.log(ev.target.result);
        try{

          const response = await axios.post("http://localhost:3000/submit",{text:ev.target.result});
          console.log(response.data.result.data.report.percent);
          setPercentage(response.data.result.data.report.percent);
        }
        catch(err){
          alert("issue in generating response");
        }
      }
      else{
        alert("File size is too small");
      }
    }
    SetText("please wait.....");
    setFileName(file.name);
    setFileType(file.type);
    setFileSize(file.size);
    
  }
  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <h3>PLAGAIRISM CHECK</h3>
      <form  action="">
        <div className="form-floating">
          <input onChange={(event)=>{formSubmitted(event)}} type="file" className="form-control" id="file" placeholder='file' required/>
          <label htmlFor="file">upload file here</label>
        </div>
      </form>
      <div className="d-flex flex-column">
         <div>
          name : {fileName}
          </div>
          <div>
            type : {fileType}
          </div>
          <div>
            size : {fileSize}
          </div>
        <textarea name="" id="" value={text} readOnly style={{width:"300px",height:"300px",overflowY:"scroll"}}></textarea>
      </div>

      percentage : {percentage}%
    </div>
  )
}
