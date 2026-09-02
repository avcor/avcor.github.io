import { Activity, Bluetooth, Database, RefreshCw, Ruler } from 'lucide-react'
import respirationDayShot from '../../assets/screenshots/dozee-chart-respiration-day.png'
import respirationWeekShot from '../../assets/screenshots/dozee-chart-respiration-week.png'
import sleepDayShot from '../../assets/screenshots/dozee-chart-sleep-day.png'
import profileRequestShot from '../../assets/screenshots/dozee-profile-request.png'
import profileManageShot from '../../assets/screenshots/dozee-profile-manage.png'
import profileSendRequestShot from '../../assets/screenshots/dozee-profile-send-request.png'
import DozeeIntro from './DozeeIntro'
import FeatureProductCard from './FeatureProductCard'
import FeatureSection from './FeatureSection'
import styles from './DozeeCaseStudyPage.module.css'

const screenshots = [
  { src: respirationDayShot, alt: 'Respiration Rate, Day view: min/average/max RPM and a full night line chart against the healthy range' },
  { src: sleepDayShot, alt: 'Sleep, Day view: sleep time, duration, wakeup time, and an awake/sleep timeline chart' },
  { src: respirationWeekShot, alt: 'Respiration Rate, Week view: daily min/max range chart across the week' },
  { src: profileRequestShot, alt: 'Request sheet: switch between "You", "Sudarshan", and "Raghavi" linked profiles' },
  { src: profileManageShot, alt: 'Manage Profiles: people sharing their health profile, with sharing-since dates and Remove actions' },
  { src: profileSendRequestShot, alt: 'Send Request modal: enter a registered mobile number to request a linked caregiving profile' },
]

export default function DozeeCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <DozeeIntro />
        </div>

        <div className={styles.product}>
          <FeatureProductCard screenshots={screenshots} />
        </div>
      </div>

      <FeatureSection
        index="01"
        title="Chart Optimization"
        problem={
          <>
            <p>
              Dozee Home renders heart rate, SpO2, respiration rate, and sleep quality as
              charts a user can read at a glance. Correctness and accuracy of every point
              mattered more than how fast the chart appeared.
            </p>
            <p>
              The hardware sampled about 4 points a minute, over 9,000 points across an
              8-hour sleep session, and the first iteration recomputed all of them on
              every open: axis labels overlapped differently on every screen size, and the
              chart took a visible ~5 seconds to draw.
            </p>
          </>
        }
        ownershipPoints={[
          "Prefetched the day's sleep data in the background and ran invalid-point detection ahead of time, so it was ready before the screen opened",
          'Built a smoothing algorithm that scales curve smoothness to screen width, so the chart line never renders spiky',
          'Built a label-density algorithm that derives axis label count from font size, screen width, and point count, so labels stop overlapping',
          'Found redundant recomputation from unoptimized useEffects; consolidated the heavy pass into one run, cached in useMemo',
          'Persisted computed labels, smoothed points, and averages to WatermelonDB, so repeat opens draw instantly',
        ]}
        heroLine="5s to under 2s draw time"
        heroCaveat="Chart calculation time on a full night of sleep data (9,000+ points), from the first iteration to the optimized pipeline."
        impactItems={[
          { icon: Ruler, title: 'Accurate At Any Size', description: 'Smoothing and label density scale to screen width without losing point accuracy.' },
          { icon: Database, title: 'Instant Redraw', description: 'Computed chart data persisted for instant draw on repeat opens.' },
          { icon: Activity, title: 'One Computation, Not Many', description: 'Heavy work consolidated into a single memoized pass.' },
        ]}
      />

      <FeatureSection
        index="02"
        title="Managing Profile"
        problem={
          <>
            <p>
              A family member switching to another person's linked medical profile needed
              to see that profile's data immediately, without losing their own account
              state or the pod's live connection.
            </p>
            <p>
              Updating user data in Redux all at once triggered renders across multiple
              screens at once, visible as flicker. The switch also had to swap the
              session token and medical data for the new profile while preserving the
              original owner's account, and still read and reconfigure the shared pod's
              hardware state after switching.
            </p>
          </>
        }
        ownershipPoints={[
          'Traced the Redux update path and found multiple intermediate reads between the API call and the final state',
          'Collapsed those reads into a single state transition, removing the render cascade that caused the flicker',
          "Swapped the session token and medical data for the new profile while preserving the original owner's account details",
          'Added automatic BLE reconnection when the pod comes back in range after a profile switch, with a retry mechanism for drops mid-connection',
        ]}
        heroLine="One state transition, not many"
        heroCaveat="Collapsed multiple intermediate Redux reads between the API call and the final state into one transition, removing the render cascade that caused screen flicker on profile switch."
        impactItems={[
          { icon: RefreshCw, title: 'Zero Render Flicker', description: 'Profile switch updates render once, not per intermediate Redux read.' },
          { icon: Bluetooth, title: 'Live Pod State', description: 'Hardware state and reconfiguration available immediately after switching accounts.' },
        ]}
      />
    </div>
  )
}
