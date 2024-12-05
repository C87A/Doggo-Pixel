// สีที่สุ่มใช้
const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700',
    '#00FF00', '#00FFFF', '#FF1493', '#ADFF2F', '#FF6347',
    '#FF4500', '#32CD32', '#6A5ACD', '#FFD700', '#F4A300',
    '#FF8C00', '#C71585', '#8A2BE2', '#7FFF00', '#DC143C',
    '#98FB98', '#FF6347', '#800080', '#FF4500', '#C71585',
    '#D2691E', '#1E90FF', '#00BFFF', '#A52A2A', '#228B22'
];

// สร้าง Canvas และ Context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// โหลดภาพขนาด 32px และ mask ขนาด 32px
const originalImage = new Image();
const maskImage = new Image();
let imagesLoaded = false;

// ระบุพาธของภาพ 32x32 และ mask 32x32 ที่คุณทำไว้
originalImage.src = 'dog32.png'; // ใส่พาธไฟล์ของภาพหมา 32px
maskImage.src = 'mask32.png'; // ใส่พาธไฟล์ของ mask 32px

// เมื่อภาพทั้งสองโหลดเสร็จ
let maskData;
originalImage.onload = () => {
    maskImage.onload = () => {
        imagesLoaded = true;
        maskData = getMaskData(maskImage);
        drawScaledImage(); // วาดภาพเมื่อโหลดเสร็จ
    };
};

// ฟังก์ชั่นเพื่อดึงข้อมูลจาก mask
function getMaskData(mask) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = 32;
    tempCanvas.height = 32;
    tempCtx.drawImage(mask, 0, 0, 32, 32);
    return tempCtx.getImageData(0, 0, 32, 32);
}

// วาดภาพขนาดใหญ่บนแคนวาส
function drawScaledImage() {
    if (!imagesLoaded) return;

    // วาดภาพขนาด 32x32 และอัพสเกลเป็น 500x500
    ctx.clearRect(0, 0, canvas.width, canvas.height); // เคลียร์แคนวาส
    ctx.drawImage(originalImage, 0, 0, 32, 32, 0, 0, canvas.width, canvas.height);
}

// ฟังก์ชั่นสุ่มสี
function randomizeColors() {
    if (!imagesLoaded) {
        alert('Image is still loading. Please wait.');
        return;
    }

    // ขนาดของบล็อกที่สุ่มสี (32px x 32px)
    const blockSize = 32;
    const rows = Math.floor(canvas.height / blockSize); // แบ่งตามแนวตั้ง
    const cols = Math.floor(canvas.width / blockSize); // แบ่งตามแนวนอน

    // ดึงข้อมูลภาพจากแคนวาส
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // ลูปในแต่ละบล็อก 32x32
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const startX = col * blockSize;
            const startY = row * blockSize;

            // ตรวจสอบว่าในพื้นที่นี้มีสีที่สุ่มได้ตาม mask หรือไม่
            const maskIndex = ((startY / blockSize) * 32 + (startX / blockSize)) * 4;

            // ถ้า mask มีสีขาว (ให้สุ่มสี)
            if (maskData.data[maskIndex + 3] === 0) {
                const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                const [r, g, b] = hexToRgb(randomColor);

                // เปลี่ยนสีของพิกเซลในบล็อก
                for (let y = 0; y < blockSize; y++) {
                    for (let x = 0; x < blockSize; x++) {
                        const index = ((startY + y) * canvas.width + (startX + x)) * 4;

                        imageData.data[index] = r;
                        imageData.data[index + 1] = g;
                        imageData.data[index + 2] = b;
                        imageData.data[index + 3] = 255; // ตั้งค่า alpha เป็น 255 (ไม่โปร่งใส)
                    }
                }
            }
        }
    }

    // อัปเดตแคนวาสหลังจากสุ่มสี
    ctx.putImageData(imageData, 0, 0);
}

// ฟังก์ชั่นแปลงสี Hex เป็น RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

// เชื่อมโยงปุ่มสุ่มสี
document.getElementById('randomizeButton').addEventListener('click', randomizeColors);
