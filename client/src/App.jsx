import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'
import "./App.css"

export default function App() {
  const [text, setText] = useState("upload file to display..");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  useEffect(() => {
    const container = document.getElementById("container");
    if (!container) return;

    container.classList.remove("green", "red", "orange");

    if (percentage < 10) {
      container.classList.add("green");
    } else if (percentage > 20) {
      container.classList.add("red");
    } else {
      container.classList.add("orange");
    }
  }, [percentage]);

  function formSubmitted(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async (ev) => {
      setText("please wait.....");
      setFileName(file.name);
      setFileType(file.type);
      setFileSize(file.size);

      const fileText = ev.target.result;
      setText(fileText);

      if (fileText.length >= 80) {
        try {
          const response = await axios.post("http://localhost:3000/submit", { text: fileText });
          const percent = response.data.result.data.report.percent;
          setPercentage(percent);
        } catch (err) {
          alert("Issue in generating response");
        }
      } else {
        alert("File size is too small");
      }
    };
  }

  return (
    <div id='container' className='containerclass d-flex justify-content-center align-items-center flex-column'>
      <h3 className='mb-5'>PLAGIARISM CHECK</h3>
      <form>
        <div className="form-floating">
          <input
            onChange={formSubmitted}
            type="file"
            className="form-control"
            id="file"
            placeholder='file'
            required
          />
          <label htmlFor="file">Upload file here</label>
        </div>
      </form>

      <div className="d-flex flex-column mt-3">
        <div>name : {fileName}</div>
        <div>type : {fileType}</div>
        <div>size : {fileSize}</div>
        <textarea value={text} readOnly style={{ width: "300px", height: "300px", overflowY: "scroll" }} />
      </div>

      <div className='d-flex mt-3'>
        Plagiarism percentage:&nbsp;
        {percentage < 10 ? (
          <div className='text-success percentage'>{percentage}%</div>
        ) : percentage < 20 ? (
          <div className='text-warning percentage'>{percentage}%</div>
        ) : (
          <div className='text-danger percentage'>{percentage}%</div>
        )}
      </div>
    </div>
  );
}
