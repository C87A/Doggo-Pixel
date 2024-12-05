const canvas = document.getElementById('dogCanvas');
const ctx = canvas.getContext('2d');
const randomizeButton = document.getElementById('randomizeButton');

// พาเลตสีที่ใช้สุ่ม
const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC300',
    '#DAF7A6', '#C70039', '#581845', '#900C3F', '#28B463'
];

// โหลดรูปหมา
const dogImage = new Image();
dogImage.src = 'dog.png'; // รูปหมาต้นฉบับ

// โหลด Mask ที่กำหนดพื้นที่เปลี่ยนสี
const maskImage = new Image();
maskImage.src = 'dog-mask.png'; // Mask กำหนดพื้นที่

// ติดตามว่าโหลดรูปครบแล้วหรือยัง
let imagesLoaded = 0;

dogImage.onload = function () {
    imagesLoaded++;
    checkAndRender();
};

maskImage.onload = function () {
    imagesLoaded++;
    checkAndRender();
};

// วาดรูปเมื่อโหลดครบ
function checkAndRender() {
    if (imagesLoaded < 2) return;

    // วาดรูปหมา
    ctx.drawImage(dogImage, 0, 0, canvas.width, canvas.height);
}

// ฟังก์ชันสุ่มสีเฉพาะพื้นที่ Mask
function randomizeColors() {
    if (imagesLoaded < 2) {
        alert('Images are still loading. Please wait.');
        return;
    }

    // วาด Mask ลงในแคนวาสชั่วคราว
    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;

    maskCtx.drawImage(maskImage, 0, 0, maskCanvas.width, maskCanvas.height);
    const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
    const dogData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // เปลี่ยนสีเฉพาะพื้นที่ Mask
    for (let i = 0; i < maskData.data.length; i += 4) {
        if (maskData.data[i] === 0 && maskData.data[i + 1] === 0 && maskData.data[i + 2] === 0) {
            const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            const [r, g, b] = hexToRgb(randomColor);

            dogData.data[i] = r;
            dogData.data[i + 1] = g;
            dogData.data[i + 2] = b;
        }
    }

    // อัปเดตแคนวาส
    ctx.putImageData(dogData, 0, 0);
}

// แปลงสี Hex -> RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

// กดปุ่มเพื่อสุ่มสี
randomizeButton.addEventListener('click', randomizeColors);
