// Configuration & preferences
const DEBUG_SIGNUPS = false; // Set true to enable console tips and localStorage debug storage
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Particle Animation with Strong Attraction to Money Elements
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = reduceMotion 
        ? 0 
        : Math.max(20, Math.min(80, Math.round(window.innerWidth / 16)));
    
    // Get positions of Money text elements
    function getMoneyTargets() {
        const targets = [];
        const logoMoney = document.querySelector('.logo-money');
        const taglineMoney = document.querySelector('.tagline .highlight');
        
        if (logoMoney) {
            const rect = logoMoney.getBoundingClientRect();
            targets.push({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                strength: 2.5
            });
        }
        
        if (taglineMoney) {
            const rect = taglineMoney.getBoundingClientRect();
            targets.push({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                strength: 3.0
            });
        }
        
        return targets;
    }
    
    let moneyTargets = getMoneyTargets();
    
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.targetIndex = Math.floor(Math.random() * 2);
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.baseX = this.x;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = 0;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.maxOpacity = this.opacity;
            this.life = 1;
            this.targetIndex = Math.floor(Math.random() * 2);
            this.curveStrength = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            // Move upward
            this.y -= this.speedY;
            
            // Apply strong attraction to Money elements throughout the journey
            if (moneyTargets.length > 0) {
                const target = moneyTargets[this.targetIndex % moneyTargets.length];
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Start attraction earlier and make it stronger
                if (this.y < canvas.height * 0.8) {
                    // Calculate progress (0 to 1) from bottom to target
                    const progress = 1 - (this.y / canvas.height);
                    
                    // Exponential attraction that gets much stronger as particle rises
                    const attractionPower = Math.pow(progress, 1.5) * target.strength;
                    
                    // Strong curved path toward target
                    this.speedX += (dx / distance) * attractionPower * this.curveStrength;
                    this.speedY += (dy / Math.abs(dy)) * attractionPower * 0.3;
                    
                    // Apply horizontal movement with less damping for stronger curves
                    this.x += this.speedX;
                    this.speedX *= 0.92;
                    
                    // Fade out as it gets close to target
                    if (distance < 100) {
                        this.opacity = this.maxOpacity * (distance / 100);
                    }
                    
                    // Accelerate when very close
                    if (distance < 50) {
                        const pullForce = (50 - distance) / 50;
                        this.x += (dx / distance) * pullForce * 5;
                        this.y += (dy / distance) * pullForce * 5;
                        this.opacity *= 0.9;
                    }
                }
                
                // Reset if reached target
                if (distance < 10 || this.opacity < 0.01) {
                    this.reset();
                }
            }
            
            // Reset if went off screen
            if (this.y < -10 || this.x < -50 || this.x > canvas.width + 50) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#fbbf24';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#fbbf24';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Update target positions on resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        moneyTargets = getMoneyTargets();
    });
    
    // Update targets periodically in case of layout changes
    if (!reduceMotion) {
        setInterval(() => {
            moneyTargets = getMoneyTargets();
        }, 1000);
    }
}

// Parallax Effect for Skyline
function initParallax() {
    const skylineLayers = document.querySelectorAll('.skyline-layer');
    
    if (reduceMotion) return;
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        skylineLayers.forEach((layer, index) => {
            const depth = (index + 1) * 0.5;
            const moveX = mouseX * depth * 20;
            const moveY = mouseY * depth * 10;
            
            layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// Smooth Reveal Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Money Symbol Animation Enhancement with Strong Curved Attraction
function enhanceMoneyAnimation() {
    const moneySymbols = document.querySelectorAll('.money-symbol');
    const logoMoney = document.querySelector('.logo-money');
    const taglineMoney = document.querySelector('.tagline .highlight');
    
    // Get actual positions for targets
    let logoRect = logoMoney ? logoMoney.getBoundingClientRect() : null;
    let taglineRect = taglineMoney ? taglineMoney.getBoundingClientRect() : null;
    
    moneySymbols.forEach((symbol, index) => {
        symbol.style.left = `${5 + (index * 22)}%`;
        symbol.style.fontSize = `${2.5 + Math.random() * 2}rem`;
        
        // Create custom animation path that strongly curves toward Money text
        const duration = 12 + Math.random() * 8;
        symbol.style.animationDuration = `${duration}s`;
        symbol.style.animationDelay = `${index * 2.5}s`;
        
        // Add data attribute for targeting
        symbol.setAttribute('data-target', index % 2 === 0 ? 'logo' : 'tagline');
    });
    
    // Add CSS for strongly curved paths that converge on Money text
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-to-logo {
            0% {
                transform: translateY(100vh) translateX(0) rotate(0deg) scale(1);
                opacity: 0;
            }
            5% {
                opacity: 0.2;
            }
            20% {
                transform: translateY(60vh) translateX(-50px) rotate(45deg) scale(1.1);
                opacity: 0.25;
            }
            40% {
                transform: translateY(20vh) translateX(-150px) rotate(90deg) scale(1);
                opacity: 0.2;
            }
            60% {
                transform: translateY(-20vh) translateX(-250px) rotate(180deg) scale(0.9);
                opacity: 0.15;
            }
            80% {
                transform: translateY(-50vh) translateX(-350px) rotate(270deg) scale(0.7);
                opacity: 0.08;
            }
            95% {
                transform: translateY(-70vh) translateX(-400px) rotate(340deg) scale(0.4);
                opacity: 0.02;
            }
            100% {
                transform: translateY(-75vh) translateX(-420px) rotate(360deg) scale(0.2);
                opacity: 0;
            }
        }
        
        @keyframes float-to-tagline {
            0% {
                transform: translateY(100vh) translateX(0) rotate(0deg) scale(1);
                opacity: 0;
            }
            5% {
                opacity: 0.2;
            }
            20% {
                transform: translateY(70vh) translateX(80px) rotate(-45deg) scale(1.1);
                opacity: 0.25;
            }
            40% {
                transform: translateY(40vh) translateX(120px) rotate(-90deg) scale(1);
                opacity: 0.2;
            }
            60% {
                transform: translateY(10vh) translateX(100px) rotate(-180deg) scale(0.9);
                opacity: 0.15;
            }
            80% {
                transform: translateY(-15vh) translateX(50px) rotate(-270deg) scale(0.7);
                opacity: 0.08;
            }
            95% {
                transform: translateY(-25vh) translateX(20px) rotate(-340deg) scale(0.4);
                opacity: 0.02;
            }
            100% {
                transform: translateY(-30vh) translateX(0px) rotate(-360deg) scale(0.2);
                opacity: 0;
            }
        }
        
        .money-symbol[data-target="logo"] {
            animation-name: float-to-logo !important;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .money-symbol[data-target="tagline"] {
            animation-name: float-to-tagline !important;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .money-symbol {
            font-weight: bold;
            text-shadow: 
                0 0 20px rgba(251, 191, 36, 0.6),
                0 0 40px rgba(251, 191, 36, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Loader Animation
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            initScrollAnimations();
        }, 1500);
    });
}

// Dynamic Gradient Background
function initDynamicGradient() {
    let gradientAngle = 180;
    const skylineBg = document.querySelector('.skyline-bg');
    
    if (reduceMotion) return;
    setInterval(() => {
        gradientAngle = (gradientAngle + 1) % 360;
        if (gradientAngle % 90 === 0) {
            skylineBg.style.background = `linear-gradient(${gradientAngle}deg, 
                #0f172a 0%, 
                #1e3a8a 40%, 
                #3730a3 70%, 
                #581c87 100%)`;
        }
    }, 100);
}

// Interactive Feature Cards
function initFeatureInteraction() {
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02) rotateX(5deg)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0)';
        });
        
        feature.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// Typing Effect for Tagline
