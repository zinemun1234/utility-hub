// Google Analytics 4 utility
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

const GA_TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID

export const initGA = () => {
  if (!GA_TRACKING_ID) return

  // Load GA script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}');
  `
  document.head.appendChild(script2)
}

export const trackEvent = (eventName: string, parameters?: any) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag('event', eventName, {
    event_category: 'engagement',
    event_label: eventName,
    ...parameters,
  })
}

export const trackPageView = (page_path: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag('config', GA_TRACKING_ID, {
    page_path,
  })
}

// Custom events for our utility tools
export const analytics = {
  qrGenerated: () => trackEvent('qr_code_generated'),
  linkShortened: () => trackEvent('link_shortened'),
  passwordGenerated: () => trackEvent('password_generated'),
  colorPaletteGenerated: () => trackEvent('color_palette_generated'),
  textTransformed: (type: string) => trackEvent('text_transformed', { transformation_type: type }),
  premiumClicked: () => trackEvent('premium_upgrade_clicked'),
  adClicked: () => trackEvent('ad_clicked'),
} 