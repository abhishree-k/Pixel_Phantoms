/**
 * Custom Cursor Effect - Site-wide Implementation
 * Provides a smooth glowing cursor follow effect on desktop devices
 *
 * Features:
 * - Auto-initializes on DOMContentLoaded
 * - Auto-creates cursor element if missing
 * - Works without GSAP (uses native requestAnimationFrame)
 * - Respects touch devices (auto-hides)
 * - Performance optimized with RAF
 * - Singleton pattern (prevents duplicates)
 * - Dynamic glowing particles on mouse movement
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.cursorEffectInitialized) {
    return;
  }
  window.cursorEffectInitialized = true;

  /**
   * Initialize cursor effect on page load
   */
  function initCursorEffect() {
    // Only run on desktop devices with fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    // Check if we're on a mobile viewport
    if (window.innerWidth <= 768) {
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get or create cursor element
    let cursor = document.getElementById('cursor-highlight');

    if (!cursor) {
      // Auto-create cursor element if it doesn't exist
      cursor = document.createElement('div');
      cursor.id = 'cursor-highlight';
      document.body.appendChild(cursor);
    }

    // Current cursor position
    let mouseX = 0;
    let mouseY = 0;

    // Current cursor element position
    let cursorX = 0;
    let cursorY = 0;

    // Animation speed (lower = smoother but slower)
    const speed = 0.15;

    // Particle system
    const particles = [];
    const maxParticles = 20;
    let lastParticleTime = 0;
    const particleThrottle = 50; // ms between particles

    /**
     * Create a glowing particle at cursor position
     */
    function createParticle(x, y) {
      if (prefersReducedMotion) return;

      const now = Date.now();
      if (now - lastParticleTime < particleThrottle) {
        return;
      }
      lastParticleTime = now;

      // Remove old particles if we have too many
      if (particles.length >= maxParticles) {
        const oldParticle = particles.shift();
        if (oldParticle && oldParticle.parentNode) {
          oldParticle.parentNode.removeChild(oldParticle);
        }
      }

      // Create new particle
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Random size variation
      const size = 6 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random offset for visual interest
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      particle.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(0)`;

      document.body.appendChild(particle);
      particles.push(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        const index = particles.indexOf(particle);
        if (index > -1) {
          particles.splice(index, 1);
        }
      }, 1500);
    }

    /**
     * Update mouse position on mousemove
     */
    function updateMousePosition(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Create particle on mouse movement (throttled)
      createParticle(mouseX, mouseY);
    }

    /**
     * Animate cursor to follow mouse smoothly
     */
    function animateCursor() {
      // Calculate distance to move
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;

      // Apply easing
      cursorX += distX * speed;
      cursorY += distY * speed;

      // Update cursor position
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

      // Continue animation loop
      requestAnimationFrame(animateCursor);
    }

    // Start listening to mouse movement
    document.addEventListener('mousemove', updateMousePosition, { passive: true });

    // Start animation loop
    requestAnimationFrame(animateCursor);

    // Handle window resize (hide on mobile if resized)
    let resizeTimeout;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (window.innerWidth <= 768) {
            cursor.style.display = 'none';
            // Clean up particles
            particles.forEach(particle => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            });
            particles.length = 0;
          } else if (window.matchMedia('(pointer: fine)').matches) {
            cursor.style.display = 'block';
          }
        }, 150);
      },
      { passive: true }
    );

    // Handle visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cursor.style.opacity = '0';
      } else {
        cursor.style.opacity = '';
      }
    });

    // Clean up particles on page unload
    window.addEventListener('beforeunload', () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorEffect);
  } else {
    // DOM already loaded
    initCursorEffect();
  }
})();
