// const canvas = document.getElementById("reptile-canvas");
// const ctx = canvas.getContext("2d");

// // 1. IMPROVED RESPONSIVE RESIZE
// function resize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
    
//     // Scale dragon size based on screen width
//     // If mobile (width < 768), make it smaller
//     window.dragonScale = window.innerWidth < 768 ? 0.6 : 1.0;
// }
// window.addEventListener("resize", resize);
// resize();

// let mouse = { x: canvas.width / 2, y: canvas.height / 2, isFiring: false };

// // --- 2. MULTI-DEVICE INPUT LISTENERS (Mouse + Touch) ---

// // Desktop Mouse
// window.addEventListener("mousemove", (e) => {
//     mouse.x = e.clientX;
//     mouse.y = e.clientY;
// });
// window.addEventListener("mousedown", (e) => { if (e.button === 0) mouse.isFiring = true; });
// window.addEventListener("mouseup", () => mouse.isFiring = false);

// // Mobile Touch
// window.addEventListener("touchstart", (e) => {
//     mouse.isFiring = true;
//     updateTouchPos(e);
// }, { passive: false });

// window.addEventListener("touchmove", (e) => {
//     updateTouchPos(e);
//     // Prevent scrolling while playing with the dragon
//     e.preventDefault(); 
// }, { passive: false });

// window.addEventListener("touchend", () => {
//     mouse.isFiring = false;
// });

// function updateTouchPos(e) {
//     if (e.touches.length > 0) {
//         mouse.x = e.touches[0].clientX;
//         mouse.y = e.touches[0].clientY;
//     }
// }

// // --- 3. LOGIC ---

// class FireParticle {
//     constructor(x, y, angle) {
//         this.x = x;
//         this.y = y;
//         const s = window.dragonScale;
//         const speed = (Math.random() * 12 + 8) * s;
//         const spread = (Math.random() - 0.5) * 0.6; 
//         this.vx = Math.cos(angle + spread) * speed;
//         this.vy = Math.sin(angle + spread) * speed;
//         this.life = 1.0;
//         this.decay = Math.random() * 0.04 + 0.02;
//         this.size = (Math.random() * 7 + 3) * s;
//     }
//     update() {
//         this.x += this.vx;
//         this.y += this.vy;
//         this.life -= this.decay;
//         this.size *= 0.96;
//     }
//     draw(ctx, color) {
//         ctx.save();
//         ctx.globalAlpha = this.life;
//         ctx.shadowBlur = 15;
//         ctx.shadowColor = color;
//         ctx.fillStyle = color;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();
//     }
// }

// class Segment {
//     constructor(len) {
//         this.x = mouse.x;
//         this.y = mouse.y;
//         this.len = len;
//         this.angle = 0;
//     }
//     update(targetX, targetY) {
//         this.angle = Math.atan2(targetY - this.y, targetX - this.x);
//         this.x = targetX - Math.cos(this.angle) * this.len;
//         this.y = targetY - Math.sin(this.angle) * this.len;
//     }
// }

// const totalSegments = 85;
// const segments = Array.from({ length: totalSegments }, () => new Segment(8));
// let particles = [];

// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     const cyanGlow = "#00d1ff"; 
//     const coreWhite = "#ffffff";
//     const s = window.dragonScale; // Global scale factor
    
//     let tx = mouse.x;
//     let ty = mouse.y;

//     if (mouse.isFiring) {
//         tx += (Math.random() - 0.5) * 8 * s;
//         ty += (Math.random() - 0.5) * 8 * s;
//         for (let i = 0; i < 10; i++) {
//             particles.push(new FireParticle(segments[0].x, segments[0].y, segments[0].angle));
//         }
//     }

//     particles = particles.filter(p => p.life > 0);
//     particles.forEach(p => { p.update(); p.draw(ctx, cyanGlow); });

//     segments.forEach((seg, i) => {
//         // Adjust segment length based on scale
//         seg.len = 8 * s;
//         seg.update(tx, ty);
        
//         ctx.save();
//         ctx.translate(seg.x, seg.y);
//         ctx.rotate(seg.angle);

//         const t = i / totalSegments; 
//         const alpha = Math.max(0, 1 - t); 
        
//         ctx.shadowBlur = 22 * alpha * s;
//         ctx.shadowColor = cyanGlow;
//         ctx.strokeStyle = coreWhite;
//         ctx.globalAlpha = alpha;
//         ctx.lineWidth = 2.5 * (1 - t) * s;

//         if (i === 0) {
//             // --- SCALED WIDER HEAD ---
//             ctx.fillStyle = coreWhite;
//             ctx.beginPath();
//             ctx.moveTo(30*s, 0); 
//             ctx.quadraticCurveTo(15*s, -25*s, -20*s, -18*s); 
//             ctx.lineTo(-10*s, 0);
//             ctx.lineTo(-20*s, 18*s); 
//             ctx.quadraticCurveTo(15*s, 25*s, 30*s, 0);
//             ctx.fill();
//             ctx.stroke();

//             // --- TRACKING EYES ---
//             const eyeDX = mouse.x - seg.x;
//             const eyeDY = mouse.y - seg.y;
//             const eyeRelAngle = Math.atan2(eyeDY, eyeDX) - seg.angle;

//             [-1, 1].forEach(side => {
//                 ctx.save();
//                 ctx.translate(5*s, side * 10*s);
//                 ctx.fillStyle = "white";
//                 ctx.beginPath();
//                 ctx.arc(0, 0, 4.5*s, 0, Math.PI * 2);
//                 ctx.fill();
//                 ctx.fillStyle = "black";
//                 ctx.beginPath();
//                 ctx.arc(Math.cos(eyeRelAngle) * 2.5*s, Math.sin(eyeRelAngle) * 2.5*s, 2*s, 0, Math.PI * 2);
//                 ctx.fill();
//                 ctx.restore();
//             });
//         } else {
//             // HOOKED BONES
//             let vSize = 14 * (1 - t) * s;
//             ctx.beginPath();
//             ctx.moveTo(0, 0);
//             ctx.bezierCurveTo(-vSize, -vSize, -vSize * 3, -vSize * 0.5, -vSize * 2, 0);
//             ctx.bezierCurveTo(-vSize, vSize, -vSize * 3, vSize * 0.5, -vSize * 2, 0);
//             ctx.stroke();

//             // WIDE WINGS
//             let wingFactor = 0;
//             if (i < 35) wingFactor = Math.sin((i / 35) * Math.PI);
//             else if (i > 42 && i < 70) wingFactor = Math.sin(((i - 42) / 28) * Math.PI) * 0.6;

//             if (wingFactor > 0.05) {
//                 let wingLen = wingFactor * 155 * (1 - t) * s; 
//                 for (let j = 0; j < 4; j++) {
//                     ctx.beginPath();
//                     ctx.lineWidth = 0.6 * s;
//                     let spreadOffset = j * 8.5 * s; 
//                     ctx.moveTo(0, 0);
//                     ctx.bezierCurveTo(-wingLen * 0.2, -wingLen * 0.8, -wingLen * 0.8, -wingLen, -wingLen * 1.9, -spreadOffset);
//                     ctx.moveTo(0, 0);
//                     ctx.bezierCurveTo(-wingLen * 0.2, wingLen * 0.8, -wingLen * 0.8, wingLen, -wingLen * 1.9, spreadOffset);
//                     ctx.stroke();
//                 }
//             }
//         }
//         ctx.restore();
//         tx = seg.x; ty = seg.y;
//     });

//     requestAnimationFrame(animate);
// }

// animate();