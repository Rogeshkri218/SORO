import type { Industry } from '@/types';

export const industries: Industry[] = [
  {
    id: 'medical',
    title: 'Medical Devices',
    description:
      'Possible application ideas include health-related electronics, enclosure concepts, and prototype evaluation. This is illustrative and does not indicate medical-device experience or regulatory capability.',
    applications: [
      'Patient monitoring electronics',
      'Diagnostic device prototypes',
      'Wearable health sensor systems',
      'Medical equipment enclosures',
      'Low-power embedded medical firmware',
    ],
    icon: 'heart-pulse',
  },
  {
    id: 'industrial-automation',
    title: 'Industrial Automation',
    description:
      'Possible application ideas include control electronics, sensor interfaces, and equipment enclosures. Specific scope and feasibility require project review.',
    applications: [
      'PLC and HMI support electronics',
      'Custom sensor and actuator boards',
      'Motor control systems',
      'Gas and environment monitoring',
      'Industrial enclosure fabrication',
    ],
    icon: 'factory',
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    description:
      'Possible application ideas include sensor-based monitoring and connected prototypes for agricultural environments. No field deployments or sector experience are claimed.',
    applications: [
      'Soil moisture and nutrient monitoring',
      'Greenhouse climate control electronics',
      'Field sensor nodes and data loggers',
      'Solar-powered IoT devices',
      'Irrigation control systems',
    ],
    icon: 'sprout',
  },
  {
    id: 'iot',
    title: 'Internet of Things (IoT)',
    description:
      'Connected sensors and electronic prototypes may be relevant product-development applications. Protocols, implementation, and integration scope are confirmed per enquiry.',
    applications: [
      'Custom IoT sensor hardware',
      'BLE, Wi-Fi, LoRa, and Zigbee devices',
      'MQTT and cloud platform integration',
      'Smart home and building devices',
      'Asset tracking hardware',
    ],
    icon: 'wifi',
  },
  {
    id: 'education',
    title: 'Education',
    description:
      'Possible application ideas include learning kits, demonstrator models, and development-board concepts. No institutional engagements are implied.',
    applications: [
      'Custom teaching hardware kits',
      'Robotics and automation platforms',
      'Lab equipment and test boards',
      'Student project prototyping',
      '3D-printed educational models',
    ],
    icon: 'graduation-cap',
  },
  {
    id: 'research',
    title: 'Research & Development',
    description:
      'Early research concepts may involve electronic or mechanical prototypes. This illustrative area does not represent confirmed research partnerships.',
    applications: [
      'Research instrument electronics',
      'Proof-of-concept prototype builds',
      'Custom sensor and data acquisition',
      'Mechanical and electronic integration',
      'Rapid iteration and design support',
    ],
    icon: 'flask-conical',
  },
];
