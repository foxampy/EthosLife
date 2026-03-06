/**
 * PDF Generator for SAFT Agreements
 * Generates filled SAFT PDF from template
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate HTML for SAFT PDF
 */
function generateSAFTHTML(data) {
  const { 
    investorData, 
    investmentAmount, 
    pricePerToken, 
    tokensAllocated,
    currency,
    walletAddress,
    submissionDate,
    submissionId
  } = data;

  const date = new Date(submissionDate);
  const dateStr = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SAFT - ${investorData.fullName}</title>
    <style>
        @page { size: A4; margin: 1.5cm; }
        * { box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #2d2418;
            background: #e4dfd5;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            background: linear-gradient(145deg, #dcd3c6, #c2b8a9);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 4px 4px 8px #b8ae9f;
        }
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 18pt;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header .subtitle {
            font-size: 12pt;
            color: #5c5243;
            font-weight: 600;
        }
        .section {
            background: linear-gradient(145deg, #e8e2d5, #dcd3c6);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 2px 2px 6px #b8ae9f;
        }
        .section-title {
            font-size: 11pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #5c5243;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #5c5243;
        }
        .field {
            display: flex;
            margin-bottom: 8px;
            border-bottom: 1px dotted #8c7a6b;
            padding-bottom: 4px;
        }
        .field-label {
            font-weight: 600;
            min-width: 140px;
            color: #5c5243;
        }
        .field-value {
            flex: 1;
        }
        .highlight {
            background: linear-gradient(145deg, #5c5243, #3d3226);
            color: #e4dfd5;
            padding: 15px;
            border-radius: 10px;
            margin: 15px 0;
        }
        .highlight-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .highlight-label {
            opacity: 0.8;
        }
        .highlight-value {
            font-weight: 700;
        }
        .signature-block {
            margin-top: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        .signature-box {
            border: 1px solid #8c7a6b;
            padding: 15px;
            border-radius: 8px;
        }
        .signature-line {
            border-bottom: 1px solid #2d2418;
            height: 40px;
            margin-bottom: 5px;
        }
        .signature-label {
            font-size: 9pt;
            color: #5c5243;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #8c7a6b;
            font-size: 8pt;
            color: #5c5243;
            text-align: center;
        }
        .badge {
            display: inline-block;
            background: #5c5243;
            color: #e4dfd5;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 9pt;
            margin-left: 10px;
        }
        .terms {
            font-size: 9pt;
            text-align: justify;
        }
        .terms h4 {
            margin: 10px 0 5px 0;
            font-size: 10pt;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            border: 1px solid #8c7a6b;
            padding: 6px;
            text-align: left;
            font-size: 9pt;
        }
        th {
            background: #5c5243;
            color: #e4dfd5;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Simple Agreement for Future Tokens (SAFT)</h1>
        <div class="subtitle">EthosLife Seed Round <span class="badge">CONFIRMED</span></div>
        <div style="margin-top: 10px; font-size: 9pt;">
            Submission ID: ${submissionId} | Date: ${dateStr}
        </div>
    </div>

    <div class="highlight">
        <div class="highlight-row">
            <span class="highlight-label">Investment Amount:</span>
            <span class="highlight-value">$${investmentAmount.toLocaleString()} ${currency}</span>
        </div>
        <div class="highlight-row">
            <span class="highlight-label">Price per Token:</span>
            <span class="highlight-value">$${pricePerToken.toFixed(4)}</span>
        </div>
        <div class="highlight-row">
            <span class="highlight-label">Tokens Allocated:</span>
            <span class="highlight-value">${tokensAllocated.toLocaleString()} UNITY</span>
        </div>
        <div class="highlight-row">
            <span class="highlight-label">Staking APY (6-12m):</span>
            <span class="highlight-value">25%</span>
        </div>
        <div class="highlight-row">
            <span class="highlight-label">Wallet Address:</span>
            <span class="highlight-value" style="font-family: monospace; font-size: 9pt;">${walletAddress}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">1. The Investor</div>
        <div class="field">
            <span class="field-label">Full Legal Name:</span>
            <span class="field-value">${investorData.fullName}</span>
        </div>
        <div class="field">
            <span class="field-label">Date of Birth:</span>
            <span class="field-value">${investorData.dob}</span>
        </div>
        <div class="field">
            <span class="field-label">Nationality:</span>
            <span class="field-value">${investorData.nationality}</span>
        </div>
        <div class="field">
            <span class="field-label">Passport/ID:</span>
            <span class="field-value">${investorData.passportNumber} (issued by ${investorData.issuedBy})</span>
        </div>
        <div class="field">
            <span class="field-label">Contact Email:</span>
            <span class="field-value">${investorData.email}</span>
        </div>
        <div class="field">
            <span class="field-label">Phone/Telegram:</span>
            <span class="field-value">${investorData.phone}</span>
        </div>
        <div class="field">
            <span class="field-label">Residential Address:</span>
            <span class="field-value">${investorData.address}</span>
        </div>
        <div class="field">
            <span class="field-label">Investor Status:</span>
            <span class="field-value">${investorData.investorStatus.toUpperCase()}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">2. Vesting Schedule</div>
        <table>
            <tr>
                <th>Milestone</th>
                <th>Tokens Unlocked</th>
                <th>Cumulative</th>
            </tr>
            <tr>
                <td>Month 0 (TGE)</td>
                <td>0% (Cliff in effect)</td>
                <td>0%</td>
            </tr>
            <tr>
                <td>Month 6 (End of Cliff)</td>
                <td>25% (${Math.floor(tokensAllocated * 0.25).toLocaleString()} UNITY)</td>
                <td>25%</td>
            </tr>
            <tr>
                <td>Months 7-24</td>
                <td>4.166% per month</td>
                <td>Linear progression</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">3. Key Terms Summary</div>
        <div class="terms">
            <p><strong>TGE (Token Generation Event):</strong> Estimated within 90 days of this agreement, no later than 180 days.</p>
            
            <p><strong>UNITY Token:</strong> ERC-20 utility token providing access to EthosLife H.O.S. platform, governance rights, and staking eligibility.</p>
            
            <p><strong>Staking Boost Voucher:</strong> Non-transferable digital right granting 25% APY (target) during months 6-12 post-TGE, compared to standard 15%.</p>
            
            <p><strong>Lifetime Premium Access:</strong> Immediate access to EthosLife Premium tier upon platform launch, valid for lifetime of account.</p>
            
            <p><strong>Refund Option:</strong> If TGE has not occurred within 180 days, Investor may elect full refund or equity conversion at $2.5M pre-money valuation.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">4. Risk Acknowledgment</div>
        <div class="terms">
            <p>The Investor acknowledges understanding of the following risks:</p>
            <ul>
                <li>Technology risk (smart contract vulnerabilities)</li>
                <li>Regulatory risk (potential security classification in some jurisdictions)</li>
                <li>Liquidity risk (no secondary market for 6-24 months)</li>
                <li>Total loss risk (blockchain projects are experimental)</li>
                <li>No guaranteed yield (APYs are targets, not obligations)</li>
            </ul>
        </div>
    </div>

    <div class="signature-block">
        <div class="signature-box">
            <div style="font-weight: 700; margin-bottom: 10px;">THE INVESTOR</div>
            <div class="signature-line"></div>
            <div class="signature-label">Signature</div>
            <div style="margin-top: 10px;">
                <strong>Name:</strong> ${investorData.fullName}<br>
                <strong>Date:</strong> ___________________
            </div>
        </div>
        <div class="signature-box">
            <div style="font-weight: 700; margin-bottom: 10px;">THE COMPANY</div>
            <div class="signature-line"></div>
            <div class="signature-label">Signature</div>
            <div style="margin-top: 10px;">
                <strong>Name:</strong> ___________________<br>
                <strong>Title:</strong> Founder & Chief Architect<br>
                <strong>Date:</strong> ___________________
            </div>
        </div>
    </div>

    <div class="footer">
        This SAFT agreement is subject to the full terms and conditions available at ethoslife.com/saft<br>
        Submission ID: ${submissionId} | Generated: ${new Date().toISOString()}
    </div>
</body>
</html>`;
}

/**
 * Generate SAFT PDF (placeholder - in production use puppeteer)
 * Returns HTML that can be converted to PDF
 */
function generateSAFTPDF(data) {
  const html = generateSAFTHTML(data);
  
  // In production, you would use puppeteer to convert HTML to PDF
  // For now, we return HTML that can be saved/printed as PDF
  return {
    html,
    filename: `SAFT_${data.investorData.fullName.replace(/\s+/g, '_')}_${data.submissionId}.html`
  };
}

module.exports = {
  generateSAFTHTML,
  generateSAFTPDF
};
