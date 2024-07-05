function generatePdf() {
    const table = document.querySelector('table');
    const rows = table.rows;
    const pdf = new jsPDF();
  
    // Add a title and header
    pdf.text('Users Report', 10, 10);
    pdf.text('Generated on ' + new Date().toLocaleDateString(), 10, 20);
  
    // Add the table data to the PDF
    pdf.autoTable({
      head: [['UserID', 'First Name', 'Last Name', 'Email', 'Registration Date']],
      body: Array.prototype.slice.call(rows).map((row) => {
        return [
          row.cells[0].textContent,
          row.cells[1].textContent,
          row.cells[2].textContent,
          row.cells[3].textContent,
          row.cells[4].textContent,
        ];
      }),
    });
  
    // Save the PDF
    const pdfBlob = pdf.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = pdfURL;
    a.download = 'users_report.pdf';
    a.click();
  }