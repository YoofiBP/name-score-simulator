import "./App.css";
import stringSimilarity from "string-similarity";
import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { CSVLink } from "react-csv";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button'

function App() {
  const [file, setFile] = useState(null);
  const [isProcessed, setProcessed] = useState(false);
  const [output, setOutput] = useState([]);

  const handleChange = (event) => {
    event.preventDefault();
    if(event.target.files[0]){
      const file = event.target.files[0]
      if(file.size/1024 > 400) {
        alert('File size must be below 400 kb');
        return;
      }
      setFile(file);
    }
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
    window.location.reload();
  };

  const fileDownload = (
    <CSVLink filename="name_score_output" data={output} onClick={resetState}>
      <Button>
      Download CSV
      </Button>
    </CSVLink>
  );

  useEffect(() => {
    file && handleUpload(file);
    console.log(file)
  }, [file]);

  return (
    <div className="App">
      <Container
        className={"h-100 align-items-center justify-content-center"}
      >
        <Row>
          <Col>
            <h1>Name Score Simulator</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form className="mb-3">
              <Form.File
                id="custom-file"
                label="Upload Excel file"
                onChange={handleChange}
                accept=".xls,.xlsx"
                custom
              />
            </Form>
          </Col>
        </Row>
        {isProcessed && output.length !== 0 && fileDownload}
      </Container>
    </div>
  );
}

export default App;
