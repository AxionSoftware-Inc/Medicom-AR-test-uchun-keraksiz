// GLOBAL O'ZGARUVCHILAR
let currentStep = 1;
const worldRoot = document.getElementById('world-root');

// 1. DASTURNI BOSHLASH
async function initApp() {
    // UI o'zgarishi
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('nav-ui').style.display = 'block';
    document.getElementById('calibration-ui').style.display = 'block';

    // Kamera fonini yoqish
    await startCameraFeed();

    // Matnni yangilash
    updateStatus("Orqaga (180°) o'giring");

    // Sensorlarga ruxsat (iOS uchun)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const response = await DeviceOrientationEvent.requestPermission();
            if (response !== 'granted') {
                alert("Diqqat: Sensorlarga ruxsat berilmadi! Navigatsiya ishlamasligi mumkin.");
            }
        } catch (e) {
            console.error(e);
        }
    }
}

// 2. KAMERA FONINI YOQISH FUNKSIYASI
async function startCameraFeed() {
    const videoElement = document.getElementById('bg-video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment' 
            } 
        });
        videoElement.srcObject = stream;
    } catch (err) {
        console.error("Kamera xatosi:", err);
        alert("Kamerani ochib bo'lmadi. Iltimos brauzer sozlamalarini tekshiring.");
        // Test uchun qora fon
        document.body.style.backgroundColor = "#000";
    }
}

// 3. BOSQICHLARNI BOSHQARISH
function nextStep() {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const btn = document.getElementById('action-btn');

    if (currentStep === 1) {
        // 1-bosqich tugadi -> 2-bosqichga o'tish
        step1.setAttribute('visible', 'false');
        step2.setAttribute('visible', 'true');
        
        updateStatus("Eshikdan chiqib O'NGGA buriling");
        btn.innerText = "Manzilga yetdim 🏁";
        
        currentStep = 2;
    } else if (currentStep === 2) {
        // Tugatish
        updateStatus("Tabriklaymiz! Yetib keldingiz.");
        btn.style.display = 'none'; // Tugmani yashirish
        document.getElementById('calibration-ui').style.display = 'none';
        
        // Salgina confetti effekti (simulyatsiya)
        worldRoot.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 10000; loop: true');
    }
}

// 4. MATNNI YANGILASH YORDAMCHISI
function updateStatus(text) {
    document.getElementById('status-box').innerText = text;
}

// 5. QO'LDA KALIBROVKA QILISH
// Slayderni surganingizda dunyo aylanadi
function manualCalibrate(val) {
    // A-Frame rotatsiyasi: x y z
    // Bizga faqat Y (vertikal o'q) atrofida aylanish kerak
    worldRoot.setAttribute('rotation', `0 ${val} 0`);
}