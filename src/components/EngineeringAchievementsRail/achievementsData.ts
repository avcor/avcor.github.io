import { CIRCUIT_DOMAINS, CIRCUIT_CASE_STUDIES } from '../../features/IndexCircuit/circuitData'

/** Which leaf case studies belong to each domain — mirrors the wire
 *  groupings in circuitData.ts (`${caseStudy}_${domain}` wire ids), kept
 *  as an explicit map here since the rail only needs the grouping, not
 *  the wire geometry. */
const DOMAIN_CASE_STUDY_IDS: Record<string, string[]> = {
  'platform-engineering': ['flutter-integration', 'logging-system'],
  'security-engineering': ['ml-kit-liveness'],
  'platform-optimization': ['android-optimization'],
  'product-engineering': ['payment-experience', 'app-security'],
  'performance-engineering': ['medical-chart-optimization'],
  'offline-first-architecture': ['ecg-background-sync'],
}

export interface AchievementGroup {
  id: string
  label: string
  caseStudies: { id: string; label: string }[]
}

export const ACHIEVEMENT_GROUPS: AchievementGroup[] = CIRCUIT_DOMAINS.map((domain) => ({
  id: domain.id,
  label: domain.lines.slice(1).join(' '),
  caseStudies: (DOMAIN_CASE_STUDY_IDS[domain.id] ?? []).map((id) => ({
    id,
    label: CIRCUIT_CASE_STUDIES.find((cs) => cs.id === id)?.label ?? id,
  })),
}))
