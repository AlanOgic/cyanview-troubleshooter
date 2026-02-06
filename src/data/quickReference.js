const quickReference = {
  ports: [
    { port: 'UDP 3838', purpose: 'Device Discovery' },
    { port: 'TCP 1883', purpose: 'MQTT Communication' },
    { port: 'TCP 7887', purpose: 'Cloud/REMI (outbound)' }
  ],
  ips: [
    { format: '10.192.X.Y', note: 'X.Y = last 2 digits of serial' },
    { format: '255.255.0.0', note: 'Required subnet mask (/16)' }
  ],
  leds: [
    { color: 'Green (steady)', meaning: '100 Mbps link active' },
    { color: 'Orange (blinking)', meaning: 'Network activity' },
    { color: 'No LEDs', meaning: 'No power or link' }
  ],
  cloud: [
    { server: 'remi.cyanview.com', note: 'Main (dynamic)' },
    { server: '1-eu-west-3.remi.cyanview.com', note: 'Europe' },
    { server: '1-us-west-2.remi.cyanview.com', note: 'US West' }
  ],
  remi: [
    { icon: '\u{1F7E2} Cloud', meaning: 'Connected to internet/cloud' },
    { icon: '\u{1F535} Ethernet', meaning: 'Local network only' },
    { icon: '\u{1F534} Red/Gray', meaning: 'No cloud connection' }
  ]
};

export default quickReference;
