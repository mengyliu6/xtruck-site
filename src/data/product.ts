import type { ProductData } from '@/types/product'

export const product: ProductData = {
  brand: 'Xtruck',
  name: 'Xtruck OHW808',
  model: 'OHW808',
  priceUsd: 2399,
  summary:
    'Professional diagnostics for construction machinery, agricultural equipment and diesel engines.',
  shortDescription:
    'Xtruck OHW808 is a professional diagnostic tool for construction machinery, agricultural equipment and diesel engines, with broad equipment coverage, complete diagnostic functions and remote technical assistance.',
  coreSellingPoints: [
    'Wide equipment coverage',
    'Complete diagnostic functions',
    'Remote technical assistance',
  ],
  overview: [
    'Xtruck OHW808 is designed to inspect and diagnose electronic control systems on construction machinery, agricultural equipment, diesel engines and other supported off-highway vehicles. Its software combines domestic and international equipment coverage with practical diagnostic and repair information.',
    'It is suitable for repair shops, service centers, construction and agricultural machinery technicians, equipment manufacturers, training institutions, and maintenance teams working in mining and energy operations.',
    'Coverage and available functions vary by equipment. Confirm the brand, model, year, engine model and required diagnostic functions with Xtruck before ordering.',
  ],
  useCases: [
    'Repair shops',
    'Service centers',
    'Construction machinery technicians',
    'Agricultural machinery technicians',
    'Equipment manufacturers',
    'Training institutions',
    'Mining and energy maintenance teams',
  ],
  features: [
    {
      title: 'Read ECU Information',
      description: 'Read and display control-system module information detected from the ECU.',
      icon: 'engine',
      image: '/images/diagnostics/read-ecu-information.jpeg',
      imageAlt: 'OHW808 screen showing ECU information',
    },
    {
      title: 'Read Fault Codes',
      description: 'Retrieve and display fault-code information from the selected vehicle system.',
      icon: 'document',
      image: '/images/diagnostics/read-fault-codes.jpeg',
      imageAlt: 'OHW808 screen showing fault codes',
    },
    {
      title: 'Clear Fault Codes',
      description: 'Clear stored fault codes and freeze-frame data after the fault is resolved.',
      icon: 'toolbox',
    },
    {
      title: 'Live Data',
      description: 'Read real-time operating parameters from the current system module.',
      icon: 'database',
      image: '/images/diagnostics/live-data.jpeg',
      imageAlt: 'OHW808 live data screen',
    },
    {
      title: 'Actuation Test',
      description:
        'Test supported actuators; available tests depend on the manufacturer and model.',
      icon: 'machine',
      image: '/images/diagnostics/actuation-test.jpeg',
      imageAlt: 'OHW808 actuation test screen',
    },
    {
      title: 'Special Functions',
      description:
        'Perform supported component adaptation or variable coding after repair or replacement.',
      icon: 'shield',
    },
    {
      title: 'Calibration Functions',
      description: 'Access supported ECU calibration and fine-tuning functions for repair work.',
      icon: 'screen',
    },
  ],
  coverageGroups: [
    {
      title: 'International Construction Machinery',
      icon: 'machine',
      brands: [
        'Bobcat',
        'Isuzu CM',
        'Yanmar',
        'Volvo Construction Machinery',
        'JCB',
        'Case',
        'Caterpillar Pro',
        'New Holland',
        'Hitachi Machinery',
        'Hyundai',
        'Kato',
        'Kobelco Machinery',
        'Komatsu',
        'Kubota',
        'Sumitomo',
        'Zhenyu',
      ],
    },
    {
      title: 'International Agricultural Machinery',
      icon: 'tractor',
      brands: ['Fendt', 'Massey Ferguson', 'Claas', 'John Deere', 'New Holland'],
    },
    {
      title: 'Chinese Construction Machinery',
      icon: 'machine',
      brands: [
        'XCMG',
        'Chengdu Shinkansen',
        'Daxin Machinery',
        'Foton Lovol',
        'Fuwa Machinery',
        'Fuzhou Sanyuan',
        'Hengt Machinery',
        'Himore Machinery',
        'Jonyang Machinery',
        'Lishide Machinery',
        'LiuGong Machinery',
        'Longgong Machinery',
        'Pengpu Machinery',
        'SANY Heavy Industry',
        'Shandong Shantui',
        'Shangong Machinery',
        'Shanhe Intelligence',
        'Shuntong Machinery',
        'Taishan Machinery',
        'XGMA',
        'Xinyuan Heavy Industry',
        'Yellow River Machinery',
        'YTO Machinery',
        'Yutong Machinery',
        'Yuchai Machinery',
        'Zhenyu Machinery',
        'Zhongyou Machinery',
        'Zoomlion Heavy Industry',
        'Zoomlion Machinery',
      ],
    },
    {
      title: 'Engine Diagnostics',
      icon: 'engine',
      brands: ['Cummins', 'DAF', 'Daewoo', 'Deutz', 'Doosan', 'Isuzu', 'Perkins', 'Volvo Penta'],
    },
    {
      title: 'HD OBD',
      icon: 'obd',
      brands: ['Heavy-duty OBD diagnostics'],
    },
  ],
  workflow: [
    {
      title: 'Select Cummins',
      description: 'Open Engine Diagnostics and select Cummins.',
      image: '/images/workflow/cummins-select.jpeg',
      imageAlt: 'OHW808 Cummins engine diagnostic selection',
    },
    {
      title: 'Choose Diagnostic Mode',
      description: 'Select DEMO or the target equipment diagnostic mode.',
      image: '/images/workflow/cummins-demo.jpeg',
      imageAlt: 'OHW808 Cummins DEMO selection',
    },
    {
      title: 'Choose Engine System',
      description: 'Select the corresponding engine system for the equipment.',
      image: '/images/workflow/cummins-system.jpeg',
      imageAlt: 'OHW808 Cummins engine system selection',
    },
    {
      title: 'Start Diagnosis',
      description: 'Enter the main diagnostic interface and choose the required function.',
      image: '/images/workflow/cummins-functions.jpeg',
      imageAlt: 'OHW808 Cummins main diagnostic interface',
    },
  ],
  additionalTools: [
    {
      title: 'Pin Inspection',
      description:
        'Measure voltage at the 16-pin OBD connector and identify supported K-line and CAN-line pin positions.',
      icon: 'obd',
      image: '/images/tools/pin-inspection.jpeg',
      imageAlt: 'OHW808 pin inspection interface',
    },
    {
      title: 'Remote Diagnosis',
      description:
        'Connect the online tablet to after-sales technicians and approve a remote support request when needed.',
      icon: 'remote',
      image: '/images/tools/remote-diagnosis.jpeg',
      imageAlt: 'OHW808 remote diagnosis interface',
    },
    {
      title: 'Software Upgrade',
      description:
        'Connect to the internet to search for and install available diagnostic software updates.',
      icon: 'update',
      image: '/images/tools/software-upgrade.jpeg',
      imageAlt: 'OHW808 software upgrade interface',
    },
    {
      title: 'Machine Activation',
      description:
        'Connect the device to the internet and activate it from Settings when the trial prompt appears.',
      icon: 'shield',
      image: '/images/tools/machine-activation.jpeg',
      imageAlt: 'OHW808 machine activation interface',
    },
    {
      title: 'Data Cleanup',
      description:
        'Remove unused data with one click to free storage and help the system run steadily.',
      icon: 'database',
      image: '/images/tools/data-cleanup.jpeg',
      imageAlt: 'OHW808 data cleanup interface',
    },
  ],
  specs: [
    { label: 'CPU', value: 'Quad-core 1.8GHz Processor' },
    { label: 'System', value: 'Android 11' },
    { label: 'Memory', value: '8GB RAM + 128GB ROM' },
    { label: 'Screen', value: '10.1-inch, 16:10' },
    { label: 'Resolution', value: '1280 x 800' },
    { label: 'Touch Panel', value: 'Capacitive Touch Screen' },
    { label: 'Camera', value: '8MP with LED Flash' },
    { label: 'Wi-Fi', value: 'Dual-band 2.4GHz + 5GHz' },
    { label: 'Bluetooth', value: 'Bluetooth 4.2 / 5.0 Compatible' },
    { label: 'Sensors', value: 'Ambient Light Sensor and G-Sensor' },
    { label: 'Battery', value: '10000mAh, 3.7V' },
    { label: 'Operating Temperature', value: '-10°C to 50°C' },
    { label: 'Storage Temperature', value: '-20°C to 60°C' },
  ],
  languages: ['Simplified Chinese', 'Traditional Chinese', 'English', 'Spanish', 'Russian'],
  packageGroups: [
    {
      title: 'Main Equipment',
      items: [
        'Tablet x1',
        'VCI x1',
        '12V DC Power Supply x1',
        'Type-C Data Cable x1',
        'Plastic Case x1',
      ],
    },
    {
      title: 'Diagnostic Adapters and Cables',
      items: [
        'BOBCAT & DOOSAN-6 x1',
        'BOBCAT-7 x1',
        'CAT-14 x1',
        'CAT-9 x1',
        'CUMMINS-3 x1',
        'DIESEL-6 x1',
        'DIESEL-9 x1',
        'HITACHI-4 x1',
        'HITACHI-6 x1',
        'ISUZU-6 x1',
        'ISUZU-20 x1',
        'JCB-8 x1',
        'KOMATSU-12 x1',
        'KUBOTA-4 x1',
        'VOLVO-14 x1',
        'VOLVO-8 x1',
        'YANMAR-6 x1',
      ],
    },
    {
      title: 'Documents and Accessories',
      items: [
        'User Manual x1',
        'Package List x1',
        'Software List x1',
        'Packing Box x1',
        'PE Bag x3',
        'Drying Agent x1',
        'Lens Cloth x1',
      ],
    },
  ],
  media: [
    {
      type: 'image',
      label: 'OHW808 device',
      src: '/images/ohw808-device.jpg',
      alt: 'Xtruck OHW808 diagnostic device product photo',
    },
    {
      type: 'image',
      label: 'OHW808 software interface',
      src: '/images/ohw808-ui.jpg',
      alt: 'Xtruck OHW808 software interface screenshot',
    },
  ],
  faqs: [
    {
      category: 'Compatibility',
      question: 'What equipment does OHW808 support?',
      answer:
        'OHW808 covers supported international and Chinese construction machinery, agricultural machinery, diesel engine systems and HD OBD. Coverage and functions vary by equipment.',
    },
    {
      category: 'Compatibility',
      question: 'How can I confirm compatibility?',
      answer:
        'Send the equipment brand, model, year, engine model and required diagnostic functions to Xtruck on WhatsApp before ordering.',
    },
    {
      category: 'Languages',
      question: 'Which languages are supported?',
      answer:
        'The supplied product information lists Simplified Chinese, Traditional Chinese, English, Spanish and Russian. More languages may be added through future updates.',
    },
    {
      category: 'Activation',
      question: 'How does machine activation work?',
      answer:
        'When the trial-use prompt appears, connect OHW808 to the internet, open Settings and select Machine Activation.',
    },
    {
      category: 'Updates',
      question: 'How are software updates installed?',
      answer:
        'Connect the tablet to the internet, open Upgrade from the main menu and install the available diagnostic software updates.',
    },
    {
      category: 'Support',
      question: 'How does remote technical support work?',
      answer:
        'Open Remote Diagnosis while connected to the internet, share the displayed device ID with the after-sales team and approve the remote request when it arrives.',
    },
    {
      category: 'Warranty',
      question: 'What is covered by the warranty?',
      answer:
        'The main unit and power adapter have a 1-year warranty. Non-man-made quality issues reported within one month are eligible for repair or same-model replacement under the supplied policy.',
    },
    {
      category: 'Warranty',
      question: 'What is not covered by the warranty?',
      answer:
        'Cables, connectors, manuals, packaging and gifts are not covered. Collision, liquid damage, unauthorized disassembly and incorrect wiring are also excluded. The buyer pays return shipping, packaging and insurance costs.',
    },
  ],
}
