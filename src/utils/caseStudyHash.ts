/** Deep-link prefix: a shared URL like `#case-study/flutter-integration` opens
 *  that case study's sheet directly on load, distinct from plain section
 *  anchors (`#work`, `#about`, ...). */
export const CASE_STUDY_HASH_PREFIX = '#case-study/'

export function caseStudyIdFromHash(hash: string): string | null {
  return hash.startsWith(CASE_STUDY_HASH_PREFIX) ? hash.slice(CASE_STUDY_HASH_PREFIX.length) : null
}
