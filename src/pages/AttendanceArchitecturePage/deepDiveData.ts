import { Aperture, Fingerprint, MapPin, ScanFace, UploadCloud, Wifi } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

export const DEEP_DIVE_PANELS: DeepDivePanel[] = [
  {
    id: 'geofence-validation',
    index: '01',
    eyebrow: 'Location Gate',
    icon: MapPin,
    headingLines: ['The camera does not open', 'until the server confirms', "you're on campus."],
    accentIndex: 1,
    impact: "The punch photo is never taken from a location the server hasn't already approved",
    problem:
      'Client-side distance math can be spoofed by a fake-GPS app, so the location check has to be a source of truth the client cannot fabricate.',
    decision:
      '`AttendanceDialogRepo` takes a fresh high-accuracy GPS fix (15s timeout), then calls a server-side geofence validation endpoint. The camera button stays disabled, and switches to a retry action, until that call succeeds.',
    insight:
      'Geofencing is entirely server-side by design, no radius or coordinate ever ships in the app. It is also independently feature-flagged per institution.',
    watermark: 'Location',
    proof: {
      kind: 'flow',
      steps: [
        { type: 'node', label: 'Request GPS fix', detail: '15s timeout' },
        { type: 'node', label: 'Reverse-geocode', detail: 'lat/long to address' },
        { type: 'node', label: 'Call geofence validate API' },
        {
          type: 'branch',
          condition: 'Server approves?',
          yes: { label: 'Enable "Open Camera"' },
          no: { label: 'Show "Try Again"', detail: 'camera stays disabled' },
        },
      ],
    },
  },
  {
    id: 'ip-validation',
    index: '02',
    eyebrow: 'Network Gate',
    icon: Wifi,
    headingLines: ['On Wi-Fi, the punch is', 'also checked against an', 'approved IP range.'],
    accentIndex: 1,
    impact: 'Closes the gap GPS alone leaves open indoors and on campus Wi-Fi',
    problem:
      'GPS accuracy degrades indoors, exactly where most staff punch in, so location alone is not always a reliable signal.',
    decision:
      'On Wi-Fi, the app resolves its public IP by cross-checking three independent lookup services and validates it server-side against an approved-IP-range endpoint, run in parallel with the geofence check.',
    insight:
      'This is an independently flagged, optional layer, not a replacement for geofencing. Institutions choose either, both, or neither based on their campus network layout.',
    watermark: 'Network',
    proof: {
      kind: 'table',
      columns: ['Service', 'Role'],
      emphasizeCol: 1,
      rows: [
        ['ipify.org', 'Public IP lookup, primary'],
        ['ipinfo.io', 'Public IP lookup, fallback'],
        ['my-ip.io', 'Public IP lookup, fallback'],
        ['Institution server', 'Validates resolved IP against approved range'],
      ],
    },
  },
  {
    id: 'live-capture-only',
    index: '03',
    eyebrow: 'Capture Integrity',
    icon: Aperture,
    headingLines: ['No gallery, no pre-recorded', 'video. Only a live camera', 'session produces a punch photo.'],
    accentIndex: 1,
    impact: 'Zero path from a gallery or file picker to a punch photo',
    problem:
      'A gallery picker or pre-recorded video would let anyone submit any photo as proof of presence.',
    decision:
      '`CircleCameraCaptureActivity` is the only producer of the `CAPTURE_ABSOLUTE_PATH` the punch flow accepts, capturing live via CameraX\'s front camera with no import or attach path anywhere in the flow.',
    insight:
      '`onStop()` force-finishes the activity if it is backgrounded (app switch, incoming call, screen lock), so a live session cannot be paused and swapped for a still image mid-capture.',
    watermark: 'Capture',
    guide:
      '`CircleCameraCaptureActivity` is the single entry point into everything below: liveness and identity continuity both run on frames from this one live session, not a separate step.',
  },
  {
    id: 'liveness-challenge',
    index: '04',
    eyebrow: 'Liveness Challenge',
    icon: ScanFace,
    headingLines: ['Two random head turns', 'and two blinks, picked fresh', 'every time.'],
    accentIndex: 1,
    impact: 'A pre-recorded loop cannot predict which challenge it needs to pass',
    problem:
      'A still photo or a looping video of a face would pass a single, predictable check every time.',
    decision:
      '`processImageForLiveness` shuffles 2 of 3 head-turn directions (`LookLeft`, `LookRight`, `LookDown`) per session and appends a mandatory `Blink` step requiring two full blinks, tracked with ML Kit\'s `FaceDetectorOptions` (`LANDMARK_MODE_ALL`, `CLASSIFICATION_MODE_ALL`, `enableTracking()`) running on live camera frames.',
    insight:
      "Head-pose thresholds (ML Kit's `headEulerAngleX`/`headEulerAngleY`) must hold for 10 consecutive frames (about 0.33s) before advancing. Each blink needs an open, closed, open transition in ML Kit's eye-open probability, and two of them, with a 300ms debounce between, so a single lucky frame cannot fake either step.",
    watermark: 'Liveness',
    proof: {
      kind: 'table',
      columns: ['ML Kit config', 'Output used', 'Check it powers'],
      emphasizeCol: 2,
      rows: [
        ['enableTracking()', 'trackingId', 'Same face end-to-end (Identity Continuity)'],
        ['LANDMARK_MODE_ALL', 'eye / nose landmark points', 'Head-turn angle and obstruction detection'],
        ['CLASSIFICATION_MODE_ALL', 'leftEyeOpenProbability, rightEyeOpenProbability', 'Blink detection (two full cycles)'],
        ['PERFORMANCE_MODE_FAST', 'per-frame face result', 'Runs on every live camera frame, no lag between checks'],
      ],
    },
  },
  {
    id: 'identity-continuity',
    index: '05',
    eyebrow: 'Identity Continuity',
    icon: Fingerprint,
    headingLines: ['If the face changes', 'mid-session, the attempt', 'restarts.'],
    accentIndex: 1,
    impact: "Blocks a colleague from finishing someone else's liveness check",
    problem:
      'Nothing stops a second person from stepping in front of the camera partway through, if the flow only checks the final frame.',
    decision:
      "The first detected face's ML Kit `trackingId` is captured as `initialFaceId`; every later frame is compared against it. A mismatch, more than one face, or missing ML Kit eye and nose landmarks (glasses, caps) shows a blocking dialog and restarts the challenge.",
    insight:
      'Low light is rejected on the same pass (average luma below 60), so a dim room cannot be used to defeat the multi-face or landmark checks by hiding detail from ML Kit.',
    watermark: 'Identity',
    proof: {
      kind: 'table',
      columns: ['Check', 'Trigger', 'Result'],
      emphasizeCol: 2,
      rows: [
        ['Multiple faces', 'faces.size > 1', 'Blocking dialog, restart'],
        ['Identity swap', 'trackingId changes mid-session', 'Blocking dialog, restart'],
        ['Obstructed landmarks', 'eye/nose landmarks missing', 'Blocking dialog, restart'],
        ['Low light', 'average luma below 60', 'Blocking dialog, restart'],
      ],
    },
  },
  {
    id: 'upload-and-registration',
    index: '06',
    eyebrow: 'Upload & Consent',
    icon: UploadCloud,
    headingLines: ['The selfie is uploaded', 'and the punch is registered', 'as two explicit steps.'],
    accentIndex: 1,
    impact: 'Every punch carries a photo, GPS, IP, device, and timestamp trail',
    problem:
      'A punch record with no evidence attached is a claim, not proof, and is hard to audit after the fact.',
    decision:
      '`PunchInViewModel` orchestrates the punch and delegates the network calls to `PunchImageRepo`: fetch a signed URL, upload the selfie, then register the punch with user id, timestamp, lat/long, reverse-geocoded address, public IP, device info, and the resulting media id. An explicit consent checkbox gates both the camera and the final submit.',
    insight:
      'The pipeline is fail-visible, not fail-silent: upload or registration errors surface as a retryable state, and the locally cached selfie is cleaned up either way, so a failed attempt is never silently counted as a punch.',
    watermark: 'Upload',
    proof: {
      kind: 'table',
      columns: ['Field', 'Type', 'Source'],
      emphasizeCol: 0,
      rows: [
        ['ukid', 'Int', 'Signed-in user'],
        ['punchTimestamp', 'String', 'Device local time'],
        ['latitude / longitude', 'Double?', 'GPS fix'],
        ['locationDetails', 'String?', 'Reverse-geocoded address'],
        ['ipAddress', 'String?', 'Resolved public IP'],
        ['deviceInfo', 'String', 'Manufacturer, model, SDK version'],
        ['mediaId', 'Int', 'Signed-URL upload result'],
      ],
    },
  },
]
