// Import and configure dotenv to read variables from the .env file.
require('dotenv').config();

// Pendo server-side Track Events endpoint configuration.
// The integration key is read from the environment and must never be committed.
const PENDO_DATA_HOST = process.env.PENDO_DATA_HOST || 'data.pendo.io';
const PENDO_TRACK_EVENT_SECRET = process.env.PENDO_TRACK_EVENT_SECRET;

/**
 * Sends a Track Event to Pendo via the server-side Track API.
 * Tracking is fire-and-forget: failures are logged and never thrown, so they
 * cannot break the request that triggered them.
 *
 * @param {string} event The Pendo track event name (must match the registered name exactly).
 * @param {object} options
 * @param {string|number} [options.visitorId] The user id; falls back to "system" when unavailable.
 * @param {string|number} [options.accountId] The account id; falls back to "system" when unavailable.
 * @param {object} [options.properties] Additional event metadata.
 * @returns {Promise<void>} A promise that always resolves.
 */
async function trackEvent(event, { visitorId, accountId, properties = {} } = {}) {
  try {
    if (!PENDO_TRACK_EVENT_SECRET) {
      // TODO: Set PENDO_TRACK_EVENT_SECRET in the backend .env to enable Pendo server-side tracking.
      return;
    }

    const response = await fetch(`https://${PENDO_DATA_HOST}/data/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-pendo-integration-key': PENDO_TRACK_EVENT_SECRET,
      },
      body: JSON.stringify({
        type: 'track',
        event,
        visitorId: visitorId != null ? String(visitorId) : 'system',
        accountId: accountId != null ? String(accountId) : 'system',
        timestamp: Date.now(),
        properties,
      }),
    });

    if (!response.ok) {
      console.error(`Pendo track event "${event}" failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`Pendo track event "${event}" failed:`, error.message);
  }
}

module.exports = { trackEvent };
