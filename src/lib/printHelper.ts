/**
 * Universal print helper for receipts and shipping labels.
 * Creates an isolated iframe with document styles and exact page rules
 * to guarantee 1-page, 100% styled, crisp printing without blank pages or clipping.
 */
export function printElement(elementId: string, title = 'Nota de Venta - Obsidiana') {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Collect all active stylesheets and inline styles from main document
  const styleElements = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('\n');

  // Create temporary hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  ${styleElements}
  <style>
    @page {
      size: A4 portrait;
      margin: 6mm 8mm;
    }
    * {
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      color: #000 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
    }
    .print-container {
      width: 100% !important;
      max-width: 760px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  </style>
</head>
<body>
  <div class="print-container">
    ${element.innerHTML}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`);
  doc.close();

  // Clean up iframe after user completes/cancels print dialog
  setTimeout(() => {
    try {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    } catch {
      // ignore
    }
  }, 60000);
}
