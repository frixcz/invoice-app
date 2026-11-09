// Thin wrapper around the Pendo agent's track API.
// Safe to call when the Pendo snippet has not loaded: tracking must never break the app.
export const trackEvent = (eventName, properties = {}) => {
  try {
    if (typeof window !== 'undefined' && window.pendo && typeof window.pendo.track === 'function') {
      window.pendo.track(eventName, properties);
    }
  } catch (err) {
    console.error(`Pendo track failed for "${eventName}"`, err);
  }
};
