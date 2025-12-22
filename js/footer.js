function renderFooter(basePath = '') {
    const footerHTML = `
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3 class="footer-title">Pixel Phantoms</h3>
                <p class="footer-description">Empowering the next generation of tech innovators through collaboration, learning, and creativity.</p>
                <div class="social-links">
    <a
  href="https://github.com/sayeeg-11/Pixel_Phantoms"
  target="_blank"
  rel="noopener noreferrer"
  class="social-link github"
  aria-label="GitHub"
>
  <i class="fab fa-github"></i>
</a>

    <a
  href="https://www.instagram.com/pixelphantoms_?igsh=aWxhbGhsM3piaHFj"
  target="_blank"
  rel="noopener noreferrer"
  class="social-link instagram"
  aria-label="Instagram"
>
  <i class="fab fa-instagram" aria-hidden="true"></i>
</a>

<a
  href="https://discord.com/channels/1049667734025289729/1440205974806986844"
  target="_blank"
  rel="noopener noreferrer"
  class="social-link discord"
  aria-label="Discord"
>
  <i class="fab fa-discord" aria-hidden="true"></i>
</a>

<a
  href="https://www.linkedin.com/company/pixel-phantoms/"
  target="_blank"
  rel="noopener noreferrer"
  class="social-link linkedin"
  aria-label="LinkedIn"
>
  <i class="fab fa-linkedin" aria-hidden="true"></i>
</a>

<a
  href="mailto:contact@pixelphantoms.com"
  class="social-link email"
  aria-label="Email"
>
  <i class="far fa-envelope" aria-hidden="true"></i>
</a>

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

}

// Export function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter };
}
