// Central debug configuration for the Solar Orbit Predictor
// To disable all debug logging for production, just set ENABLE_DEBUG to false below

/** Global debug flag - set to false to disable all debug logging */
export const ENABLE_DEBUG = true;

/** Debug logging utility functions */
export const debugLogger = {
  /** Log info level debug messages */
  info: (message: string, ...args: any[]) => {
    if (ENABLE_DEBUG) console.log(`[DEBUG] ${message}`, ...args);
  },

  /** Log warning level debug messages */
  warn: (message: string, ...args: any[]) => {
    if (ENABLE_DEBUG) console.warn(`[DEBUG] ${message}`, ...args);
  },

  /** Log error level debug messages */
  error: (message: string, ...args: any[]) => {
    if (ENABLE_DEBUG) console.error(`[DEBUG] ${message}`, ...args);
  },

  /** Log performance/debugging info */
  perf: (message: string, ...args: any[]) => {
    if (ENABLE_DEBUG) console.log(`[PERF] ${message}`, ...args);
  },

  /** Memory usage monitoring */
  memory: (memInfo?: any) => {
    if (ENABLE_DEBUG && 'memory' in performance) {
      const info = memInfo || (performance as any).memory;
      const usedMB = Math.round(info.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(info.totalJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(info.jsHeapSizeLimit / 1024 / 1024);
      const usageRatio = info.usedJSHeapSize / info.jsHeapSizeLimit;

      console.log('[DEBUG] Memory usage:', {
        used: `${usedMB}MB`,
        total: `${totalMB}MB`,
        limit: `${limitMB}MB`
      });

      if (usageRatio > 0.8) {
        console.warn('[DEBUG] High memory usage detected:', `${(usageRatio * 100).toFixed(1)}%`);
      }
    }
  },

  /** Toggle debug mode at runtime (useful for development) */
  toggle: () => {
    const currentState = (window as any).__DEBUG_ENABLED;
    (window as any).__DEBUG_ENABLED = !currentState;
    console.log(`[DEBUG] Debug logging ${!currentState ? 'ENABLED' : 'DISABLED'}`);
    return !currentState;
  }
};

// Keyboard shortcut to toggle debug (Ctrl+Shift+D)
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault();
      debugLogger.toggle();
    }
  });

  // Make toggle function globally accessible for console debugging
  (window as any).toggleDebug = debugLogger.toggle;
}

// Initialize memory monitoring if enabled
if (ENABLE_DEBUG && typeof window !== 'undefined') {
  const memoryCheckInterval = setInterval(() => {
    debugLogger.memory();
  }, 10000); // Check every 10 seconds

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(memoryCheckInterval);
  });
}
