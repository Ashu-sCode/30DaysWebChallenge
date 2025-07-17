document.getElementById('generate-btn').addEventListener('click', generateQRCode);

function generateQRCode() {
    const qrInput = document.getElementById('qr-input').value;
    const qrCodeContainer = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('download-btn');

    if (!qrInput) {
        alert("Please enter a URL or text!");
        return;
    }

    // Clear previous QR code
    qrCodeContainer.innerHTML = '';

    // Generate a new QR code
    new QRCode(qrCodeContainer, {
        text: qrInput,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Make the download button visible
    downloadBtn.style.display = 'block';

    // Add download functionality
    downloadBtn.onclick = function () {
        const qrCanvas = qrCodeContainer.querySelector('canvas');
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = qrCanvas.toDataURL();
        link.click();
    };
}
