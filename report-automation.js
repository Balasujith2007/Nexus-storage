/**
 * Nexus Storage - Automated Weekly Report & Email Service
 * 
 * This standalone script demonstrates how to automate PDF report generation
 * and email distribution using Node.js, `node-cron`, and `nodemailer`.
 * 
 * To run this locally:
 * 1. npm install node-cron nodemailer
 * 2. node report-automation.js
 */

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

// ==========================================
// 1. EMAIL CONFIGURATION
// ==========================================
// Replace with your actual SMTP credentials (e.g., SendGrid, AWS SES, or Gmail App Passwords)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'admin@nexus-storage.com',
    pass: 'YOUR_SECURE_PASSWORD'
  }
});

// ==========================================
// 2. REPORT GENERATOR FUNCTION
// ==========================================
async function generateWeeklyReportPDF() {
  console.log("Generating Weekly Cluster Report...");
  
  // In a real scenario, fetch this data from MongoDB / Express API
  const mockNodes = [
    { name: "Alpha Core Node", region: "US-East-1", capacity: 64, status: "ONLINE", health: 99.9 },
    { name: "Beta Replica", region: "EU-West-2", capacity: 42, status: "SYNCING", health: 100 },
    { name: "Gamma Edge", region: "AP-South-1", capacity: 81, status: "ONLINE", health: 98.5 },
  ];

  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Cyberpunk Dark Background
  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, 210, 297, 'F');
  
  // Branding Header
  doc.setTextColor(6, 182, 212);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text("NEXUS STORAGE", 14, 25);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Automated Weekly Cluster Analytics", 14, 32);
  
  // Timestamp
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

  // Executive Summary
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text("Weekly Storage Analytics Summary", 14, 52);
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Storage Used: 64%`, 14, 60);
  doc.text(`Active Nodes: ${mockNodes.length}`, 14, 66);
  doc.text(`Total Files Synchronized: 1,245,000`, 14, 72);
  doc.text(`System Health: 99.9% Uptime (Optimal)`, 14, 78);

  // Node-wise Breakdown Table
  const tableData = mockNodes.map(n => [n.name, n.region, `${n.capacity} TB`, n.status, `${n.health}%`]);
  
  doc.autoTable({
    startY: 90,
    head: [['Node Name', 'Region', 'Capacity', 'Status', 'Health']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212], textColor: [255, 255, 255] },
    bodyStyles: { fillColor: [30, 41, 59], textColor: [203, 213, 225] },
    alternateRowStyles: { fillColor: [15, 23, 42] }
  });

  // Admin Signature Section
  let finalY = doc.lastAutoTable.finalY + 30;
  doc.setDrawColor(6, 182, 212);
  doc.line(140, finalY, 196, finalY);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("System Automated Signature", 145, finalY + 5);

  const filePath = path.join(__dirname, `Nexus_Weekly_Report_${Date.now()}.pdf`);
  fs.writeFileSync(filePath, doc.output());
  return filePath;
}

// ==========================================
// 3. EMAIL DISPATCHER
// ==========================================
async function sendReportEmail(pdfPath) {
  console.log("Dispatching email...");
  try {
    const info = await transporter.sendMail({
      from: '"Nexus Storage Cluster" <admin@nexus-storage.com>',
      to: "admin-team@company.com",
      subject: `Weekly Cluster Analytics Report - ${new Date().toLocaleDateString()}`,
      text: "Attached is the automated weekly report for the Nexus Distributed Storage Cluster.",
      attachments: [
        {
          filename: 'Nexus_Cluster_Report.pdf',
          path: pdfPath
        }
      ]
    });
    console.log("✅ Weekly report sent successfully: %s", info.messageId);
    
    // Cleanup temporary file
    fs.unlinkSync(pdfPath);
  } catch (error) {
    console.error("❌ Failed to send weekly report:", error);
  }
}

// ==========================================
// 4. CRON JOB SCHEDULER
// ==========================================
// This cron expression runs every Sunday at 00:00 (Midnight)
cron.schedule('0 0 * * 0', async () => {
  console.log("Triggering automated weekly report generation...");
  const pdfPath = await generateWeeklyReportPDF();
  await sendReportEmail(pdfPath);
});

console.log("⏳ Nexus Automated Report Service is running. Waiting for next cron trigger...");
