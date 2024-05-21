import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';

const useHandleDownload = () => {

    const downloadExcel = ({ data, filename, dashboardName }) => {
        const allDataWorkbook = XLSX.utils.book_new();
        const allDataWorksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(allDataWorkbook, allDataWorksheet, `${dashboardName}`);
        XLSX.writeFile(allDataWorkbook, `${filename}.xlsx`);
    }

    const handleCSVDownload = ({ csvData, headers, }) => {
        // Prompt the user for a custom filename
        const customFilename = window.prompt('Enter a custom filename (without extension):');

        if (!customFilename) {
            // If the user cancels or enters an empty string, do nothing
            return;
        }

        // Generate CSV content
        const csvContent = {
            data: csvData,
            headers: headers,
            filename: `${customFilename}.csv`, // Use the custom filename
        };
        console.log(csvData, "hy")
        // Trigger download
        const csvLink = document.createElement('a');
        csvLink.href = encodeURI(`data:text/csv;charset=utf-8,${Papa.unparse(csvData, { header: true })}`);
        csvLink.target = '_blank';
        csvLink.download = `${customFilename}.csv`; // Use the custom filename
        csvLink.click();
    };
    // download data in csv format code goes here 



    // download data in pdf format code goes here 

    const handlePDFDownload = ({ columns, rows, heading }) => {
        // Prompt the user for a custom filename
        const customFilename = window.prompt('Enter a custom filename (without extension):');

        if (!customFilename) {
            // If the user cancels or enters an empty string, do nothing
            return;
        }

        const pdf = new jsPDF();
        // pdf.text(`Invoice's Data`, 10, 10);
        pdf.text(heading, 10, 10);

        // Set up table options
        const tableOptions = {
            startY: 20,
        };

        // Add the table to the PDF
        pdf.autoTable({
            head: [columns],
            body: rows,
            startY: 20,
        });

        // Trigger PDF download with the custom filename
        pdf.save(`${customFilename}.pdf`);
    };

    return { downloadExcel, handlePDFDownload, handleCSVDownload }
}

export default useHandleDownload