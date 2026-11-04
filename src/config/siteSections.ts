/** The site's top-level scroll sections, in document order. Shared by the
 *  header nav and section analytics so both agree on what a "section" is. */
export const SITE_SECTIONS = [
  { id: 'hero-section', label: 'Home' },
  { id: 'work', label: 'Impact' },
  { id: 'index', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

export const SITE_SECTION_IDS = SITE_SECTIONS.map((s) => s.id)
