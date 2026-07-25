import accessManagementDashboard1 from '../../assets/screenshots/digii/access-management-dashboard-1.jpg'
import accessManagementDashboard2 from '../../assets/screenshots/digii/access-management-dashboard-2.jpg'
import passConsole from '../../assets/screenshots/digii/pass-console.jpg'

export interface ProductScreenshot {
  src: string
  alt: string
}

export const PRODUCT_SCREENSHOTS: ProductScreenshot[] = [
  {
    src: accessManagementDashboard1,
    alt: 'Access Management Dashboard — hosteller list with in/out of campus status',
  },
  {
    src: accessManagementDashboard2,
    alt: 'Access Management Dashboard — student detail sheet with guardian contact info',
  },
  {
    src: passConsole,
    alt: 'Pass Console — day pass and long pass requests with approval status',
  },
]
