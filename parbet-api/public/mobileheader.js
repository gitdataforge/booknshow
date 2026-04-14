class ParbetMobileHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .m-header-wrapper {
                    position: fixed; top: 0; left: 0; right: 0; height: 64px; background: #ffffff; z-index: 40;
                    border-bottom: 1px solid #e2e2e2; display: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                @media (max-width: 767px) { .m-header-wrapper { display: block; } }
                .m-header-container { padding: 0 16px; height: 100%; display: flex; justify-content: space-between; align-items: center; }
                .m-btn { background: none; border: none; padding: 8px; margin-left: -8px; cursor: pointer; color: #54626c; display: flex; align-items: center; }
                .m-logo { font-size: 28px; font-weight: 900; letter-spacing: -1.5px; text-decoration: none; display: flex; align-items: center; position: absolute; left: 50%; transform: translateX(-50%); }
                .m-logo-par { color: #54626c; }
                .m-logo-bet { color: #8cc63f; }
                .m-logo-tag { font-family: monospace; font-size: 11px; font-weight: bold; color: #54626c; margin-left: 4px; margin-top: 6px; letter-spacing: 0; background: #f8f9fa; padding: 2px 4px; border-radius: 4px; border: 1px solid #e2e2e2; }
                .m-user-icon { width: 32px; height: 32px; background: #f2f7ef; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
            </style>
            <header class="m-header-wrapper" id="mobile-header-main">
                <div class="m-header-container">
                    <button class="m-btn" id="m-menu-trigger">
                        <!-- FEATURE: Exact Viagogo Mobile List SVG -->
                        <svg viewBox="0 0 24 24" fill="currentColor" style="width:26px;height:26px;">
                            <circle cx="4" cy="6" r="1.5"/><rect x="8" y="5" width="14" height="2" rx="1"/>
                            <circle cx="4" cy="12" r="1.5"/><rect x="8" y="11" width="14" height="2" rx="1"/>
                            <circle cx="4" cy="18" r="1.5"/><rect x="8" y="17" width="14" height="2" rx="1"/>
                        </svg>
                    </button>
                    <a href="/" class="m-logo">
                        <span class="m-logo-par">par</span><span class="m-logo-bet">bet</span>
                        <span class="m-logo-tag">/ api</span>
                    </a>
                    <div class="m-user-icon" id="m-user-trigger">
                        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px; height:20px; color:#458731;">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </div>
            </header>
        `;

        // FEATURE: Custom Event Dispatcher Architecture
        setTimeout(() => {
            const triggerMenu = () => window.dispatchEvent(new CustomEvent('open-mobile-menu'));
            document.getElementById('m-menu-trigger')?.addEventListener('click', triggerMenu);
            document.getElementById('m-user-trigger')?.addEventListener('click', triggerMenu);
        }, 100);
    }
}
customElements.define('parbet-mobile-header', ParbetMobileHeader);