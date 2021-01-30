import "./App.css";
import stringSimilarity from "string-similarity";
import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { CSVLink } from "react-csv";
import Form from "react-bootstrap/Form";

function App() {
  const [file, setFile] = useState(null);
  const [isProcessed, setProcessed] = useState(false);
  const [output, setOutput] = useState([]);

  const handleChange = (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
  };

  const handleUpload = async (file) => {
    let values = [["", "Application Name", "Momo Name", "Name Score"]];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet("Sheet1");
    worksheet.eachRow((row, rowNumber) => {
      values.push(row.values);
      values[values.length - 1].push(
        Math.round(
          stringSimilarity.compareTwoStrings(row.values[1], row.values[2]) * 100
        )
      );
    });
    setProcessed(true);
    setOutput(values);
  };

  const resetState = () => {
    setProcessed(false);
    setOutput([]);
    setFile(null);
  };

  const fileDownload = (
    <CSVLink data={output} onClick={resetState}>
      Download me
    </CSVLink>
  );

  useEffect(() => {
    file && handleUpload(file);
  }, [file]);

  return (
    <div className="App">
      <input type="file" onChange={handleChange}></input>
      <Form>
        <Form.File id="custom-file" label="Custom file input" onChange={handleChange} custom />
      </Form>
      {isProcessed && output.length !== 0 && fileDownload}
    </div>
  );
}

export default App;
