import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'glaucoma-monitor',
    slug: 'glaucoma-monitoring-device',
    title: 'Glaucoma IOP Monitoring Device',
    category: 'medical-tech',
    tags: ['Medical', 'Embedded Systems', 'PCB Design', 'IoT'],
    shortDesc: 'A wearable intraocular pressure monitoring prototype for continuous glaucoma management.',
    description:
      'A prototype medical device designed to non-invasively monitor intraocular pressure (IOP) for glaucoma management. The device integrates custom sensor electronics, embedded firmware, and wireless data transmission to a companion mobile interface.',
    problemStatement:
      'Glaucoma patients require periodic IOP monitoring, which typically requires clinic visits. Continuous home monitoring can support earlier detection of pressure spikes.',
    solution:
      'We designed a compact custom PCB integrating a pressure sensing front-end, low-power microcontroller, and BLE radio module. Custom firmware handles sensor acquisition, filtering, and data transmission. A companion app prototype was built for data visualisation.',
    techStack: ['Custom PCB', 'BLE', 'Low-Power Firmware', 'Pressure Sensing'],
    hardware: ['Custom sensor PCB', 'nRF52 microcontroller', 'Pressure sensor module', 'LiPo battery management'],
    software: ['Embedded C firmware', 'BLE GATT profile', 'Mobile companion prototype'],
    imageUrl: '/images/projects/glaucoma-device.jpg',
    images: [],
    featured: true,
  },
  {
    id: 'gas-detection',
    slug: 'gas-detection-system',
    title: 'Industrial Gas Detection System',
    category: 'iot',
    tags: ['IoT', 'Embedded Systems', 'PCB Design', 'Industrial'],
    shortDesc: 'Multi-sensor gas detection system with real-time alerts and cloud logging.',
    description:
      'A multi-channel gas detection system for industrial environments, capable of detecting multiple gas types simultaneously. The system provides real-time local alerts and logs data to a cloud dashboard for remote monitoring.',
    problemStatement:
      'Industrial facilities require continuous gas monitoring to ensure worker safety and regulatory compliance. Manual monitoring is unreliable and slow to respond to hazardous gas events.',
    solution:
      'We designed a custom PCB with multiple gas sensor interfaces, a Wi-Fi-enabled microcontroller, and a display module. Firmware manages sensor polling, threshold alerting, and cloud data publishing via MQTT.',
    techStack: ['Custom PCB', 'Wi-Fi / MQTT', 'Cloud IoT Dashboard', 'Gas Sensors'],
    hardware: ['Custom sensor board', 'ESP32 microcontroller', 'MQ-series gas sensors', 'OLED display'],
    software: ['Embedded C/C++ firmware', 'MQTT protocol', 'Node-RED dashboard'],
    imageUrl: '/images/projects/gas-detection.jpg',
    images: [],
    featured: true,
  },
  {
    id: 'motor-driver-board',
    slug: 'custom-motor-driver-pcb',
    title: 'Custom Motor Driver PCB',
    category: 'pcb-design',
    tags: ['PCB Design', 'PCB Assembly', 'Embedded Systems'],
    shortDesc: 'Compact dual H-bridge motor driver board for robotics and automation.',
    description:
      'A custom-designed dual-channel H-bridge motor driver PCB for use in robotics and small-scale automation. The board integrates current sensing, thermal protection, and a microcontroller interface.',
    problemStatement:
      'Off-the-shelf motor driver modules did not meet the form factor, current rating, and interface requirements for a custom robotics platform.',
    solution:
      'We designed a compact 4-layer PCB with integrated dual H-bridge ICs, current sensing, protection circuits, and a clean microcontroller SPI interface. The board was assembled and validated on the target robotic platform.',
    techStack: ['4-layer PCB', 'H-bridge ICs', 'Current Sensing', 'SPI Interface'],
    hardware: ['Custom 4-layer PCB', 'DRV8833 H-bridge ICs', 'Current sense resistors', 'Thermal vias'],
    software: ['Arduino / C++ control library'],
    imageUrl: '/images/projects/motor-driver.jpg',
    images: [],
    featured: true,
  },
  {
    id: 'agri-sensor-node',
    slug: 'agricultural-iot-sensor-node',
    title: 'Agricultural IoT Sensor Node',
    category: 'iot',
    tags: ['IoT', 'Agriculture', 'Embedded Systems', 'PCB Design'],
    shortDesc: 'Solar-powered field sensor node for soil moisture and weather monitoring.',
    description:
      'A solar-powered wireless sensor node designed for agricultural field deployment. The node measures soil moisture, temperature, humidity, and ambient light, transmitting data to a cloud platform for farm management.',
    problemStatement:
      'Farmers needed an affordable, low-power sensor system for real-time field condition monitoring without reliance on mains power.',
    solution:
      'We designed a low-power custom PCB with solar energy harvesting, LoRa wireless communication, and multiple sensor interfaces. Firmware uses deep-sleep strategies to maximise battery life between solar charge cycles.',
    techStack: ['LoRa', 'Solar Harvesting', 'Low-Power Design', 'Cloud IoT'],
    hardware: ['Custom low-power PCB', 'STM32L microcontroller', 'LoRa module', 'Solar MPPT circuit', 'Soil sensors'],
    software: ['Low-power embedded C firmware', 'LoRaWAN stack', 'Cloud dashboard'],
    imageUrl: '/images/projects/agri-node.jpg',
    images: [],
    featured: false,
  },
  {
    id: '3d-enclosure',
    slug: 'custom-3d-printed-enclosure',
    title: 'Custom Electronics Enclosure',
    category: '3d-printing',
    tags: ['3D Printing', '3D Design', 'Prototyping'],
    shortDesc: 'Bespoke 3D-printed enclosure designed and printed for a custom electronics assembly.',
    description:
      'We designed and 3D-printed a custom enclosure for a client prototype electronic assembly. The enclosure was designed to exact PCB mounting dimensions, with cable management provisions, ventilation slots, and a professional surface finish.',
    problemStatement:
      'The client needed a custom enclosure for a prototype that matched exact PCB dimensions and connector positions, which was unavailable off the shelf.',
    solution:
      'We produced a parametric 3D CAD model, 3D-printed the enclosure in PETG, and post-processed the surface to a professional finish suitable for demo use.',
    techStack: ['FDM 3D Printing', 'PETG Material', 'Parametric CAD'],
    hardware: ['3D-printed PETG enclosure', 'Stainless hardware inserts'],
    software: ['CAD modelling software', 'Slicing software'],
    imageUrl: '/images/projects/enclosure.jpg',
    images: [],
    featured: false,
  },
  {
    id: 'embedded-dev-board',
    slug: 'embedded-development-board',
    title: 'Custom Embedded Development Board',
    category: 'embedded-systems',
    tags: ['Embedded Systems', 'PCB Design', 'PCB Assembly'],
    shortDesc: 'A modular development platform for rapid embedded product prototyping.',
    description:
      'A custom embedded development board designed to accelerate prototype development for a client. The board provides a main MCU, expansion headers, onboard USB programming, power regulation, and multiple communication interfaces.',
    problemStatement:
      "Standard development boards did not match the client's specific peripheral and power requirements, slowing prototype development.",
    solution:
      "We designed a custom development board tailored to the client's required MCU, with exact peripheral mapping, onboard debug, and expansion headers for rapid bring-up.",
    techStack: ['Custom PCB', 'STM32', 'USB Programming', 'Expansion Headers'],
    hardware: ['Custom 4-layer PCB', 'STM32F4 MCU', 'USB-C interface', 'Voltage regulators'],
    software: ['STM32CubeIDE firmware', 'ST-Link debug'],
    imageUrl: '/images/projects/dev-board.jpg',
    images: [],
    featured: false,
  },
];
