const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const toggleButton = document.getElementById('toggleButton');

const maskImage = new Image();
maskImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAADeSURBVFhH7ZSLCkMhCIY7e/93btnJ8KiV5sYY9EEE4eVXq3Q4/Du5LQ8Pn1fbd/Am5lT/iICUc9dgFVPtiF+62r5DiXMHui57GObj8JRYq54REgBERNTcoTtQEAXQ+SLKWfeLdgDY6ULPG+3AFK0bHCoArHGFgeRw01cisBXcyjOaHcHiDmAQnngZHCt0/AUPw9kdMFWGiS3zLgiV9IB2wRSNogko4kRCDjdwJ17gFoB8SshSwFf/AQs/FzACRsDHoJ0BHlvBGcFKwKjlGh7bzkiA9nxGT8pjezgwUnoDnC5H/zkoUjcAAAAASUVORK5CYII='; // ใส่ข้อมูล Base64 ที่ได้

const colorSets = {
  red: ['#FF0000', '#FF4D4D', '#FF8080', '#FF9999', '#FFB3B3'],
  yellow: ['#FFFF00', '#FFFF4D', '#FFFF80', '#FFFF99', '#FFFFB3'],
  blue: ['#0000FF', '#4D4DFF', '#8080FF', '#9999FF', '#B3B3FF'],
  orange: ['#FFA500', '#FFB84D', '#FFCC80', '#FFD699', '#FFE0B3'],
  green: ['#008000', '#339933', '#66CC66', '#99E699', '#B3FFB3'],
  purple: ['#800080', '#993399', '#B266B2', '#CC99CC', '#E6CCE6'],
  cyan: ['#00FFFF', '#4DFFFF', '#80FFFF', '#99FFFF', '#B3FFFF'],
  pink: ['#FFC0CB', '#FFCCE0', '#FFD6E6', '#FFE0EB', '#FFEAF0'],
  brown: ['#8B4513', '#A0522D', '#CD853F', '#D2B48C', '#DEB887'],
  gray: ['#808080', '#999999', '#B3B3B3', '#CCCCCC', '#E6E6E6'],
    mint: ['#00FF9C', '#B6FFA1', '#FEFFA7', '#FFE700', '#A1EEBD'],
};

let currentSet = 'red';
let isRunning = true;
let loopInterval;

// โหลด mask
maskImage.onload = () => {
  drawRandomColors(); // วาดครั้งแรก
  startRandomizing(); // เริ่มการสุ่มสี
};

// ควบคุมปุ่ม Pause/Resume
toggleButton.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(loopInterval);
    toggleButton.textContent = 'Resume';
  } else {
    startRandomizing();
    toggleButton.textContent = 'Pause';
  }
  isRunning = !isRunning;
});

// เริ่มต้นการสุ่ม
function startRandomizing() {
  clearInterval(loopInterval);
  loopInterval = setInterval(drawRandomColors, 50);
}

// ฟังก์ชันวาดภาพพร้อมสุ่มสี
function drawRandomColors() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);

  const colors = colorSets[currentSet];
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const isMasked = data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0; // พื้นที่สีดำใน mask
    const isWhite = data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255; // พื้นที่สีขาวใน mask

    // ถ้าเป็นสีดำใน mask ให้สุ่มสี
    if (isMasked) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const [r, g, b] = hexToRgb(randomColor);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    
    // ถ้าเป็นสีขาวใน mask เปลี่ยนเป็นดำ
    if (isWhite) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // สุ่มชุดสีใหม่สำหรับรอบต่อไป
  const sets = Object.keys(colorSets);
  currentSet = sets[Math.floor(Math.random() * sets.length)];
}

// ฟังก์ชันแปลง Hex เป็น RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

document.addEventListener('DOMContentLoaded', function() {
  // กำหนดสีที่สุ่มให้กับตัวอักษร
  const colors = ['red', 'green', 'yellow', 'white','purple'];
  
  // ดึง element ที่มี id เป็น pupffle-pixel
  const title = document.getElementById('pupffle-pixel');
  
  // ฟังก์ชันสำหรับการสุ่มสีให้กับแต่ละตัวอักษร
  function changeTextColor() {
      const text = title.textContent;
      let coloredText = '';
      
      // ลูปผ่านตัวอักษรแต่ละตัวและสุ่มสี
      for (let i = 0; i < text.length; i++) {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          coloredText += `<span style="color: ${randomColor}">${text[i]}</span>`;
      }
      
      // อัพเดตชื่อเว็บไซต์ด้วยการใส่สีที่สุ่มให้
      title.innerHTML = coloredText;
  }

  // เปลี่ยนสีทุกๆ 200 มิลลิวินาที (คุณสามารถปรับเวลาได้)
  setInterval(changeTextColor, 150);
});
