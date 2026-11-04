import { useMainPageAnalytics } from '../../hooks/useMainPageAnalytics'

/** Renders nothing. Mounts main-page analytics inside the case study
 *  provider, which it needs to know when a sheet covers the page. */
export default function SiteAnalytics() {
  useMainPageAnalytics()
  return null
}
