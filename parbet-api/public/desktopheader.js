class ParbetDesktopHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .d-header-wrapper {
                    position: fixed; top: 0; left: 0; right: 0; height: 72px; background: #ffffff; z-index: 40;
                    transition: box-shadow 0.2s ease; border-bottom: 1px solid #e2e2e2;
                    display: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                @media (min-width: 768px) { .d-header-wrapper { display: block; } }
                .d-header-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; height: 100%; display: flex; justify-content: space-between; align-items: center; }
                .d-logo { font-size: 32px; font-weight: 900; letter-spacing: -1.5px; text-decoration: none; display: flex; align-items: center; }
                .d-logo-par { color: #54626c; }
                .d-logo-bet { color: #8cc63f; }
                .d-logo-tag { font-family: monospace; font-size: 14px; font-weight: bold; color: #54626c; margin-left: 8px; margin-top: 8px; letter-spacing: 0; background: #f8f9fa; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e2e2; }
                .d-nav { display: flex; height: 100%; align-items: center; }
                .d-nav-item { position: relative; height: 100%; display: flex; align-items: center; padding: 0 20px; cursor: pointer; color: #1a1a1a; font-size: 15px; font-weight: bold; transition: color 0.2s; text-decoration: none; }
                .d-nav-item:hover, .d-nav-item.active { color: #458731; }
                .d-user-icon { width: 36px; height: 36px; background: #f2f7ef; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 12px; }
            </style>
            <header class="d-header-wrapper" id="desktop-header-main">
                <div class="d-header-container">
                    <a href="/" class="d-logo">
                        <span class="d-logo-par">par</span><span class="d-logo-bet">bet</span>
                        <span class="d-logo-tag">/ api</span>
                    </a>
                    <nav class="d-nav">
                        <a href="/status.html" class="d-nav-item" id="nav-status">Status</a>
                        <div class="d-nav-item" id="nav-docs">Documentation</div>
                        <div class="d-nav-item" id="nav-support">Support</div>
                        <div class="d-nav-item" id="nav-profile">
                            Developer
                            <div class="d-user-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" style="width:22px; height:22px; color:#458731;">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        `;
        
        // FEATURE: Real-time Scroll Physics Engine
        window.addEventListener('scroll', () => {
            const header = document.getElementById('desktop-header-main');
            if (header) {
                if (window.scrollY > 10) {
                    header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                } else {
                    header.style.boxShadow = 'none';
                }
            }
        });
    }
}
// FEATURE: Register Native Web Component
customElements.define('parbet-desktop-header', ParbetDesktopHeader);