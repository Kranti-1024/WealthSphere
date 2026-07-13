const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

// GET /api/credit/score
// Returns mock CIBIL data for the dashboard
router.get('/score', (req, res) => {
  try {
    const creditData = {
      score: 785,
      status: 'Excellent',
      factors: {
        paymentHistory: '100%',
        creditUtilization: '12%',
        creditAge: '4 Years, 2 Months',
        totalAccounts: 7,
        hardInquiries: 1
      },
      lastUpdated: new Date().toISOString()
    };
    res.json(creditData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credit score' });
  }
});

// GET /api/credit/report/download
// Generates and streams a PDF CIBIL report inline
router.get('/report/download', (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="IDBI_CIBIL_Report.pdf"');

    doc.pipe(res);

    // --- Helper for Advanced Speedometer ---
    function drawSpeedometer(score, xOffset, yOffset) {
      const percentage = Math.max(0, Math.min(1, (score - 300) / 600));
      const cx = 132, cy = 132, r = 110; 
      
      doc.save();
      doc.translate(xOffset, yOffset);
      
      // Helper to draw arc segments
      function drawArc(startP, endP, color, width) {
          const startAngle = Math.PI * (1 - startP);
          const endAngle = Math.PI * (1 - endP);
          const startX = cx + r * Math.cos(startAngle);
          const startY = cy - r * Math.sin(startAngle);
          const endX = cx + r * Math.cos(endAngle);
          const endY = cy - r * Math.sin(endAngle);
          doc.path(`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`)
             .lineWidth(width)
             .strokeColor(color)
             .lineCap('butt')
             .stroke();
      }

      // Draw color bands (Poor -> Average -> Good -> Excellent)
      drawArc(0, 0.416, '#EF5350', 20);      // 300 - 550 (Red)
      drawArc(0.416, 0.583, '#FFA000', 20);  // 550 - 650 (Orange)
      drawArc(0.583, 0.75, '#FFB300', 20);   // 650 - 750 (Yellow)
      drawArc(0.75, 1.0, '#4CAF50', 20);     // 750 - 900 (Green)
      
      // Draw Marker (Dot on the arc)
      const angle = Math.PI * (1 - percentage);
      const markerX = cx + r * Math.cos(angle);
      const markerY = cy - r * Math.sin(angle);
      doc.circle(markerX, markerY, 8)
         .lineWidth(4)
         .fillAndStroke('#ffffff', '#0A2540');
         
      // Main Score Text
      let scoreColor = '#EF5350';
      if (score >= 750) scoreColor = '#4CAF50';
      else if (score >= 650) scoreColor = '#FFA000';
      
      doc.fontSize(48).font('Helvetica-Bold').fillColor(scoreColor).text(score.toString(), 0, 70, { width: 264, align: 'center' });
      
      const status = score >= 750 ? 'Excellent' : score >= 650 ? 'Fair' : 'Poor';
      doc.fontSize(16).fillColor('#6B7280').text(status.toUpperCase(), 0, 125, { width: 264, align: 'center' });
      
      // Min/Max Labels
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#9CA3AF').text('300', 10, 140);
      doc.text('900', 225, 140);
      
      doc.restore();
      
      // CRITICAL: Restore doc.x and doc.y correctly since doc.text mutates them globally
      doc.x = 50;
      doc.y = yOffset + 180;
    }

    // --- PDF Content ---
    
    // Header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#0A2540').text('IDBI WealthSphere', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').fillColor('#6B7280').text('Comprehensive Credit Information Report', { align: 'center' });
    doc.moveDown(2);

    const userName = req.user?.name || 'Rajesh Kumar';
    const dateGenerated = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#000').text('Consumer Details');
    doc.font('Helvetica').text(`Name: ${userName}`);
    doc.text(`Date of Report: ${dateGenerated}`);
    doc.text(`Report Control Number: CIBIL-${Math.floor(Math.random() * 100000000)}`);
    doc.moveDown(2);

    // Score Section
    doc.fontSize(14).font('Helvetica-Bold').text('1. CIBIL Score');
    
    // Draw Advanced Speedometer SVG inside PDF
    // Passing the current absolute doc.y to the helper
    drawSpeedometer(785, 170, doc.y + 10);

    // Factors
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('2. Key Factors Affecting Your Score');
    doc.moveDown(0.5);
    
    const factors = [
      { name: 'Payment History (High Impact)', value: '100% On Time', status: 'Excellent' },
      { name: 'Credit Utilization (High Impact)', value: '12%', status: 'Excellent' },
      { name: 'Age of Credit (Medium Impact)', value: '4 Yrs, 2 Mos', status: 'Good' },
      { name: 'Total Accounts (Low Impact)', value: '7 Accounts', status: 'Good' }
    ];

    doc.font('Helvetica').fontSize(12);
    factors.forEach(f => {
      doc.text(`${f.name}: `, { continued: true }).font('Helvetica-Bold').text(`${f.value} (${f.status})`);
      doc.font('Helvetica');
      doc.moveDown(0.3);
    });
    doc.moveDown(1.5);

    // Account Details
    doc.fontSize(14).font('Helvetica-Bold').text('3. Account Summary');
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(12);
    
    let tableY = doc.y;
    doc.text('Bank / Institution', 50, tableY);
    doc.text('Account Type', 220, tableY);
    doc.text('Balance', 360, tableY);
    doc.text('Status', 480, tableY);
    
    doc.moveTo(50, tableY + 15).lineTo(550, tableY + 15).strokeColor('#e5e7eb').lineWidth(1).stroke();
    
    // Use 'Rs.' instead of '₹' because standard Helvetica font doesn't support the Rupee symbol
    const accounts = [
      { bank: 'HDFC Bank', type: 'Credit Card', bal: 'Rs. 45,000', status: 'Active' },
      { bank: 'State Bank of India', type: 'Home Loan', bal: 'Rs. 24,50,000', status: 'Active' },
      { bank: 'IDBI Bank', type: 'Auto Loan', bal: 'Rs. 0', status: 'Closed' }
    ];

    tableY += 25;
    doc.font('Helvetica');
    accounts.forEach(acc => {
      doc.fillColor('#000').text(acc.bank, 50, tableY);
      doc.text(acc.type, 220, tableY);
      doc.text(acc.bal, 360, tableY);
      doc.text(acc.status, 480, tableY);
      
      tableY += 20;
      doc.moveTo(50, tableY - 5).lineTo(550, tableY - 5).strokeColor('#f3f4f6').lineWidth(1).stroke();
    });

    // Footer
    doc.fontSize(10).fillColor('gray').text(
      'This report is electronically generated and is strictly confidential. IDBI WealthSphere relies on data from major credit bureaus.',
      50, 700, { align: 'center', width: 500 }
    );

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Server error generating PDF report' });
  }
});

module.exports = router;