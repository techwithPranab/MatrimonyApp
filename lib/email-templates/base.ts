// Base email template with consistent styling
export interface EmailTemplateData {
  readonly userName: string;
  readonly subject: string;
  readonly preheaderText?: string;
}

export function createEmailTemplate(
  title: string, 
  content: string, 
  ctaButton?: { text: string; url: string },
  footerContent?: string
): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  
  <style>
    /* Reset styles */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }
    
    table, td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    
    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
    }
    
    a {
      text-decoration: none;
    }
    
    *[x-apple-data-detectors], .unstyle-auto-detected-links *, .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    
    .im {
      color: inherit !important;
    }
    
    .a6S {
      display: none !important;
      opacity: 0.01 !important;
    }
    
    img.g-img + div {
      display: none !important;
    }
    
    /* Main styles */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header .subtitle {
      color: #e8f4f8;
      font-size: 16px;
      margin: 10px 0 0 0;
    }
    
    .content {
      padding: 40px 30px;
      background-color: #ffffff;
    }
    
    .content h2 {
      color: #333333;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 20px 0;
      line-height: 1.3;
    }
    
    .content p {
      color: #666666;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    
    .content .highlight {
      background-color: #f8f9ff;
      border: 2px solid #e3f2fd;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      padding: 15px 30px;
      border-radius: 6px;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .divider {
      border: none;
      height: 1px;
      background: linear-gradient(to right, transparent, #dddddd, transparent);
      margin: 30px 0;
    }
    
    .footer {
      background-color: #f8f9fa;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    
    .footer p {
      color: #888888;
      font-size: 14px;
      margin: 5px 0;
      line-height: 1.4;
    }
    
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .social-links {
      margin: 20px 0 10px 0;
    }
    
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      padding: 8px;
      background-color: #667eea;
      color: #ffffff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 24px;
      text-decoration: none;
    }
    
    /* Mobile responsive */
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      .header {
        padding: 30px 15px !important;
      }
      
      .header h1 {
        font-size: 24px !important;
      }
      
      .content {
        padding: 25px 20px !important;
      }
      
      .content h2 {
        font-size: 20px !important;
      }
      
      .content p {
        font-size: 15px !important;
      }
      
      .cta-button {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      
      .footer {
        padding: 20px 15px !important;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #1a1a1a !important;
      }
      
      .content {
        background-color: #1a1a1a !important;
      }
      
      .content h2 {
        color: #ffffff !important;
      }
      
      .content p {
        color: #cccccc !important;
      }
      
      .content .highlight {
        background-color: #2a2a2a !important;
        border-color: #404040 !important;
      }
      
      .footer {
        background-color: #0f0f0f !important;
        border-top-color: #404040 !important;
      }
      
      .footer p {
        color: #999999 !important;
      }
    }
  </style>
</head>

<body width="100%" style="margin: 0; padding: 0; mso-line-height-rule: exactly; background-color: #f4f4f4;">
  <center style="width: 100%; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
      <!-- Header -->
      <div class="header">
        <h1>💕 MatrimonyApp</h1>
        <div class="subtitle">Your journey to finding true love</div>
      </div>
      
      <!-- Main Content -->
      <div class="content">
        ${content}
        
        ${ctaButton ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${ctaButton.url}" class="cta-button">${ctaButton.text}</a>
        </div>
        ` : ''}
        
        ${footerContent || ''}
      </div>
      
      <hr class="divider">
      
      <!-- Footer -->
      <div class="footer">
        <div class="social-links">
          <a href="#" title="Facebook">f</a>
          <a href="#" title="Twitter">t</a>
          <a href="#" title="Instagram">i</a>
        </div>
        
        <p><strong>MatrimonyApp</strong></p>
        <p>Connecting hearts, building relationships</p>
        <p>
          <a href="#" style="color: #667eea;">Privacy Policy</a> | 
          <a href="#" style="color: #667eea;">Terms of Service</a> | 
          <a href="#" style="color: #667eea;">Unsubscribe</a>
        </p>
        <p style="margin-top: 20px; color: #aaaaaa; font-size: 12px;">
          This email was sent to you because you have an account with MatrimonyApp.<br>
          If you no longer wish to receive these emails, you can <a href="#" style="color: #667eea;">unsubscribe here</a>.
        </p>
      </div>
    </div>
  </center>
</body>
</html>
  `.trim();
}
