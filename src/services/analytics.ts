import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyAwh8_LnZBI01DxQvLUDU8n1wIdb5R4V0c',
  authDomain: 'portfolio-92b08.firebaseapp.com',
  projectId: 'portfolio-92b08',
  storageBucket: 'portfolio-92b08.firebasestorage.app',
  messagingSenderId: '373249193203',
  appId: '1:373249193203:web:f4ad08a79bb080646af386',
  measurementId: 'G-EN8F4TBMC4',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export function trackPageView(path: string) {
  logEvent(analytics, 'page_view', { page_path: path })
}

export function trackEvent(name: string, params?: Record<string, string>) {
  logEvent(analytics, name, params)
}
