/**
 * Jyotii Setu - Premium Astrology Website Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. PAGE LOADER
       ========================================== */
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 600); // Small delay to let initial animations settle
        }
    });

    /* ==========================================
       2. MOBILE NAVIGATION DRAWERS & SCROLL EVENTS
       ========================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const mainHeader = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section, #numerology');

    // Toggle menu drawer
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && navMenu) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Sticky Header Scroll effect & Section tracking
    window.addEventListener('scroll', () => {
        // Sticky Header shrink
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Floating Scroll-to-Top visibility
        const scrollToTop = document.getElementById('scrollToTop');
        if (scrollToTop) {
            if (window.scrollY > 300) {
                scrollToTop.classList.add('show');
            } else {
                scrollToTop.classList.remove('show');
            }
        }

        // Active link tracker based on scroll position
        let currentSec = 'home';
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            const secTop = rect.top + window.scrollY - 130;
            const secHeight = sec.clientHeight || rect.height;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSec = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSec}`) {
                link.classList.add('active');
            }
        });
    });

    // Scroll to Top action
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* ==========================================
       3. INTERACTIVE GALAXY PARTICLES (CANVAS)
       ========================================== */
    const canvas = document.getElementById('galaxyCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let numStars = 120;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            
            // Adjust number of stars based on width
            if (window.innerWidth < 768) {
                numStars = 50;
            } else {
                numStars = 120;
            }
            initStars();
        }

        // Star Blueprint
        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.15;
                this.speedY = (Math.random() - 0.5) * 0.15;
                this.color = Math.random() > 0.4 ? '#D4AF37' : '#F5D77A'; // gold variations
                this.alpha = Math.random() * 0.7 + 0.3;
                this.pulseSpeed = Math.random() * 0.02 + 0.005;
                this.pulseDir = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                // Drift movement
                this.x += this.speedX + (mouseX * 0.015);
                this.y += this.speedY + (mouseY * 0.015);

                // Boundary wrap
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Pulsate opacity
                this.alpha += this.pulseSpeed * this.pulseDir;
                if (this.alpha >= 1 || this.alpha <= 0.2) {
                    this.pulseDir *= -1;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                
                // Add soft glowing shadows to brighter stars
                if (this.size > 1.2) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = this.color;
                }
                
                ctx.fill();
                ctx.restore();
            }
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        }

        // Mouse interaction
        window.addEventListener('mousemove', (e) => {
            // Get mouse position relative to canvas
            const rect = canvas.getBoundingClientRect();
            targetMouseX = (e.clientX - rect.left - (canvas.width / 2)) / 50;
            targetMouseY = (e.clientY - rect.top - (canvas.height / 2)) / 50;
        });

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Lerp mouse coordinates for smooth easing
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        animate();
    }


    /* ==========================================
       4. TESTIMONIALS SLIDER
       ========================================== */
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let activeTestimonial = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
        if (!testimonialCarousel) return;
        const slides = document.querySelectorAll('.testimonial-slide');
        if (slides.length === 0) return;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Wrap around bounds
        if (index >= slides.length) activeTestimonial = 0;
        else if (index < 0) activeTestimonial = slides.length - 1;
        else activeTestimonial = index;

        // Slide animation (translate X matching index)
        slides.forEach(slide => {
            slide.style.transform = `translateX(-${activeTestimonial * 100}%)`;
        });

        dots[activeTestimonial].classList.add('active');
    }

    // Set up click listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showTestimonial(activeTestimonial + 1);
        }, 6000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (testimonialCarousel) {
        startAutoSlide();
    }


    /* ==========================================
       5. FAQ ACCORDION
       ========================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            
            // Check if active
            const isActive = item.classList.contains('active');
            
            // Close all active accordions first
            document.querySelectorAll('.accordion-item').forEach(acc => {
                acc.classList.remove('active');
                acc.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });


    /* ==========================================
       6. CHALDEAN BRAND NUMEROLOGY CALCULATOR
       ========================================== */
    const calculateBrandBtn = document.getElementById('calculateBrandBtn');
    const brandNameInput = document.getElementById('brandNameInput');
    const calcResult = document.getElementById('calcResult');
    const vibrationNum = document.getElementById('vibrationNum');
    const vibrationVibe = document.getElementById('vibrationVibe');
    const vibrationDesc = document.getElementById('vibrationDesc');

    // Chaldean numerology letter grid mapping
    const chaldeanValues = {
        'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
        'B': 2, 'K': 2, 'R': 2,
        'C': 3, 'G': 3, 'L': 3, 'S': 3,
        'D': 4, 'M': 4, 'T': 4,
        'E': 5, 'H': 5, 'N': 5, 'X': 5,
        'U': 6, 'V': 6, 'W': 6,
        'O': 7, 'Z': 7,
        'F': 8, 'P': 8
    };

    // Numerology explanations for single digits
    const singleDigitVibes = {
        1: {
            vibe: "Divine Leadership & Sun Power",
            desc: "Extremely strong vibration representing power, creation, and pathfinding. Excellent for individual brands, consulting firms, innovative technology, and leadership structures. Fosters pioneer energy and authority."
        },
        2: {
            vibe: "Moon Harmony & Collaborative Energy",
            desc: "Vibration of peace, cooperation, intuition, and diplomacy. Suitable for partnerships, medical clinics, consulting, organic beauty products, and wellness hubs. Promotes connection and customer loyalty."
        },
        3: {
            vibe: "Jupiter Expansion & Artistic Wisdom",
            desc: "Lucky growth vibration. Fosters extreme creativity, media communication, educational success, expansion, and travel. Excellent for creative agencies, schools, writing, publishing, and global companies."
        },
        4: {
            vibe: "Rahu/Uranus Innovation & Structured Order",
            desc: "Vibration of discipline, structure, hard-working stability, and sudden breakthroughs. Ideal for building design, architecture, engineering firms, financial accounting, and solid hardware infrastructure."
        },
        5: {
            vibe: "Mercury Velocity & Business Magnetism",
            desc: "Highly auspicious vibration for retail commerce, trade, fast communication, digital networks, and marketing agencies. Fosters high speed, flexible pivots, excellent sales skills, and profit generation."
        },
        6: {
            vibe: "Venus Luxury, Artistry & Healing Harmony",
            desc: "Vibration of supreme beauty, luxury, wealth attraction, hospitality, interior styling, and deep healing services. Best for fashion brands, jewelry, premium restaurants, holistic clinics, and spiritual consultants."
        },
        7: {
            vibe: "Ketu/Neptune Spiritual Wisdom & Mystic Depth",
            desc: "Vibration of deep analysis, research, intuition, and spiritual alignment. Outstanding for yoga academies, metaphysics, spiritual consultants, research labs, coding units, and occult services."
        },
        8: {
            vibe: "Saturn Power, Karmic Scales & Wealth Pillars",
            desc: "Heavy weight vibration of karma, authority, law, material scale, and long-term structures. Perfect for legal chambers, real estate infrastructure, mining, solid trust foundations, and long-term asset management."
        },
        9: {
            vibe: "Mars Courage, Fire & Universal Action",
            desc: "High energy vibration of fire, action, humanitarian completion, courage, and protective security. Highly suited for protective services, health surgery, sports merchandise, social campaigns, and dynamic events."
        }
    };

    function calculateChaldeanNumerology(name) {
        if (!name || name.trim() === '') return null;
        
        let sum = 0;
        const cleanedName = name.toUpperCase().replace(/[^A-Z]/g, '');

        for (let i = 0; i < cleanedName.length; i++) {
            const letter = cleanedName[i];
            if (chaldeanValues[letter]) {
                sum += chaldeanValues[letter];
            }
        }

        if (sum === 0) return null;

        // Reduce to single digit
        let singleDigit = sum;
        while (singleDigit > 9) {
            let temp = 0;
            const digits = singleDigit.toString();
            for (let i = 0; i < digits.length; i++) {
                temp += parseInt(digits[i]);
            }
            singleDigit = temp;
        }

        return {
            compound: sum,
            single: singleDigit
        };
    }

    if (calculateBrandBtn && brandNameInput) {
        calculateBrandBtn.addEventListener('click', () => {
            const nameVal = brandNameInput.value;
            const result = calculateChaldeanNumerology(nameVal);

            if (result) {
                vibrationNum.textContent = `${result.compound} (${result.single})`;
                
                const vibeInfo = singleDigitVibes[result.single];
                if (vibeInfo) {
                    vibrationVibe.textContent = vibeInfo.vibe;
                    vibrationDesc.textContent = vibeInfo.desc;
                }
                
                calcResult.classList.remove('hidden');
            } else {
                calcResult.classList.add('hidden');
                alert('Please enter a valid brand name containing alphabet letters.');
            }
        });

        // Trigger on enter key
        brandNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateBrandBtn.click();
            }
        });
    }


    /* ==========================================
       7. BUSINESS NUMEROLOGY FLYER LIGHTBOX VIEW
       ========================================== */
    const flyerContainer = document.querySelector('.numerology-flyer-container');
    if (flyerContainer) {
        flyerContainer.addEventListener('click', () => {
            flyerContainer.classList.toggle('lightbox-active');
            
            // Toggle body scroll locking
            if (flyerContainer.classList.contains('lightbox-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }


    /* ==========================================
       8. KARMKAND SERVICES AUTOMATIC SELECT & SCROLL
       ========================================== */
    const ritualItems = document.querySelectorAll('.ritual-item');
    const serviceSelection = document.getElementById('serviceSelection');

    ritualItems.forEach(item => {
        const bookBtn = item.querySelector('.btn-ritual-book');
        const ritualName = item.getAttribute('data-ritual');

        if (bookBtn && ritualName && serviceSelection) {
            bookBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering parent item click if any
                
                // Select value in form
                serviceSelection.value = ritualName;
                
                // Scroll to booking form
                const bookingForm = document.getElementById('booking');
                if (bookingForm) {
                    bookingForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Put focus on input
                    setTimeout(() => {
                        const nameField = document.getElementById('fullName');
                        if (nameField) nameField.focus();
                    }, 800);
                }
            });
        }
    });

    // Also link service cards "Consult Now" clicks to form
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const consultLink = card.querySelector('.service-link');
        const serviceName = card.getAttribute('data-service');

        if (consultLink && serviceName && serviceSelection) {
            consultLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                serviceSelection.value = serviceName;
                const bookingForm = document.getElementById('booking');
                if (bookingForm) {
                    bookingForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    setTimeout(() => {
                        const nameField = document.getElementById('fullName');
                        if (nameField) nameField.focus();
                    }, 800);
                }
            });
        }
    });


    /* ==========================================
       9. SEO BLOGS MODAL WITH DETAILED POSTS
       ========================================== */
    const blogCards = document.querySelectorAll('.blog-card');
    const blogModal = document.getElementById('blogModal');
    const closeBlogModal = document.getElementById('closeBlogModal');
    const blogModalBody = document.getElementById('blogModalBody');

    // Local Blog content database
    const blogDb = {
        1: {
            title: "Understanding Saturn's Sade Sati Remedies",
            tag: "Astrology",
            date: "July 18, 2026",
            body: `
                <p>Is Saturn causing delays, career obstacles, or stress in your life? You might be undergoing the Saturn Sade Sati transit—a seven-and-a-half-year period of restructuring ruled by the cosmic taskmaster, Shani Dev.</p>
                <p>In Vedic astrology, Shani is not a malefic force to be feared, but a teacher enforcing karmic lessons. Sade Sati begins when Saturn enters the zodiac sign immediately preceding your natal Moon, and continues as it transits over the Moon and the sign following it.</p>
                <h3>Powerful Saturday Remedies to Calm Shani Dev:</h3>
                <ul>
                    <li><strong>Mustard Oil Lamp (Diya):</strong> Light a sesame or mustard oil diya under a Peepal tree on Saturday evenings. Add black sesame seeds inside the oil.</li>
                    <li><strong>Mantra Chanting:</strong> Chant the Shani Beej Mantra: <em>"Om Pram Preem Prom Sah Shanaishcharaya Namah"</em> 108 times using a Rudraksha mala.</li>
                    <li><strong>Charity & Donations:</strong> Donate black blankets, mustard oil, or iron items to the underprivileged. Shani rewards those who serve the poor and helpless.</li>
                    <li><strong>Worship Lord Hanuman:</strong> Lord Hanuman saved Shani Dev from Ravan's cage. Worshiping Lord Hanuman on Saturdays is believed to mitigate Shani's harsh transits.</li>
                </ul>
                <p>Consult with Jyotii Setu for an exact analysis of your birth chart, and receive customized remedy plans targeting the specific phase of your Sade Sati transit.</p>
            `
        },
        2: {
            title: "Lucky Numbers for Financial Growth",
            tag: "Numerology",
            date: "July 10, 2026",
            body: `
                <p>Numbers are not just units of measurement—they are carriers of celestial energy. Every number resonates on a specific frequency that can attract wealth or introduce resistance. By understanding your Destiny and Psychic numbers, you can unlock a financial abundance pathway.</p>
                <p>Numerology allows you to locate numbers representing growth, select lucky dates for registration, and align your bank account and mobile numbers to match financial gains.</p>
                <h3>How to Calculate and Use Your Wealth Numbers:</h3>
                <ul>
                    <li><strong>Mercury Vibe (Number 5):</strong> The number of speed, commerce, and transactions. Highly favorable for cash box numbers and digital assets.</li>
                    <li><strong>Venus Vibe (Number 6):</strong> The vibration of luxury, grand attraction, and wealth. Adding compound values of 6 to brand names attracts elite customers and increases margins.</li>
                    <li><strong>Sun Vibe (Number 1):</strong> Power, creation, and authority. Excellent for company names to achieve dominance and high branding credibility.</li>
                </ul>
                <p>To use these numbers effectively, you can adjust the letters of your signature, choose building suite numbers that sum to your lucky numbers, or plan commercial releases on days representing your friendly planetary vibrations.</p>
                <p>Speak to our Business Numerologist at Jyotii Setu to execute a complete audit of your brand and company identity.</p>
            `
        },
        3: {
            title: "Chakra Cleansing Hacks for Daily Energy",
            tag: "Healing",
            date: "June 28, 2026",
            body: `
                <p>Do you feel constant mental exhaustion, unexplained anxiety, or physical drainage despite sleeping well? Your energetic aura and chakras might be clogged with dense daily frequencies and stress residues from your office surroundings.</p>
                <p>Our body houses seven major chakras acting as spiritual dynamos. When these chakras spin slowly or get blocked by toxic cords, energy gets stuck, resulting in listlessness and creative dry spells.</p>
                <h3>Quick 5-Minute Healing Routines:</h3>
                <ul>
                    <li><strong>Crown Alignment with Amethyst:</strong> Sit straight and place a raw amethyst crystal above your head or hold it in your hand. Breathe deeply, visualizing purple light washing over your skull.</li>
                    <li><strong>Root Grounding:</strong> Connect with Earth. Walk barefoot on green grass for 5 minutes, visualizing negative static discharging from your soles.</li>
                    <li><strong>Aura Cleansing Bath:</strong> Add Epsom salt or Himalayan rock salt into warm bath water. Salt has natural mineral shields that break energetic ties and draw toxins out of your auric layer.</li>
                    <li><strong>Chant Seed Sounds:</strong> Reciting seed sounds (LAM for Root, VAM for Sacral, RAM for Solar Plexus, YAM for Heart, HAM for Throat, OM for Third Eye) vibrates endocrine centers and forces energy blocks to dissolve.</li>
                </ul>
                <p>If you feel heavy negative entities, toxic attachments, or require aura sealing, schedule a custom Angel and Reiki Healing session with Jyotii Setu.</p>
            `
        }
    };

    function openBlog(id) {
        if (!blogModal || !blogModalBody) return;
        const post = blogDb[id];
        if (!post) return;

        blogModalBody.innerHTML = `
            <span class="blog-tag">${post.tag}</span>
            <div class="modal-meta">Published: ${post.date} | Jyotii Setu Insights</div>
            <h2>${post.title}</h2>
            <div class="blog-full-content">
                ${post.body}
            </div>
            <a href="#booking" class="btn btn-primary-gold btn-modal-book" style="margin-top: 30px;">Book Advisory Session</a>
        `;

        blogModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Add handler for booking button inside modal
        const modalBookBtn = blogModalBody.querySelector('.btn-modal-book');
        if (modalBookBtn && serviceSelection) {
            modalBookBtn.addEventListener('click', () => {
                serviceSelection.value = "Vedic Astrology"; // default selection
                blogModal.classList.remove('show');
                document.body.style.overflow = '';
                
                setTimeout(() => {
                    const bookingForm = document.getElementById('booking');
                    if (bookingForm) bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 400);
            });
        }
    }

    blogCards.forEach(card => {
        const readBtn = card.querySelector('.btn-read-more');
        const blogId = card.getAttribute('data-blog-id');
        
        if (readBtn && blogId) {
            readBtn.addEventListener('click', () => {
                openBlog(blogId);
            });
        }
    });

    if (closeBlogModal) {
        closeBlogModal.addEventListener('click', () => {
            blogModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside modal box
    window.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            blogModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });


    /* ==========================================
       10. CONSULTATION FORM HANDLER
       ========================================== */
    const consultationForm = document.getElementById('consultationForm');
    const formSuccess = document.getElementById('formSuccess');

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple frontend validation
            const name = document.getElementById('fullName').value;
            const phone = document.getElementById('phoneNumber').value;
            const email = document.getElementById('emailAddress').value;
            const date = document.getElementById('preferredDate').value;
            const time = document.getElementById('preferredTime').value;
            const service = document.getElementById('serviceSelection').value;
            const msg = document.getElementById('formMessage').value;

            // Log details (mock backend transmission)
            console.log("Booking submission received:", { name, phone, email, date, time, service, msg });

            // Display success alert with dynamic slot detail injection
            if (formSuccess) {
                const successMsgElement = formSuccess.querySelector('p');
                if (successMsgElement) {
                    successMsgElement.innerHTML = `Thank you for choosing Jyotii Setu, <strong>${name}</strong>. We have received your request for a <strong>${service}</strong> consultation on <strong>${date}</strong> at <strong>${time}</strong>. We are aligning your details and will contact you within 2 hours to confirm your consultation slot.`;
                }
                formSuccess.classList.remove('hidden');
                
                // Construct pre-filled WhatsApp message URL
                const whatsappText = `Hello Jyotii Setu, I would like to book a consultation:\n\n` +
                                     `• Name: ${name}\n` +
                                     `• Phone: ${phone}\n` +
                                     `• Email: ${email}\n` +
                                     `• Service: ${service}\n` +
                                     `• Date: ${date}\n` +
                                     `• Time Slot: ${time}\n` +
                                     `• Message/Birth Details: ${msg || 'None'}`;
                
                const encodedText = encodeURIComponent(whatsappText);
                const whatsappUrl = `https://wa.me/917831955255?text=${encodedText}`;
                
                // Open in new tab
                window.open(whatsappUrl, '_blank');
                
                // Reset form values
                consultationForm.reset();
                
                // Hide alert after 10 seconds
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 10000);
            }
        });
    }

});
