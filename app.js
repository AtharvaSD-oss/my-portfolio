// Portfolio App JavaScript
class Portfolio3D {
    constructor() {
        this.init();
        this.setupNavigation();
        this.setupHero3D();
        this.setupAbout3D();
        this.setupContact3D();
        this.setupScrollAnimations();
        this.setupSkillAnimations();
        this.setupContactForm();
    }

    init() {
        // Initialize on DOM load
        document.addEventListener('DOMContentLoaded', () => {
            this.onWindowResize = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.onWindowResize);
        });
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Close mobile menu
                navMenu.classList.remove('active');
            });
        });

        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.querySelector('#about').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    setupHero3D() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create floating geometric shapes
        const shapes = [];
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.8, 32, 32),
            new THREE.TorusGeometry(0.6, 0.2, 16, 100),
            new THREE.ConeGeometry(0.6, 1.2, 32),
            new THREE.OctahedronGeometry(0.8, 0)
        ];

        const materials = [
            new THREE.MeshBasicMaterial({ 
                color: 0x06b6d4, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0x6366f1, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({ 
                color: 0x8b5cf6, 
                wireframe: true,
                transparent: true,
                opacity: 0.6
            })
        ];

        // Create multiple floating shapes
        for (let i = 0; i < 12; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)].clone();
            const mesh = new THREE.Mesh(geometry, material);

            // Random positioning
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            );

            // Random rotation
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Store initial position and random speeds
            mesh.userData = {
                initialPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatOffset: Math.random() * Math.PI * 2
            };

            shapes.push(mesh);
            scene.add(mesh);
        }

        // Camera positioning
        camera.position.z = 15;

        // Mouse interaction
        const mouse = new THREE.Vector2();
        let mouseX = 0, mouseY = 0;

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Animate shapes
            shapes.forEach((shape, index) => {
                // Rotation
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.rotation.z += shape.userData.rotationSpeed.z;

                // Floating motion
                const floatTime = time + shape.userData.floatOffset;
                shape.position.y = shape.userData.initialPosition.y + Math.sin(floatTime) * 0.5;
                shape.position.x = shape.userData.initialPosition.x + Math.cos(floatTime * 0.5) * 0.3;
            });

            // Mouse parallax effect
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Store for resize handling
        this.heroScene = { scene, camera, renderer, canvas, shapes };
    }

    setupAbout3D() {
        const canvas = document.getElementById('about-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Create interconnected nodes representing skills/connections
        const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x06b6d4, 
            transparent: true, 
            opacity: 0.4 
        });

        const nodes = [];
        const connections = [];

        // Create nodes
        for (let i = 0; i < 20; i++) {
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x06b6d4 : 0x6366f1,
                transparent: true,
                opacity: 0.8
            });

            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4
            );

            node.userData = {
                initialPosition: node.position.clone(),
                phase: Math.random() * Math.PI * 2
            };

            nodes.push(node);
            scene.add(node);
        }

        // Create connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                if (distance < 3) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        nodes[i].position,
                        nodes[j].position
                    ]);
                    const line = new THREE.Line(geometry, lineMaterial);
                    connections.push({ line, nodeA: nodes[i], nodeB: nodes[j] });
                    scene.add(line);
                }
            }
        }

        camera.position.set(0, 0, 8);

        const animate = () => {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Animate nodes
            nodes.forEach((node, index) => {
                const phase = time + node.userData.phase;
                node.position.x = node.userData.initialPosition.x + Math.sin(phase) * 0.5;
                node.position.y = node.userData.initialPosition.y + Math.cos(phase * 0.7) * 0.3;
                node.rotation.x += 0.01;
                node.rotation.y += 0.01;
            });

            // Update connections
            connections.forEach(connection => {
                const { line, nodeA, nodeB } = connection;
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodeA.position,
                    nodeB.position
                ]);
                line.geometry.dispose();
                line.geometry = geometry;
            });

            // Rotate entire scene slowly
            scene.rotation.y += 0.005;

            renderer.render(scene, camera);
        };

        animate();

        this.aboutScene = { scene, camera, renderer, canvas };
    }

    setupContact3D() {
        const canvas = document.getElementById('contact-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Create particle system
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Positions
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            // Colors
            const color = Math.random() > 0.5 ? 0x06b6d4 : 0x6366f1;
            const threeColor = new THREE.Color(color);
            colors[i * 3] = threeColor.r;
            colors[i * 3 + 1] = threeColor.g;
            colors[i * 3 + 2] = threeColor.b;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        camera.position.z = 20;

        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate particle system
            particleSystem.rotation.x += 0.001;
            particleSystem.rotation.y += 0.002;

            // Move particles
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 0.02; // Move down
                
                // Reset position if too low
                if (positions[i + 1] < -25) {
                    positions[i + 1] = 25;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        this.contactScene = { scene, camera, renderer, canvas };
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger skill progress animations
                    if (entry.target.id === 'skills') {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        // Add CSS classes for animations
        const style = document.createElement('style');
        style.textContent = `
            section {
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.8s ease-out;
            }
            
            section.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .skill-progress {
                width: 0 !important;
                transition: width 1.5s ease-out 0.5s;
            }
            
            .skills.animate-in .skill-progress {
                width: var(--skill-width) !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupSkillAnimations() {
        // Add hover effects to skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateY(5deg)';
                card.style.boxShadow = '0 25px 50px rgba(6, 182, 212, 0.3)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateY(0deg)';
                card.style.boxShadow = '';
            });
        });
    }

    animateSkillBars() {
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        
        skillProgressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.setProperty('--skill-width', width);
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            this.showFormMessage('Message sent successfully! Thank you for reaching out.', 'success');
            form.reset();
        });

        // Add floating label effects
        const formControls = document.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.addEventListener('focus', () => {
                control.parentElement.classList.add('focused');
            });

            control.addEventListener('blur', () => {
                if (!control.value) {
                    control.parentElement.classList.remove('focused');
                }
            });
        });
    }

    showFormMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#06b6d4' : '#ef4444'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(messageElement);

        // Animate in
        setTimeout(() => {
            messageElement.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            messageElement.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }, 3000);
    }

    onWindowResize() {
        // Resize hero scene
        if (this.heroScene) {
            const { camera, renderer, canvas } = this.heroScene;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }

        // Resize about scene
        if (this.aboutScene) {
            const { camera, renderer, canvas } = this.aboutScene;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }

        // Resize contact scene
        if (this.contactScene) {
            const { camera, renderer, canvas } = this.contactScene;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    }
}

// Initialize the portfolio
const portfolio = new Portfolio3D();

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll behavior to hero buttons
    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = btn.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add project card tilt effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Add parallax effect to section backgrounds
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            section.style.backgroundPosition = `center ${yPos}px`;
        });
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add CSS for loading state
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body:not(.loaded) {
            overflow: hidden;
        }
        
        body:not(.loaded)::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f35 50%, #2d1b69 100%);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease;
        }
        
        body.loaded::before {
            opacity: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(loadingStyle);
});