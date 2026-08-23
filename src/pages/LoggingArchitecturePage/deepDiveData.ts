import { Antenna, EyeOff, Gauge, Send, SlidersHorizontal, Workflow } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

export const DEEP_DIVE_PANELS: DeepDivePanel[] = [
  {
    id: 'log-capture',
    index: '01',
    eyebrow: 'Log Capture',
    icon: Antenna,
    headingLines: ['Every API call logs itself,', 'no call site required.'],
    accentIndex: 1,
    impact: 'API failures captured without a single manual log call',
    problem:
      'Relying on engineers to hand-write a log at every failure site guarantees the important ones are missing exactly when an incident hits.',
    decision:
      'An OkHttp application interceptor (`CustomResponseInterceptor`) times every request and emits a structured log: method, route, response code, duration, masked queries. Manual `RegisterLog` calls add domain events on top of that automatic network layer.',
    insight:
      'The interceptor derives a `commonURL` by replacing ids, emails, and phones in the path with placeholders, so `/user/4821/fee` and `/user/9033/fee` collapse to one searchable route instead of thousands of unique ones.',
    watermark: 'Capture',
    proof: {
      kind: 'code',
      filename: 'CustomResponseInterceptor.java',
      code: `long start = System.nanoTime();
Response response = chain.proceed(request);
double durationSec = round((System.nanoTime() - start) / 1e9, 2);
RegisterLog.sendHTTPLokiLogs(
    response.code(), peekedBody, method, url,
    requestBody, durationSec, isTokenExpired);`,
    },
  },
  {
    id: 'non-blocking',
    index: '02',
    eyebrow: 'Non-Blocking Writes',
    icon: Workflow,
    headingLines: ['Logging on the UI thread', 'is not an option.'],
    accentIndex: 1,
    impact: 'Zero UI-thread blocking on logging hot paths',
    problem:
      'Logs are produced from Activities and network interceptors, the exact paths where a blocking write or a per-log coroutine launch shows up as jank or an ANR.',
    decision:
      'Producers do a non-blocking `channel.trySend` and return immediately. A single consumer coroutine on `Dispatchers.IO` drains the channel, batching up to 50 logs or every 200ms, and writes each batch in one Room transaction.',
    insight:
      'Batching turns a per-log `launch` plus single-row insert into one transaction per 50 logs, roughly 50x fewer writes. The channel uses `BufferOverflow.DROP_OLDEST`, so under a burst the newest logs win instead of back-pressuring the producer.',
    watermark: 'Async',
    proof: {
      kind: 'code',
      filename: 'LokiLocal.kt',
      code: `private val channel = Channel<LokiLogEntity>(
    capacity = 1024,
    onBufferOverflow = BufferOverflow.DROP_OLDEST,
)
fun send(level, message) = channel.trySend(build(level, message))

// consumer on Dispatchers.IO
val batch = drainUpTo(size = 50, windowMs = 200)
dao.insertAll(batch)   // one transaction, ~50x cheaper`,
    },
  },
  {
    id: 'masking',
    index: '03',
    eyebrow: 'Privacy Layer',
    icon: EyeOff,
    headingLines: ['Mask before persist,', 'drop before leak.'],
    accentIndex: 1,
    impact: 'No credential or PII field reaches storage or the network unmasked',
    problem:
      'Auth tokens, passwords, personal data, and payment fields can never leave the device. Logs are written to a local DB and shipped over the network, so masking has to happen before either.',
    decision:
      'A masking layer runs on the sender’s IO coroutine, before the Room insert and before upload. It walks JSON recursively (including JSON-in-string), falls back to regex for URLs and query params, and matches keys on word boundaries so `company` never trips the `pan` rule.',
    insight:
      'It is fail-closed: if masking throws on a malformed payload, the log is dropped, not shipped raw. A 100-entry LRU cache and an O(n) early-exit scan keep the common case cheap.',
    watermark: 'Mask',
    proof: {
      kind: 'table',
      columns: ['Category', 'Example keys', 'Action'],
      emphasizeCol: 2,
      rows: [
        ['Auth', 'authToken, password, jwt', 'replaced with *****'],
        ['PII', 'email, phone, name', 'replaced with *****'],
        ['Payment', 'card, cvv, upi', 'replaced with *****'],
        ['Allowlisted', 'tokenTtlDays, isTokenExpired', 'kept (non-sensitive)'],
      ],
    },
  },
  {
    id: 'delivery-modes',
    index: '04',
    eyebrow: 'Delivery Modes',
    icon: Send,
    headingLines: ['Durable by default,', 'instant when it matters.'],
    accentIndex: 1,
    impact: 'Guaranteed eventual delivery after days offline',
    problem:
      'A device can be offline for extended periods and logs still have to arrive eventually, but a live production investigation cannot wait for the next batch window.',
    decision:
      'Batch mode persists masked logs to Room and uploads them later via a `CoroutineWorker` gated on `NetworkType.CONNECTED`. Immediate mode skips the DB and posts straight to Loki through an in-memory pipeline that caps outbound work at 4 concurrent POSTs.',
    insight:
      'The tradeoff is explicit: batch survives process death because it is on disk; immediate does not, since in-flight logs live only in memory. Immediate is reserved for high-priority diagnostics where latency beats durability.',
    watermark: 'Deliver',
    proof: {
      kind: 'table',
      columns: ['Mode', 'Path', 'Guarantee'],
      emphasizeCol: 2,
      rows: [
        ['Batch', 'Room -> WorkManager -> Loki', 'Survives offline and process death'],
        ['Immediate', 'LokiNow (Semaphore 4) -> Loki', 'Lowest latency, no disk durability'],
      ],
    },
  },
  {
    id: 'remote-config',
    index: '05',
    eyebrow: 'Runtime Control',
    icon: SlidersHorizontal,
    headingLines: ['Change logging', 'without a release.'],
    accentIndex: 1,
    impact: 'Log levels, batching, and retention tuned without a Play Store update',
    problem:
      'Reacting to an incident by changing what gets logged should not require building, reviewing, and publishing a new app version, then waiting for users to update.',
    decision:
      'Firebase Remote Config drives the entire pipeline: on/off, allowed levels, batch size and flush interval, retention days and max stored logs, which HTTP status codes are logged, and whether response bodies are captured. In production the default is error-only, dropped before the DB write.',
    insight:
      'Because the level filter runs before persistence, raising verbosity during an incident and lowering it afterward costs nothing when it is off: dropped logs never touch the disk.',
    watermark: 'Config',
    proof: {
      kind: 'table',
      columns: ['Knob', 'Controls', 'Prod default'],
      emphasizeCol: 2,
      rows: [
        ['safeLevels', 'which levels are logged', 'error only'],
        ['batch size / flush', 'batching cadence', '50 / 200ms'],
        ['retention / max stored', 'local DB cap', '10 days / 10k rows'],
        ['httpCodes', 'which statuses log', 'server-pushed list'],
        ['allow_request_body', 'response-body capture', 'off'],
      ],
    },
  },
  {
    id: 'bounded-resources',
    index: '06',
    eyebrow: 'Backpressure & Limits',
    icon: Gauge,
    headingLines: ['Nothing here', 'grows unbounded.'],
    accentIndex: 1,
    impact: 'No OOM on large bodies, no SQLite CursorWindow crash',
    problem:
      'A logging system that reads response bodies, writes to SQLite, and buffers offline can OOM on a large payload, crash on SQLite’s 2MB row window, or fill the disk.',
    decision:
      'Response bodies are peeked with a 64KB cap; each message is capped at 10KB with a three-step truncation (drop body, then size metadata, then UTF-8-safe byte trim); the DB is capped at 10k rows / 10 days; channels drop oldest under overload.',
    insight:
      'The CursorWindow "row too big" case is handled in the worker itself: it deletes the offending oldest row and continues, so one pathological log cannot wedge the whole upload.',
    watermark: 'Limits',
    proof: {
      kind: 'table',
      columns: ['Limit', 'Value', 'Prevents'],
      emphasizeCol: 1,
      rows: [
        ['Body peek', '64KB', 'OOM reading large responses'],
        ['Message size', '10KB (3-step truncation)', 'SQLite 2MB CursorWindow crash'],
        ['DB cap', '10k rows / 10 days', 'unbounded disk growth'],
        ['Channel overflow', 'DROP_OLDEST', 'producer back-pressure / ANR'],
      ],
    },
  },
]
