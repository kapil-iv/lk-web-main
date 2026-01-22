// For web, we'll use viewport units and responsive calculations
const getViewportWidth = () => window.innerWidth;
const getViewportHeight = () => window.innerHeight;

// Returns width as a percentage of viewport width
export const cwp = (percent) => `${percent}vw`;

// Returns height as a percentage of viewport height
export const chp = (percent) => `${percent}vh`;

// Returns width in pixels as a percentage of viewport width
export const cwpPx = (percent) => (getViewportWidth() * percent) / 100;

// Returns height in pixels as a percentage of viewport height
export const chpPx = (percent) => (getViewportHeight() * percent) / 100;

// Media query helpers
export const isMobile = () => getViewportWidth() <= 768;
export const isTablet = () =>
  getViewportWidth() > 768 && getViewportWidth() <= 1024;
export const isDesktop = () => getViewportWidth() > 1024;

/**
 * Returns true if running inside the LocalKonnect App WebView.
 */
export function isInLocalKonnectApp() {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent.includes("LocalKonnectApp")
  );
}

/**
 * Send a message to the React Native WebView if in LocalKonnect App.
 * @param {object} message - The message object to send (will be JSON.stringified)
 */
export function postToLocalKonnectApp(message) {
  if (
    isInLocalKonnectApp() &&
    window.ReactNativeWebView &&
    typeof window.ReactNativeWebView.postMessage === "function"
  ) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
}

export function setWebviewConfiguration(data) {
  postToLocalKonnectApp({ action: "set_webview_configuration", data });
}

export function openScreen(screen, params) {
  postToLocalKonnectApp({ action: "open_screen", data: { screen, params } });
}

export function openSettings() {
  postToLocalKonnectApp({ action: "open_settings" });
}
