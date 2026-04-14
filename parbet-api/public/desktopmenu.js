class ParbetDesktopMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .d-dropdown {
                    position: absolute; top: 72px; background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                    border-radius: 0 0 4px 4px; border: 1px solid #e2e2e2; border-top: none;
                    padding: 8px 0; z-index: 50; opacity: 0; visibility: hidden; transform: translateY(5px);
                    transition: all 0.2s ease; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .d-dropdown.show { opacity: 1; visibility: visible; transform: translateY(0); }
                .d-dropdown-link { display: block; padding: 12px 24px; color: #1a1a1a; font-size: 15px; font-weight: 500; text-decoration: none; transition: background 0.2s; white-space: nowrap; }
                .d-dropdown-link:hover { background: #f8f9fa; color: #458731; }
            </style>
            <div id="dd-docs" class="d-dropdown" style="left: 0;">
                <a href="/docs.html#sendVerification" class="d-dropdown-link">Authentication API</a>
                <a href="/docs.html#createOrder" class="d-dropdown-link">Transactions API</a>
                <a href="/docs.html#sendTicketEmail" class="d-dropdown-link">Fulfillment API</a>
                <a href="/docs.html#webhookPayment" class="d-dropdown-link">Webhooks</a>
            </div>
            <div id="dd-support" class="d-dropdown" style="left: 0;">
                <a href="/docs.html" class="d-dropdown-link">Integration Guide</a>
                <a href="/status.html" class="d-dropdown-link">System Status</a>
                <a href="#" class="d-dropdown-link">API Limits</a>
                <a href="#" class="d-dropdown-link">Contact Engineering</a>
            </div>
            <div id="dd-profile" class="d-dropdown" style="right: 0;">
                <a href="#" class="d-dropdown-link">Developer Hub</a>
                <a href="#" class="d-dropdown-link">API Keys</a>
                <a href="#" class="d-dropdown-link" style="color: #c21c3a; font-weight: bold;">Sign out</a>
            </div>
        `;

        // Initialize engine after DOM settles
        setTimeout(() => this.attachHoverEngine(), 100);
    }

    // FEATURE: Advanced Debounced Hover Engine with Dynamic Positioning
    attachHoverEngine() {
        const attachHover = (triggerId, dropdownId) => {
            const trigger = document.getElementById(triggerId);
            const dropdown = document.getElementById(dropdownId);
            if (!trigger || !dropdown) return;

            let timeout;
            
            // FEATURE: Bounding Client Rect Dynamic Alignment
            const alignDropdown = () => {
                const rect = trigger.getBoundingClientRect();
                if(dropdownId === 'dd-profile') {
                    // Snaps to the right edge for the profile icon
                    dropdown.style.right = (window.innerWidth - rect.right) + 'px';
                    dropdown.style.left = 'auto';
                } else {
                    // Snaps left for standard text links
                    dropdown.style.left = rect.left + 'px';
                }
            };

            trigger.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                alignDropdown();
                trigger.style.color = '#458731';
                dropdown.classList.add('show');
            });

            trigger.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    trigger.style.color = '';
                    dropdown.classList.remove('show');
                }, 100);
            });

            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                trigger.style.color = '#458731';
                dropdown.classList.add('show');
            });

            dropdown.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    trigger.style.color = '';
                    dropdown.classList.remove('show');
                }, 100);
            });
        };

        attachHover('nav-docs', 'dd-docs');
        attachHover('nav-support', 'dd-support');
        attachHover('nav-profile', 'dd-profile');
    }
}
customElements.define('parbet-desktop-menu', ParbetDesktopMenu);