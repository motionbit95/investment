// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced scroll reveal animations with stronger effects
const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // Animate titles
            const titles = entry.target.querySelectorAll('h1, h2');
            titles.forEach((title, index) => {
                setTimeout(() => {
                    title.classList.add('revealed');
                }, index * 100);
            });

            // Animate emoji icons
            const emojis = entry.target.querySelectorAll('.emoji-icon');
            emojis.forEach((emoji, index) => {
                setTimeout(() => {
                    emoji.classList.add('revealed');
                }, 100 + index * 100);
            });

            // Add staggered animation for cards
            const cards = entry.target.querySelectorAll('.perf-card, .ai-card, .benefit-card, .kakao-benefit-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('revealed');
                }, 200 + index * 150);
            });

            // Animate feature buttons
            const buttons = entry.target.querySelectorAll('.feature-btn');
            buttons.forEach((btn, index) => {
                setTimeout(() => {
                    btn.classList.add('revealed');
                }, 300 + index * 120);
            });

            // Animate table rows
            const tableRows = entry.target.querySelectorAll('.price-table tbody tr');
            tableRows.forEach((row, index) => {
                setTimeout(() => {
                    row.classList.add('revealed');
                }, index * 40);
            });
        }
    });
}, revealObserverOptions);

// Observe all sections and elements
document.querySelectorAll('section, .hero, .price-table-section').forEach(section => {
    section.classList.add('reveal');
    revealObserver.observe(section);
});

// Initialize elements for reveal animation
document.querySelectorAll('.perf-card, .ai-card, .benefit-card, .kakao-benefit-card, .feature-btn').forEach(el => {
    el.classList.add('reveal');
});

document.querySelectorAll('.price-table tbody tr').forEach(row => {
    row.classList.add('reveal');
});

document.querySelectorAll('section h1, section h2, .emoji-icon').forEach(el => {
    el.classList.add('reveal');
});

// Feature buttons
const featureButtons = document.querySelectorAll('.feature-btn');
featureButtons.forEach(button => {
    button.addEventListener('click', function() {
        alert(`${this.textContent} 기능을 준비중입니다.`);
    });
});

// AI card buttons
const aiButtons = document.querySelectorAll('.ai-btn');
aiButtons.forEach(button => {
    button.addEventListener('click', function() {
        const parent = this.closest('.ai-card');
        const label = parent.querySelector('.ai-label').textContent;
        alert(`${label} 정보를 확인합니다.`);
    });
});

// ===================================================================
// NOTE: CTA 버튼, 모달 기능, 전화번호 포맷팅은 signup-form.js에서 처리됩니다.
// Firebase 연동을 위해 해당 파일로 이동되었습니다.
// ===================================================================

// Add hover effects to table rows
const tableRows = document.querySelectorAll('.price-table tbody tr');
tableRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#333';
    });

    row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('ko-KR');
    }, 16);
}

// KakaoTalk button functionality
const kakaoButton = document.querySelector('.kakao-button');
if (kakaoButton) {
    kakaoButton.addEventListener('click', function(e) {
        e.preventDefault();
        // Replace with actual KakaoTalk channel URL
        alert('카카오톡 채널로 이동합니다!\n\n실제 서비스에서는 카카오톡 채널 URL로 연결됩니다.');
        // window.open('http://pf.kakao.com/_YOUR_CHANNEL_ID', '_blank');
    });
}

// Scroll Progress Bar
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollPercentage + '%';
    }
}

// Header Hide/Show on Scroll
let lastScrollTop = 0;
let scrollDelta = 0;
const header = document.querySelector('.partnership-header');
const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show

function updateHeaderOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDiff = scrollTop - lastScrollTop;

    // Add scrolled class when scrolled down
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Accumulate scroll delta
    scrollDelta += scrollDiff;

    // Only hide/show after scrolling a certain distance
    if (Math.abs(scrollDelta) > scrollThreshold) {
        if (scrollDelta > 0 && scrollTop > 200) {
            // Scrolling down significantly
            header.classList.add('header-hidden');
        } else if (scrollDelta < 0) {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        scrollDelta = 0; // Reset delta after action
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Smooth parallax effect for emoji icons and elements
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;

            // Update progress bar
            updateScrollProgress();

            // Update header
            updateHeaderOnScroll();

            // Parallax for emoji icons
            const emojiIcons = document.querySelectorAll('.emoji-icon');
            emojiIcons.forEach(icon => {
                const rect = icon.getBoundingClientRect();
                const speed = 0.3;
                const yPos = scrolled * speed;
                icon.style.transform = `translateY(${yPos * 0.05}px)`;
            });

            // Parallax for sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight && rect.bottom > 0) {
                    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const translateY = scrollProgress * 30;

                    // Subtle parallax on section backgrounds
                    const bgElements = section.querySelectorAll('.perf-card, .ai-card, .benefit-card');
                    bgElements.forEach((el, index) => {
                        const offset = (index % 2 === 0 ? 1 : -1) * translateY * 0.5;
                        el.style.transform = `translateY(${offset}px)`;
                    });
                }
            });

            ticking = false;
        });
        ticking = true;
    }
});

// Mouse move effect for cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.perf-card, .ai-card, .benefit-card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        }
    });
});

// Number Counter Animation
function animateNumber(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }

        if (suffix === '%') {
            // 소수점이 있으면 소수점 첫째자리까지, 없으면 정수로 표시
            const displayValue = target % 1 !== 0 ? current.toFixed(1) : Math.floor(current);
            element.textContent = displayValue + suffix;
        } else if (suffix === '만') {
            element.textContent = Math.floor(current) + '만 ' + (target % 10000 > 1000 ? Math.floor((target % 10000) / 1000) + '천' : '');
        } else {
            element.textContent = Math.floor(current).toLocaleString('ko-KR') + suffix;
        }
    }, 16);
}

// Animate SVG pie chart
function animatePieChart() {
    const svgCircles = document.querySelectorAll('.pie-chart-svg circle');
    svgCircles.forEach((circle, index) => {
        const length = circle.getTotalLength();
        circle.style.strokeDasharray = `${length} ${length}`;
        circle.style.strokeDashoffset = length;

        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 2.5s ease-in-out';
            circle.style.strokeDashoffset = '0';
        }, index * 400);
    });

    // Animate percentage
    const chartPercent = document.querySelector('.chart-percent');
    if (chartPercent) {
        animateNumber(chartPercent, 85.5, 2500, '%');
    }
}

// Number counter for performance cards
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');

            const text = entry.target.textContent;

            // Extract numbers from text
            if (text.includes('만')) {
                const match = text.match(/(\d+)만/);
                if (match) {
                    const number = parseInt(match[1]);
                    animateNumber(entry.target, number, 1500, '만');
                }
            } else if (text.includes('%')) {
                const match = text.match(/([\d.]+)%/);
                if (match) {
                    const number = parseFloat(match[1]);
                    animateNumber(entry.target, number, 1500, '%');
                }
            }
        }
    });
}, { threshold: 0.5 });

// Observe number elements
document.querySelectorAll('.perf-value, .ai-value').forEach(el => {
    numberObserver.observe(el);
});

// Intersection Observer for chart animation
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animatePieChart();
            chartObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const chartSection = document.querySelector('.chart-section');
if (chartSection) {
    chartObserver.observe(chartSection);
}

// Initialize animations when page loads
window.addEventListener('load', () => {
    // Fade in the header
    const header = document.querySelector('.partnership-header');
    if (header) {
        header.style.opacity = '0';
        header.style.transition = 'opacity 0.8s ease';
        setTimeout(() => {
            header.style.opacity = '1';
        }, 100);
    }

    // Animate numbers on load
    const perfValues = document.querySelectorAll('.perf-value');
    perfValues.forEach((value, index) => {
        setTimeout(() => {
            value.style.transition = 'transform 0.3s ease';
            value.style.transform = 'scale(1.15)';
            setTimeout(() => {
                value.style.transform = 'scale(1)';
            }, 300);
        }, 500 + index * 200);
    });

    // Add entrance animation to buttons
    const buttons = document.querySelectorAll('.feature-btn, .cta-button, .kakao-button');
    buttons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        setTimeout(() => {
            button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 200 + index * 100);
    });
});

// Dark Mode Toggle
(function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const body = document.body;

    // Apply saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);

        // Rotation animation
        this.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => this.style.transform = '', 400);
    });
})();