function initTypingEffect() {
    const words = document.querySelectorAll('.tagline .word');
    
    words.forEach((word, index) => {
        word.style.opacity = '0';
        setTimeout(() => {
            word.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            word.style.opacity = '1';
            word.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                word.style.transform = 'scale(1)';
            }, 200);
        }, index * 200);
    });
}

// CTA Button Pulse
function initCTAPulse() {
    const ctaButton = document.querySelector('.cta-primary');
    if (!ctaButton || reduceMotion) return;
    setInterval(() => {
        ctaButton.style.animation = 'none';
        setTimeout(() => {
            ctaButton.style.animation = 'pulse 0.5s ease';
        }, 10);
    }, 5000);
}

// Add pulse animation to styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Email Form Handler using Formspree
function initEmailForm() {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalBtnText = btnText.textContent;
    
    // Check if Formspree is configured
    if (form.action.includes('YOUR_FORM_ID') && DEBUG_SIGNUPS) {
        console.log('To enable email notifications, create a Formspree form and replace YOUR_FORM_ID in index.html.');
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        btnText.textContent = 'Subscribing';
        
        try {
            // Check if Formspree is configured
            if (form.action.includes('YOUR_FORM_ID')) {
                // Formspree not configured - do NOT store emails locally by default
                showMessage('Signup temporarily unavailable. Please try again later.', 'error');
            } else {
                // Send via Formspree
                const formData = new FormData();
                formData.append('email', email);
                formData.append('_subject', 'New Chicago Money Subscriber');
                formData.append('message', `New subscriber for Chicago\'s Money: ${email}`);
                formData.append('signup_date', new Date().toLocaleString());
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    showMessage('Success! You\'ll be the first to know when we launch.', 'success');
                    emailInput.value = '';
                    // Optional debug-only local backup
                    if (DEBUG_SIGNUPS) {
                        const signups = JSON.parse(localStorage.getItem('email_signups') || '[]');
                        signups.push({ email, date: new Date().toLocaleString(), status: 'sent' });
                        localStorage.setItem('email_signups', JSON.stringify(signups));
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            }
            
            // Add success animation
            form.classList.add('success');
            setTimeout(() => form.classList.remove('success'), 3000);
            
        } catch (error) {
            console.error('Submission error:', error);
            showMessage('Something went wrong. Please try again.', 'error');
            // Optional debug-only fallback storage
            if (DEBUG_SIGNUPS) {
                const signups = JSON.parse(localStorage.getItem('email_signups') || '[]');
                signups.push({ email, date: new Date().toLocaleString(), status: 'pending' });
                localStorage.setItem('email_signups', JSON.stringify(signups));
            }
        } finally {
            submitBtn.classList.remove('loading');
            btnText.textContent = originalBtnText;
        }
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message show ' + type;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }
    
    // Add email input animation
    emailInput.addEventListener('focus', () => {
        form.parentElement.style.transform = 'scale(1.02)';
    });
    
    emailInput.addEventListener('blur', () => {
        form.parentElement.style.transform = 'scale(1)';
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    if (!reduceMotion) {
        initParticles();
        initParallax();
        enhanceMoneyAnimation();
        initCTAPulse();
        setTimeout(initTypingEffect, 1600);
    }
    initLoader();
    initFeatureInteraction();
    initEmailForm();
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = e.target.getAttribute('href');
        if (target && target !== '#' && target.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(target);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Add version querystring to force SW update on changes
        navigator.serviceWorker.register('/sw.js?v=2025-09-30a')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
                
                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New update available
                            if (confirm('New version available! Reload to update?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
    
    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}
