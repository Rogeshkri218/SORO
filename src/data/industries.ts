import type { Industry } from '@/types';

export const industries: Industry[] = [
  {
    id: 'medical',
    title: 'Medical Devices',
    description:
      'We support medical device development with custom electronics, PCB design, embedded firmware, and precision-fabricated enclosures. Our engineering approach emphasises reliability, compact form factors, and clean design documentation.',
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
      'Our team delivers custom control electronics, sensor integration, and fabricated hardware for industrial automation applications, supporting factory-floor upgrades and custom machine builds.',
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
      'Precision agriculture benefits from smart sensor systems, low-power wireless networks, and rugged electronics. We develop field-deployable IoT devices for crop monitoring, soil analysis, and environmental data collection.',
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
      'We design IoT-ready hardware from custom sensor PCBs to embedded wireless firmware and cloud-connected prototypes. Our IoT solutions integrate a range of communication protocols to suit different deployment environments.',
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
      'We support educational institutions and learning programmes with custom electronics kits, prototype development boards, and fabricated components for research and teaching.',
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
      'We are a technical partner for research teams needing rapid prototyping, custom hardware design, and fabrication support for experimental systems and proof-of-concept builds.',
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
