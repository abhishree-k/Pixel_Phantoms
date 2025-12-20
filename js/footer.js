function renderFooter(basePath = '') {
    const footerHTML = `
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3 class="footer-title">Pixel Phantoms</h3>
                <p class="footer-description">Empowering the next generation of tech innovators through collaboration, learning, and creativity.</p>
                <div class="social-links">
    <button class="social-link github" data-url="https://github.com/sayeeg-11/Pixel_Phantoms" aria-label="GitHub">
    <i class="fab fa-github" aria-hidden="true"></i>
</button>

    <button class="social-link instagram" data-url="https://www.instagram.com/pixelphantoms_?igsh=aWxhbGhsM3piaHFj" aria-label="Instagram">
    <i class="fab fa-instagram" aria-hidden="true"></i>
</button>

    <button class="social-link discord" data-url="https://discord.com/channels/1049667734025289729/1440205974806986844" aria-label="Discord">
    <i class="fab fa-discord" aria-hidden="true"></i>
</button>

    <button class="social-link linkedin" data-url="https://www.linkedin.com/company/pixel-phantoms/" aria-label="LinkedIn">
    <i class="fab fa-linkedin" aria-hidden="true"></i>
</button>

    <button class="social-link email" data-url="mailto:contact@pixelphantoms.com" aria-label="Email">
    <i class="far fa-envelope" aria-hidden="true"></i>
</button>

</div>

            </div>
            <div class="footer-section">
                <h4 class="footer-subtitle">Quick Links</h4>
                <ul class="footer-links">
                    <li><a href="${basePath}about.html">About Us</a></li>
                    <li><a href="${basePath}events.html">Events</a></li>
                    <li><a href="${basePath}pages/contributors.html">Team</a></li>
                    <li><a href="${basePath}contact.html">Contact</a></li>
                    <li><a href="${basePath}pages/help.html">Help</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4 class="footer-subtitle">Resources</h4>
                <ul class="footer-links">
                    <li><a href="${basePath}pages/projects.html">Projects</a></li>
                    <li><a href="${basePath}pages/leaderboard.html">Leaderboard</a></li>
                    <li><a href="${basePath}pages/community.html">Community</a></li>
                    <li><a href="${basePath}pages/terms.html">Terms of Service</a></li>
                    <li><a href="${basePath}pages/privacy.html">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Pixel Phantoms. All rights reserved.</p>
        </div>
    </footer>
    `;

    document.getElementById('footer-placeholder').innerHTML = footerHTML;

    document.querySelectorAll('.social-links button').forEach(btn => {
    btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        window.open(url, '_blank');
    });
});



}

// Export function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter };
}
