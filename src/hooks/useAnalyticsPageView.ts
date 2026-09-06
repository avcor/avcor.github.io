import { useEffect } from 'react'
import { trackPageView } from '../services/analytics'

/** Routing here is a manual hash (see CaseStudyOverlayContext), not a
 *  router, so Firebase's automatic page_view never fires on navigation.
 *  This tracks the hash itself as the "page". */
export function useAnalyticsPageView() {
  useEffect(() => {
    trackPageView(window.location.hash || '/')

    const onHashChange = () => trackPageView(window.location.hash || '/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
}
