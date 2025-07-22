// KONFIGURASI TANGGAL SURAT (EDIT DI SINI)
const LETTER_DATE = {
    day: 25,        // Tanggal (1-31)
    month: 7,       // Bulan (1-12)
    year: 2025      // Tahun
};

// Set current date
const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Format tanggal surat berdasarkan konfigurasi
const formattedLetterDate = `${LETTER_DATE.day} ${months[LETTER_DATE.month - 1]} ${LETTER_DATE.year}`;
document.getElementById("current-date").textContent = formattedLetterDate;

// Load signatures and verification status when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if Tata's signature is in local storage
    const savedTataSignature = localStorage.getItem('tataSignature');
    const hasVerification = localStorage.getItem('hasVerification');
    
    if (savedTataSignature) {
        // Load Arya's signature
        loadAryaSignature();
        
        // Load Tata's signature
        const tataSignatureImg = document.createElement('img');
        tataSignatureImg.src = savedTataSignature;
        tataSignatureImg.style.maxWidth = '100%';
        tataSignatureImg.style.maxHeight = '100px';
        
        document.getElementById('tata-signature-container').appendChild(tataSignatureImg);
        
        // Hide the sign button since signature already exists
        document.getElementById('sign-button-container').style.display = 'none';
        
        // Show Tata's fingerprint
        document.querySelector('.tata-fingerprint').style.opacity = '0.7';
        
        // If we also have verification, show the stamp
        if (hasVerification === 'true') {
            showStampOnLetter();
        }
    } else {
        // Just load Arya's signature
        loadAryaSignature();
        
        // Arya's fingerprint is already visible by default in CSS
    }
});

// Signature modal functionality
const modal = document.getElementById('signature-modal');
const fingerprintModal = document.getElementById('fingerprint-modal');
const signButton = document.getElementById('sign-button');
const closeModalBtn = document.querySelector('.close-modal');

signButton.addEventListener('click', function() {
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    if (event.target === fingerprintModal) {
        fingerprintModal.style.display = 'none';
    }
});

// Signature pad functionality
let canvas = document.getElementById('signature-pad');
let ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set up signature pad
ctx.strokeStyle = '#000';
ctx.lineWidth = 2;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Start drawing (mouse events)
canvas.addEventListener('mousedown', function(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', function(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', function() {
    isDrawing = false;
});

canvas.addEventListener('mouseout', function() {
    isDrawing = false;
});

// Touch support for mobile devices
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    isDrawing = true;
    [lastX, lastY] = [offsetX, offsetY];
});

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    [lastX, lastY] = [offsetX, offsetY];
});

canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    isDrawing = false;
});

// Clear signature
document.getElementById('clear-signature').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save signature and show fingerprint modal
document.getElementById('save-signature').addEventListener('click', function() {
    // Get signature image
    const signatureImage = canvas.toDataURL();
    
    // Save to local storage
    localStorage.setItem('tataSignature', signatureImage);
    
    // Create image element for display
    const img = document.createElement('img');
    img.src = signatureImage;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100px';
    img.classList.add('signature-animation');
    
    // Add signature to her signature area
    const tataSignatureContainer = document.getElementById('tata-signature-container');
    tataSignatureContainer.innerHTML = '';
    tataSignatureContainer.appendChild(img);
    
    // Hide the sign button after signing
    document.getElementById('sign-button-container').style.display = 'none';
    
    // Close signature modal
    modal.style.display = 'none';
    
    // Show fingerprint verification modal
    setTimeout(function() {
        showFingerprintModal();
    }, 1000);
});

// Show fingerprint verification modal
function showFingerprintModal() {
    // Display fingerprint modal
    fingerprintModal.style.display = 'flex';
    
    // Activate scanner light animation
    const scannerLight = document.querySelector('.scanner-light');
    scannerLight.style.opacity = '1';
    
    // Simulate fingerprint scan and close modal after 3 seconds
    setTimeout(function() {
        fingerprintModal.style.display = 'none';
        
        // Show Tata's fingerprint with animation
        const tataFingerprint = document.querySelector('.tata-fingerprint');
        tataFingerprint.style.opacity = '0.7';
        tataFingerprint.style.animation = 'fingerprintAppear 1s forwards';
        
        // Show stamp on letter after fingerprint verification
        showStampOnLetter();
    }, 3000);
}

// Show stamp on the letter
function showStampOnLetter() {
    // Set CURRENT date on letter stamp (stempel tetap menggunakan tanggal hari ini)
    const currentDate = new Date();
    const formattedStampDate = `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`;
    
    // Update stamp date on the letter
    const letterStampDate = document.querySelector('.stamp-overlay .stamp-date');
    if (letterStampDate) {
        letterStampDate.textContent = formattedStampDate;
    }
    
    // Show and animate the stamp overlay
    const stampOverlay = document.getElementById('stamp-overlay');
    stampOverlay.style.opacity = '1';
    stampOverlay.style.animation = 'stampAppear 1.5s forwards';
    
    // Save verification status
    localStorage.setItem('hasVerification', 'true');
}

// Print functionality
document.getElementById('printButton').addEventListener('click', function() {
    window.print();
});

// Function to load Arya's signature
function loadAryaSignature() {
    // Creating a default signature for Arya
    const aryaCanvas = document.createElement('canvas');
    aryaCanvas.width = 400;
    aryaCanvas.height = 200;
    const aryaCtx = aryaCanvas.getContext('2d');
    
    // Draw a simple signature
    aryaCtx.beginPath();
    aryaCtx.strokeStyle = '#000';
    aryaCtx.lineWidth = 3;
    aryaCtx.moveTo(50, 150);
    aryaCtx.bezierCurveTo(100, 50, 200, 150, 300, 100);
    aryaCtx.stroke();
    
    aryaCtx.beginPath();
    aryaCtx.moveTo(320, 100);
    aryaCtx.lineTo(350, 150);
    aryaCtx.stroke();
    
    // Convert to image and display
    const aryaSignatureImg = document.createElement('img');
    aryaSignatureImg.src = aryaCanvas.toDataURL();
    aryaSignatureImg.style.maxWidth = '100%';
    aryaSignatureImg.style.maxHeight = '100px';
    
}