class ParbetMobileMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .m-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
                    z-index: 50; opacity: 0; visibility: hidden; transition: all 0.3s ease; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .m-overlay.open { opacity: 1; visibility: visible; }
                
                .m-drawer {
                    position: absolute; top: 76px; left: 16px; right: 16px; background: #ffffff; border-radius: 12px;
                    box-shadow: 0 16px 32px rgba(0,0,0,0.2); transform: scale(0.95) translateY(20px);
                    opacity: 0; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    max-height: calc(100vh - 100px); display: flex; flex-direction: column; overflow: hidden; padding: 8px 0; border: 1px solid #e2e2e2;
                }
                .m-overlay.open .m-drawer { transform: scale(1) translateY(0); opacity: 1; }

                .m-close-btn {
                    position: absolute; top: 16px; left: 16px; width: 42px; height: 42px; background: #ffffff;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #e2e2e2; cursor: pointer; color: #54626c; z-index: 51;
                    transform: translateY(-20px); opacity: 0; transition: all 0.3s ease 0.1s;
                }
                .m-overlay.open .m-close-btn { transform: translateY(0); opacity: 1; }
                
                .m-menu-content { overflow-y: auto; -webkit-overflow-scrolling: touch; }
                .m-menu-link { display: block; padding: 14px 24px; font-size: 15px; font-weight: 500; color: #1a1a1a; text-decoration: none; transition: background 0.2s; }
                .m-menu-link:active { background: #f8f9fa; color: #458731; }
                .m-divider { height: 1px; background: #e2e2e2; margin: 8px 24px; }
            </style>
            
            <div class="m-overlay" id="m-menu-overlay">
                <button class="m-close-btn" id="m-menu-close">
                    <!-- FEATURE: Exact Viagogo Close SVG -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
                        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="m-drawer" id="m-menu-drawer">
                    <div class="m-menu-content">
                        <a href="/" class="m-menu-link">API Gateway Home</a>
                        <a href="/status.html" class="m-menu-link">System Status</a>
                        <div class="m-divider"></div>
                        <a href="/docs.html" class="m-menu-link" style="font-weight: bold; color: #54626c;">DOCUMENTATION</a>
                        <a href="/docs.html#sendVerification" class="m-menu-link">Authentication API</a>
                        <a href="/docs.html#createOrder" class="m-menu-link">Transactions API</a>
                        <a href="/docs.html#sendTicketEmail" class="m-menu-link">Fulfillment API</a>
                        <a href="/docs.html#webhookPayment" class="m-menu-link">Webhooks</a>
                        <div class="m-divider"></div>
                        <a href="#" class="m-menu-link">Developer Profile</a>
                        <a href="#" class="m-menu-link">API Keys</a>
                        <a href="#" class="m-menu-link">Contact Engineering</a>
                        <a href="#" class="m-menu-link" style="color: #c21c3a; font-weight: bold;">Sign out</a>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => this.attachListeners(), 100);
    }

    attachListeners() {
        const overlay = document.getElementById('m-menu-overlay');
        const closeBtn = document.getElementById('m-menu-close');
        
        // FEATURE: Body Scroll-Lock Physics Engine
        const openMenu = () => {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        };

        const closeMenu = () => {
            overlay.classList.remove('open');
            document.body.style.overflow = ''; 
        };

        // FEATURE: Cross-Component Listener
        window.addEventListener('open-mobile-menu', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        
        // FEATURE: Intelligent Backdrop Click Detection
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMenu();
        });
    }
}
customElements.define('parbet-mobile-menu', ParbetMobileMenu);