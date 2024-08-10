import { getDocument } from 'pdfjs-dist/build/pdf';
import Papa from 'papaparse';

async function TranscriptReader(file, callback) {
  const pdfData = await readPDF(file);
  const text = await extractTextFromPDF(pdfData);
  
  // Assuming the transcript is in CSV format within the PDF text
  Papa.parse(text, {
    header: true, // Use header if the CSV has headers
    complete: (results) => {
      const data = results.data;

      // Check if parsing was successful
      if (data.length === 0) {
        console.error('No data found in transcript.');
        callback([]);
        return;
      }

      // Process the data here (e.g., extract courses, grades, credits)
      const processedData = processTranscriptData(data);
      callback(processedData);
    },
    error: (error) => {
      console.error('Error parsing CSV:', error);
      callback([]);
    }
  });
}

function readPDF(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (event) => {
      try {
        const pdfData = new Uint8Array(event.target.result);
        resolve(pdfData);
      } catch (error) {
        reject('Error reading PDF file');
      }
    };
    
    fileReader.onerror = () => {
      reject('Error reading file');
    };

    fileReader.readAsArrayBuffer(file);
  });
}

async function extractTextFromPDF(pdfData) {
  const pdf = await getDocument(pdfData).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }

  return text;
}

function processTranscriptData(data) {
  return data.map(row => ({
    name: row['Course Name'], // Adjust based on your CSV header
    grade: row['Grade'],      // Adjust based on your CSV header
    credits: parseFloat(row['Credits']) || 0 // Adjust based on your CSV header
  })).filter(course => course.name && course.grade); // Filter out invalid entries
}

export default TranscriptReader;