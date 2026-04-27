import { useEffect, useCallback } from 'react';

/**
 * FEATURE 1: Hardware Back-Button Interceptor (Android & Desktop)
 * FEATURE 2: Swipe-to-Go-Back Prevention (iOS/Safari)
 * FEATURE 3: Accidental Tab Closure Prevention (beforeunload)
 * FEATURE 4: Memory Leak Prevention (Automated Event Listener Cleanup)
 * FEATURE 5: Dynamic State Re-pushing (History API Trap)
 * * A high-security hook that traps the user within a critical flow (like checkout).
 * It intercepts navigation attempts and forces the user to make an explicit 
 * decision (e.g., Pay or Cancel) to ensure database integrity and inventory release.
 *
 * @param {boolean} isLocked - Whether the navigation trap is currently active.
 * @param {function} onLockTriggered - Callback executed when the user attempts to escape.
 */
export default function useNavigationLock(isLocked, onLockTriggered) {
    
    // Handles Back Button / Swipe Gestures
    const handlePopState = useCallback((event) => {
        if (isLocked) {
            // TRAP: Push the current state back onto the history stack to cancel the navigation
            window.history.pushState(null, null, window.location.pathname + window.location.search);
            
            // Trigger the explicit cancellation UI (e.g., Warning Modal)
            if (typeof onLockTriggered === 'function') {
                onLockTriggered();
            }
        }
    }, [isLocked, onLockTriggered]);

    // Handles Tab Close / Browser Exit
    const handleBeforeUnload = useCallback((event) => {
        if (isLocked) {
            // Standard protocol for modern browsers to trigger the native "Leave Site?" warning
            event.preventDefault();
            event.returnValue = '';
        }
    }, [isLocked]);

    useEffect(() => {
        if (isLocked) {
            // INITIALIZE TRAP: Push a dummy state so the popstate event has something to catch
            window.history.pushState(null, null, window.location.pathname + window.location.search);

            // Mount aggressive event listeners
            window.addEventListener('popstate', handlePopState);
            window.addEventListener('beforeunload', handleBeforeUnload);

            // Cleanup function to prevent memory leaks when component unmounts or lock releases
            return () => {
                window.removeEventListener('popstate', handlePopState);
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [isLocked, handlePopState, handleBeforeUnload]);
}