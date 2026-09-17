import type { DetailBlock } from '@/types'

export interface Publication {
  id: string
  title: string
  authors: string[]
  /** Department / institution line. No venue, DOI, volume or year until confirmed. */
  affiliation: string
  type: string
  /** Short label for the card pill */
  badge: string
  /** One-line positioning statement, shown on the card and in the modal */
  subtitle: string
  /** Card-face summary */
  summary: string
  /** Exactly 3 short lines for the card face */
  bullets: [string, string, string]
  abstract: string
  /** Compact results panel: [label, value] pairs */
  metrics: [string, string][]
  details: DetailBlock[]
  tags: string[]
  color: string
}

export const publications: Publication[] = [
  {
    id: 'elderly-fall-detection',
    title: 'Elderly Fall Detection Model for Patient Care Using Improvised CNN',
    authors: ['Mithran E', 'Avinash S', 'Rakesh Kumar M', 'Kumar P'],
    affiliation:
      'Department of Computer Science and Engineering, Rajalakshmi Engineering College, Chennai, India',
    type: 'Research · Computer Vision / Deep Learning',
    badge: 'First Author',
    subtitle:
      'CNN and pose-estimation research for proactive, non-intrusive elderly fall prediction using real-time video',
    summary:
      'A proactive computer-vision framework for elderly fall prediction. Most existing systems rely on wearable sensors or alarms that only respond after a fall has happened; this work continuously analyses video to recognise posture, gait and body-orientation changes that indicate elevated risk — and connects detection to intervention rather than stopping at classification.',
    bullets: [
      'CNN over RGB video frames, evaluated beyond accuracy alone',
      'PoseNet 2.0 spinal-vector angle as a second signal',
      'Eight-stage pipeline ending in prioritised alerts',
    ],
    abstract:
      'Falls are a major threat to elderly independence and health, yet most traditional systems rely on wearable sensors or alarms that only respond after a fall has already occurred. This work develops a proactive computer-vision framework that continuously analyses video to recognise changes in posture, gait, body orientation and environmental interaction which may indicate elevated fall risk — connecting detection to intervention rather than stopping at classification.',
    metrics: [
      ['Pipeline stages', '8'],
      ['Pose backbone', 'PoseNet 2.0'],
      ['Core model', 'Improvised CNN'],
      ['Second signal', 'Spinal vector angle'],
      ['Authors', '4 · first author'],
      ['Alert channels', 'SMS · Push · EMS'],
    ],
    details: [
      {
        label: 'Research Problem',
        body:
          'Falls are a major threat to elderly independence and health. Many traditional systems rely on wearable sensors or alarms that only respond after a fall has already occurred, which makes them reactive by construction. The research explored whether computer vision and deep learning could provide a more proactive approach: continuously analysing video to recognise the changes that precede a fall rather than only the fall itself.',
        items: ['Posture', 'Gait', 'Body orientation', 'Environmental interaction'],
      },
      {
        label: 'Proposed Architecture',
        body:
          'The documented architecture processes live or recorded video frame by frame, extracting visual information before classification and evaluating the result with a confusion matrix rather than accuracy alone.',
        flow:
          'RGB video dataset → frame extraction → preprocessing → train/test separation → CNN → prediction → confusion matrix / output',
      },
      {
        label: 'Pose Estimation',
        body:
          'A particularly interesting component is the use of PoseNet 2.0. The methodology tracks key body positions such as the head and pelvis and calculates a spinal vector angle relative to the vertical axis. The change in that angle between standing and falling frames provides an additional detection signal independent of the CNN’s own visual features.',
        items: ['Head tracking', 'Pelvis tracking', 'Spinal vector angle', 'Vertical-axis reference'],
      },
      {
        label: 'Project Modules',
        body:
          'The research divides the application into eight major stages, from raw capture through to intervention.',
        items: [
          '1. Video collection and processing',
          '2. Data segregation and preprocessing',
          '3. Model development and training',
          '4. Validation and evaluation',
          '5. Iterative refinement',
          '6. Machine learning',
          '7. Fall-detection algorithm',
          '8. Alert generation',
        ],
      },
      {
        label: 'Data Preprocessing',
        body:
          'Frames were prepared through processes designed to improve consistency before the CNN extracts visual features such as shapes, edges and movement patterns.',
        items: ['Noise reduction', 'Lighting compensation', 'Standardised frame dimensions'],
      },
      {
        label: 'Training',
        body:
          'The model was trained on labelled fall and non-fall frames. Predictions were compared with ground-truth labels, and backpropagation was used to iteratively update model parameters across training cycles.',
      },
      {
        label: 'Preventing Overfitting',
        body:
          'Several techniques were applied to improve generalisation, intended to stop the model memorising the training set and to hold up on unseen scenarios.',
        items: [
          'L1/L2 regularisation',
          'Dropout',
          'Image translation',
          'Rotation',
          'Scaling',
          'Colour transformations',
          'Diverse environmental conditions',
          'Different camera angles',
        ],
      },
      {
        label: 'Model Evaluation',
        body:
          'Evaluation was deliberately broader than reporting classification accuracy, using a confusion matrix and per-class metrics alongside a confidence output.',
        items: [
          'Train/validation/test separation',
          'Confusion matrix',
          'True positives',
          'False positives',
          'True negatives',
          'False negatives',
          'Precision',
          'Recall',
          'F1-score',
          'Confidence/probability output',
        ],
      },
      {
        label: 'Alert System',
        body:
          'The research also describes an alerting layer. Alerts could be prioritised by event severity and delivered through several channels, so the goal was not merely to classify falls but to connect detection with intervention.',
        items: [
          'SMS',
          'Push notifications',
          'Emergency-service communication',
          'Geo-location information',
          'Severity-based prioritisation',
        ],
      },
      {
        label: 'Future Research',
        body:
          'The paper outlines several extensions intended to improve temporal reasoning, generalisation, dataset availability and explainability.',
        items: [
          'YOLOv5 for faster real-time object detection',
          'LSTM layers for temporal patterns',
          'Vision Transformers',
          'PoseNet + transformer multimodal fusion',
          'Wearable/depth-sensor augmentation',
          'GAN-generated synthetic fall data',
          'Explainable AI',
          'Transfer learning',
        ],
      },
    ],
    tags: ['CNN', 'PoseNet 2.0', 'Computer Vision', 'Deep Learning', 'Pose Estimation', 'Python'],
    color: '#f0abfc',
  },
]
