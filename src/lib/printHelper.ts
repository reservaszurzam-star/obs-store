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

  // Remove any previous print iframes
  const oldIframes = document.querySelectorAll('iframe[data-print-frame="true"]');
  oldIframes.forEach(f => f.remove());

  // Collect all active stylesheets from main document
  const styleElements = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('\n');

  // Create temporary hidden iframe
  const iframe = document.createElement('iframe');
  iframe.setAttribute('data-print-frame', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Clone clean inner HTML without any top-level 'hidden' class
  const contentHtml = element.innerHTML;

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
      visibility: visible !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #161716 !important;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
      visibility: visible !important;
    }
    .print-wrapper {
      width: 100% !important;
      max-width: 780px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      display: block !important;
      visibility: visible !important;
      background: #ffffff !important;
    }
    .print-wrapper * {
      visibility: visible !important;
    }
    .hidden {
      display: block !important;
      visibility: visible !important;
    }
  </style>
</head>
<body>
  <div class="print-wrapper">
    ${contentHtml}
  </div>
</body>
</html>`);
  doc.close();

  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      window.print();
    }
  };

  // Wait for resources (images, fonts) inside iframe to render
  setTimeout(triggerPrint, 350);

  // Clean up iframe after user completes/cancels print dialog
  setTimeout(() => {
    try {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    } catch {
      // ignore
    }
  }, 45000);
}

