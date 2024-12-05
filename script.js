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

// โหลดภาพหมาและมาสก์
const dogImage = new Image();
const maskImage = new Image();
let imagesLoaded = 0;

// ระบุพาธของภาพ
dogImage.src = 'dog.png'; // ใส่พาธไฟล์ของภาพหมา
maskImage.src = 'dog-mask.png'; // ใส่พาธไฟล์ของมาสก์

// เมื่อทั้งสองภาพโหลดเสร็จแล้ว
dogImage.onload = maskImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        // เมื่อภาพทั้งสองโหลดเสร็จแล้ว วาดภาพหมาลงบน Canvas
        ctx.drawImage(dogImage, 0, 0, canvas.width, canvas.height);
    }
};

// ฟังก์ชั่นสุ่มสี
function randomizeColors() {
    if (imagesLoaded < 2) {
        alert('Images are still loading. Please wait.');
        return;
    }

    // ขนาดของบล็อกที่สุ่มสี (32px x 32px)
    const blockSize = 32;
    const rows = Math.floor(canvas.height / blockSize); // แบ่งตามแนวตั้ง
    const cols = Math.floor(canvas.width / blockSize); // แบ่งตามแนวนอน

    // ดึงข้อมูลภาพจากแคนวาสหลัก
    const dogData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // ลูปในแต่ละบล็อก
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // คำนวณตำแหน่งเริ่มต้นของแต่ละบล็อก
            const startX = col * blockSize;
            const startY = row * blockSize;

            // วาดบล็อกขนาด 32px x 32px
            for (let y = 0; y < blockSize; y++) {
                for (let x = 0; x < blockSize; x++) {
                    const index = ((startY + y) * canvas.width + (startX + x)) * 4;

                    // สุ่มสีสำหรับบล็อกนี้
                    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                    const [r, g, b] = hexToRgb(randomColor);

                    // เปลี่ยนสีของพิกเซลในบล็อก
                    dogData.data[index] = r;
                    dogData.data[index + 1] = g;
                    dogData.data[index + 2] = b;
                }
            }
        }
    }

    // อัปเดตแคนวาสหลักหลังสุ่มสี
    ctx.putImageData(dogData, 0, 0);
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
