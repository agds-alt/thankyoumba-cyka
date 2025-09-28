// Background Music Control
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// Mobile-friendly touch events
musicToggle.addEventListener('click', function() {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
            // Fallback for mobile autoplay restrictions
            musicToggle.innerHTML = '<span class="cyber-text">🔇 TAP TO PLAY</span>';
        });
        musicToggle.innerHTML = '<span class="cyber-text">🎵 PAUSE AUDIO</span>';
    } else {
        bgMusic.pause();
        musicToggle.innerHTML = '<span class="cyber-text">🎵 PLAY AUDIO</span>';
    }
});

// Touch event for better mobile interaction
musicToggle.addEventListener('touchend', function(e) {
    e.preventDefault();
    this.click();
});

// Matrix Rain Effect - Mobile Optimized
function createMatrixRain() {
    const matrixBg = document.getElementById('matrix-bg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust density based on screen size for performance
        if (window.innerWidth < 768) {
            fontSize = 12;
        } else {
            fontSize = 14;
        }
        columns = Math.floor(canvas.width / fontSize);
        
        // Reinitialize drops array
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
        }
    }
    
    let fontSize = 12;
    let columns = 0;
    let drops = [];
    
    const characters = '01010101010101010101010101010101';
    
    function draw() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px JetBrains Mono';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            // Reset drop if it reaches bottom with random chance
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Initial setup
    resizeCanvas();
    matrixBg.appendChild(canvas);
    
    // Adjust animation speed for mobile performance
    const speed = window.innerWidth < 768 ? 50 : 33; // Slower on mobile
    setInterval(draw, speed);
}

// Terminal Typing Effect - Mobile Optimized
function initTerminalEffects() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach((element, index) => {
        const originalText = element.textContent;
        element.textContent = '';
        element.style.minHeight = '1.5em'; // Prevent layout shift
        
        setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < originalText.length) {
                    element.textContent += originalText.charAt(i);
                    i++;
                    
                    // Scroll element into view on mobile
                    if (i % 10 === 0) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } else {
                    clearInterval(timer);
                }
            }, window.innerWidth < 768 ? 40 : 30); // Slower typing on mobile
        }, index * 1200);
    });
}

// Progress Bar Animation
function animateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    setTimeout(() => {
        progressFill.style.width = '85%';
    }, 2500);
}

// Mobile Viewport Height Fix
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set viewport height first
    setVH();
    
    // Initialize effects
    createMatrixRain();
    initTerminalEffects();
    animateProgressBar();
    
    // Mobile-specific optimizations
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Larger tap targets for mobile
        const buttons = document.querySelectorAll('.cyber-button');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.padding = '12px 20px';
        });
    }
    
    // Try to autoplay music with user interaction
    const enableAudio = () => {
        bgMusic.play().then(() => {
            musicToggle.innerHTML = '<span class="cyber-text">🎵 PAUSE AUDIO</span>';
        }).catch(e => {
            console.log('Autoplay blocked');
            musicToggle.innerHTML = '<span class="cyber-text">🔇 TAP TO PLAY</span>';
        });
        
        // Remove event listeners after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
    };
    
    // Wait for user interaction to enable audio
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
});

// Handle window resize - Mobile Optimized
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        setVH();
        
        // Recreate matrix effect on orientation change
        const matrixBg = document.getElementById('matrix-bg');
        matrixBg.innerHTML = '';
        createMatrixRain();
    }, 250);
});

// Prevent zoom on double-tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// WhatsApp button analytics (optional)
document.querySelector('.whatsapp-btn').addEventListener('click', function() {
    console.log('WhatsApp contact initiated');
    // You can add analytics here
});

// Performance monitoring for mobile
if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.saveData || connection.effectiveType.includes('2g')) {
        // Reduce animations for slow connections
        document.body.classList.add('slow-connection');
    }
}