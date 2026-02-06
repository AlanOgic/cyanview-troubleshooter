// Flowchart decision tree data
const flowchartData = {
  entry: {
    id: 'entry',
    type: 'entry',
    icon: 'settings',
    title: 'What issue are you experiencing?',
    options: [
      { label: 'Network / Device Setup', description: 'LEDs, connectivity, discovery issues', target: 'start' },
      { label: 'REMI / Cloud Control', description: 'Remote control, cloud connection, camera sharing', target: 'remi_entry' },
      { label: 'DataBridge (Haivision)', description: 'REMI via Haivision encoders', target: 'databridge_start' }
    ]
  },
  remi_entry: {
    id: 'remi_entry',
    type: 'decision',
    icon: 'cloud',
    question: 'What type of device are you trying to set up for REMI?',
    hint: 'RIO-Live has LAN-only limitations. Full RIO and RCP support cloud/WAN.',
    yes: 'remi_start',
    no: 'remi_rio_live_limit',
    yesLabel: 'RIO or RCP',
    noLabel: 'RIO-Live'
  },
  start: {
    id: 'start',
    type: 'decision',
    icon: 'power',
    question: 'Are any LEDs visible on your Cyanview device?',
    hint: 'Check the Ethernet port and any status LEDs on the front panel',
    yes: 'ethernet_green',
    no: 'power_issue'
  },
  power_issue: {
    id: 'power_issue',
    type: 'resolution',
    icon: 'alert',
    title: 'Power Delivery Issue',
    severity: 'critical',
    steps: [
      'If using PoE: Try connecting a 12V DC external power supply instead',
      'If using 12V DC: Try a PoE switch (802.3af for RCP/CI0)',
      'Verify your PoE switch provides sufficient power (15.4W for 802.3af)',
      'Check that the power cable is firmly connected',
      'Try a different power outlet or PoE port'
    ],
    nextCheck: 'start'
  },
  ethernet_green: {
    id: 'ethernet_green',
    type: 'decision',
    icon: 'network',
    question: 'Do you see a steady GREEN LED on the Ethernet port?',
    hint: 'Green LED indicates a valid 100 Mbps network link',
    yes: 'ethernet_orange',
    no: 'cable_issue'
  },
  cable_issue: {
    id: 'cable_issue',
    type: 'resolution',
    icon: 'alert',
    title: 'Cable or Switch Port Issue',
    severity: 'warning',
    steps: [
      'Try a different Ethernet cable (use Cat5e or better)',
      'Try a different port on your network switch',
      'Verify the switch port is enabled and not in error state',
      'Check for bent or damaged RJ45 connector pins',
      'If using PoE, ensure the switch port has PoE enabled'
    ],
    nextCheck: 'start'
  },
  ethernet_orange: {
    id: 'ethernet_orange',
    type: 'decision',
    icon: 'network',
    question: 'Do you see a BLINKING orange/amber LED on the Ethernet port?',
    hint: 'Blinking orange indicates network activity (data transfer)',
    yes: 'ping_test',
    no: 'no_activity'
  },
  no_activity: {
    id: 'no_activity',
    type: 'resolution',
    icon: 'info',
    title: 'No Network Activity Detected',
    severity: 'warning',
    steps: [
      'The device has link but no traffic — this is often normal at startup',
      'Wait 30 seconds for the device to fully boot',
      'Check if the switch port shows activity on its side',
      'Verify no VLANs are isolating the device',
      'Proceed to ping test to verify connectivity'
    ],
    nextCheck: 'ping_test'
  },
  ping_test: {
    id: 'ping_test',
    type: 'decision',
    icon: 'terminal',
    question: 'Can you ping the device at its factory IP address?',
    hint: 'Factory IP = 10.192.X.Y where X.Y are the last two digits of serial number. Open terminal and type: ping 10.192.X.Y',
    yes: 'web_ui_access',
    no: 'subnet_check'
  },
  subnet_check: {
    id: 'subnet_check',
    type: 'decision',
    icon: 'settings',
    question: 'Is your computer configured with subnet mask 255.255.0.0 (/16)?',
    hint: 'This is the #1 cause of connection failures! Check your network adapter settings.',
    yes: 'ip_range_check',
    no: 'subnet_fix'
  },
  subnet_fix: {
    id: 'subnet_fix',
    type: 'resolution',
    icon: 'success',
    title: 'Subnet Mask Configuration Required',
    severity: 'critical',
    steps: [
      'Open your network adapter settings',
      'Set a static IP address: 10.192.100.1 (or any unused 10.192.x.x)',
      'Set subnet mask to: 255.255.0.0 (NOT 255.255.255.0)',
      'Leave gateway blank or set to 10.192.0.1',
      'Apply settings and retry ping'
    ],
    nextCheck: 'ping_test',
    techNote: 'Cyanview uses a /16 network. Using /24 (255.255.255.0) prevents communication between different 10.192.X.x ranges.'
  },
  ip_range_check: {
    id: 'ip_range_check',
    type: 'decision',
    icon: 'settings',
    question: 'Is your computer\'s IP address in the 10.192.x.x range?',
    hint: 'Your PC must be on the same network segment as the Cyanview device',
    yes: 'switch_type_check',
    no: 'ip_fix'
  },
  ip_fix: {
    id: 'ip_fix',
    type: 'resolution',
    icon: 'success',
    title: 'IP Address Configuration Required',
    severity: 'warning',
    steps: [
      'Open your network adapter settings',
      'Set IP address to: 10.192.100.1 (or any unused 10.192.x.x address)',
      'Ensure it doesn\'t conflict with any device serial numbers',
      'Keep subnet mask as: 255.255.0.0',
      'Apply and retry connection'
    ],
    nextCheck: 'ping_test'
  },
  switch_type_check: {
    id: 'switch_type_check',
    type: 'decision',
    icon: 'network',
    question: 'Are you using a managed Cisco switch?',
    hint: 'Cisco switches require special configuration for Cyanview devices',
    yes: 'portfast_check',
    no: 'firewall_check'
  },
  portfast_check: {
    id: 'portfast_check',
    type: 'decision',
    icon: 'settings',
    question: 'Is Portfast enabled on the switch ports?',
    hint: 'Without Portfast, Spanning Tree causes 30-50 second delays',
    yes: 'firewall_check',
    no: 'portfast_fix'
  },
  portfast_fix: {
    id: 'portfast_fix',
    type: 'resolution',
    icon: 'success',
    title: 'Enable Cisco Portfast',
    severity: 'critical',
    steps: [
      'Access your Cisco switch CLI',
      'Enter configuration mode: configure terminal',
      'For specific port: interface GigabitEthernet0/1',
      'Enable portfast: spanning-tree portfast',
      'Or globally: spanning-tree portfast default',
      'Save config: write memory'
    ],
    nextCheck: 'ping_test',
    techNote: 'Spanning Tree Protocol delays port activation by 30-50 seconds, disrupting Cyanview discovery.'
  },
  firewall_check: {
    id: 'firewall_check',
    type: 'decision',
    icon: 'shield',
    question: 'Is UDP port 3838 allowed through your firewall?',
    hint: 'Cyanview uses UDP 3838 for device discovery broadcasts',
    yes: 'arp_check',
    no: 'firewall_fix'
  },
  firewall_fix: {
    id: 'firewall_fix',
    type: 'resolution',
    icon: 'success',
    title: 'Firewall Configuration Required',
    severity: 'warning',
    steps: [
      'Open Windows Firewall or your security software',
      'Create inbound rule for UDP port 3838',
      'Create outbound rule for UDP port 3838',
      'Also allow TCP port 1883 (MQTT communication)',
      'Restart the Cyanview application after changes'
    ],
    nextCheck: 'ping_test',
    techNote: 'UDP 3838 = Discovery, TCP 1883 = MQTT control, TCP 7887 = Cloud (outbound only)'
  },
  arp_check: {
    id: 'arp_check',
    type: 'decision',
    icon: 'alert',
    question: 'Is your connection stable, or does it drop intermittently?',
    hint: 'Random disconnections may indicate ARP conflicts',
    yes: 'web_ui_access',
    no: 'netgear_check'
  },
  netgear_check: {
    id: 'netgear_check',
    type: 'decision',
    icon: 'network',
    question: 'Are you using a Netgear router or 4G modem on this network?',
    hint: 'Netgear devices have a known ARP conflict with Cyanview equipment',
    yes: 'netgear_fix',
    no: 'general_instability'
  },
  netgear_fix: {
    id: 'netgear_fix',
    type: 'resolution',
    icon: 'alert',
    title: 'Netgear ARP Conflict',
    severity: 'critical',
    steps: [
      'This is a known hardware incompatibility',
      'Remove Netgear device from the Cyanview network segment',
      'Use Netgear only for internet access on a separate subnet',
      'Consider replacing with a different brand router',
      'Alternatively, use static ARP entries if your switch supports them'
    ],
    nextCheck: 'ping_test',
    techNote: 'Netgear 4G modems incorrectly respond to ARP requests meant for Cyanview devices.'
  },
  general_instability: {
    id: 'general_instability',
    type: 'resolution',
    icon: 'info',
    title: 'Network Instability Troubleshooting',
    severity: 'warning',
    steps: [
      'Check for IP address conflicts (two devices with same IP)',
      'Verify no duplicate MAC addresses on network',
      'Check switch port error counters for CRC/collision errors',
      'Try connecting device directly to computer (bypass switch)',
      'Update switch firmware if available',
      'Check for electromagnetic interference near cables'
    ],
    nextCheck: 'start'
  },
  web_ui_access: {
    id: 'web_ui_access',
    type: 'decision',
    icon: 'monitor',
    question: 'Can you access the device\'s web interface?',
    hint: 'Open browser and navigate to http://10.192.X.Y (device IP)',
    yes: 'discovery_check',
    no: 'web_ui_fix'
  },
  web_ui_fix: {
    id: 'web_ui_fix',
    type: 'resolution',
    icon: 'info',
    title: 'Web Interface Access Issue',
    severity: 'warning',
    steps: [
      'Try using the mDNS address: http://cy-[model]-XX-YYY.local',
      'Clear browser cache and try again',
      'Try a different browser (Chrome recommended)',
      'Disable browser proxy settings temporarily',
      'Check if device is still responding to ping'
    ],
    nextCheck: 'web_ui_access'
  },
  discovery_check: {
    id: 'discovery_check',
    type: 'decision',
    icon: 'search',
    question: 'Does your RIO appear in the RCP\'s Discovery page?',
    hint: 'Open RCP web UI → Navigate to Discovery tab',
    yes: 'camera_connection',
    no: 'discovery_issue'
  },
  discovery_issue: {
    id: 'discovery_issue',
    type: 'decision',
    icon: 'wifi',
    question: 'Are you using wireless/WiFi for any part of the connection?',
    hint: 'Wireless networks often block UDP broadcast discovery',
    yes: 'manual_ip_fix',
    no: 'same_subnet_check'
  },
  manual_ip_fix: {
    id: 'manual_ip_fix',
    type: 'resolution',
    icon: 'success',
    title: 'Manual IP Entry Required',
    severity: 'info',
    steps: [
      'Open RCP web interface',
      'Navigate to the REMI tab',
      'Click "Advanced Mode" to expand options',
      'Find the "Manual IP" section',
      'Enter the RIO\'s IP address (10.192.X.Y)',
      'Click Add/Connect'
    ],
    nextCheck: 'discovery_check',
    techNote: 'WiFi access points typically block UDP broadcast packets, preventing automatic discovery.'
  },
  same_subnet_check: {
    id: 'same_subnet_check',
    type: 'resolution',
    icon: 'info',
    title: 'Verify Same Network Segment',
    severity: 'warning',
    steps: [
      'Confirm RCP and RIO are on same physical network/VLAN',
      'Check both devices\' IP addresses start with 10.192',
      'Verify no router between devices (must be Layer 2)',
      'Try pinging RIO from a computer that can reach RCP',
      'Check switch VLAN configuration if applicable',
      'As last resort, try manual IP entry in REMI tab'
    ],
    nextCheck: 'discovery_check'
  },
  camera_connection: {
    id: 'camera_connection',
    type: 'decision',
    icon: 'camera',
    question: 'Is your camera responding to RCP controls?',
    hint: 'Try adjusting iris or other parameters from the RCP',
    yes: 'success',
    no: 'ci0_status_check'
  },
  ci0_status_check: {
    id: 'ci0_status_check',
    type: 'decision',
    icon: 'cpu',
    question: 'If using CI0: Does the screen show a bold number (not X or small number)?',
    hint: 'X = no RCP comm, small number = config only, BOLD = full connection',
    yes: 'camera_protocol',
    no: 'ci0_troubleshoot'
  },
  ci0_troubleshoot: {
    id: 'ci0_troubleshoot',
    type: 'resolution',
    icon: 'info',
    title: 'CI0 Communication Issue',
    severity: 'warning',
    steps: [
      'If showing "X": CI0 sees network but not RCP — check RCP is online',
      'If showing small number: Configuration received but no camera link',
      'Verify camera serial cable is connected to correct CI0 port',
      'Check camera protocol matches CI0 configuration',
      'Press CI0 button to cycle display: Name → IP → MAC',
      'Restart CI0 and RCP if issue persists'
    ],
    nextCheck: 'camera_connection'
  },
  camera_protocol: {
    id: 'camera_protocol',
    type: 'resolution',
    icon: 'settings',
    title: 'Camera Protocol Configuration',
    severity: 'info',
    steps: [
      'Verify correct camera model selected in RCP configuration',
      'Check serial cable matches camera requirements (straight vs crossed)',
      'Confirm baud rate matches camera specifications',
      'Some cameras need specific initialization sequences',
      'Check camera firmware is compatible with Cyanview',
      'Consult support.cyanview.com for camera-specific guides'
    ],
    nextCheck: 'camera_connection'
  },
  success: {
    id: 'success',
    type: 'success',
    icon: 'success',
    title: 'System Operational!',
    message: 'Your Cyanview system is working correctly. If you experience issues later, restart this troubleshooter.',
    links: [
      { label: 'Cyanview Support Docs', url: 'https://support.cyanview.com' },
      { label: 'IP Configuration Guide', url: 'https://support.cyanview.com/docs/Configuration/ConfIP' },
      { label: 'Contact Support', url: 'mailto:support@cyanview.com' }
    ]
  },

  // ============================================
  // REMI / CLOUD TROUBLESHOOTING BRANCH
  // ============================================

  remi_start: {
    id: 'remi_start',
    type: 'decision',
    icon: 'cloud',
    question: 'Are you setting up REMI for LAN (local network) or WAN (cloud/internet)?',
    hint: 'LAN = same physical network. WAN = remote location via internet/4G.',
    yes: 'remi_wan_start',
    no: 'remi_lan_start',
    yesLabel: 'WAN/Cloud',
    noLabel: 'LAN/Local'
  },

  // --- LAN REMI BRANCH ---
  remi_lan_start: {
    id: 'remi_lan_start',
    type: 'decision',
    icon: 'network',
    question: 'Can both devices (RCP and RIO) ping each other?',
    hint: 'From a computer, try pinging both device IPs. They should be on the same subnet.',
    yes: 'remi_lan_tags',
    no: 'remi_lan_network_issue'
  },
  remi_lan_network_issue: {
    id: 'remi_lan_network_issue',
    type: 'resolution',
    icon: 'alert',
    title: 'LAN Connectivity Issue',
    severity: 'critical',
    steps: [
      'Verify both devices are on the same physical network/switch',
      'Confirm both use the 10.192.x.x IP range',
      'Check subnet mask is 255.255.0.0 (/16) on all devices',
      'Ensure no VLANs are separating the devices',
      'Try connecting both devices to the same switch temporarily'
    ],
    nextCheck: 'remi_lan_start',
    techNote: 'REMI LAN uses direct device discovery via UDP 3838 broadcasts. Devices must be on the same Layer 2 network.'
  },
  remi_lan_tags: {
    id: 'remi_lan_tags',
    type: 'decision',
    icon: 'settings',
    question: 'Do both devices have the SAME REMI tag configured?',
    hint: 'Check REMI tab → Shared Camera Control → Tags section on both devices',
    yes: 'remi_lan_discovery',
    no: 'remi_lan_tags_fix'
  },
  remi_lan_tags_fix: {
    id: 'remi_lan_tags_fix',
    type: 'resolution',
    icon: 'success',
    title: 'Configure Matching REMI Tags',
    severity: 'info',
    steps: [
      'Open web UI on both RCP and RIO',
      'Navigate to the REMI tab',
      'In "Shared Camera Control" section, enter a tag name',
      'Click the + button to add the tag',
      'Use the EXACT same tag on both devices (case-sensitive)',
      'Tags act as passwords — use secure, non-guessable names'
    ],
    nextCheck: 'remi_lan_tags',
    techNote: 'Devices with matching tags form a "group" and can share cameras. One device can have multiple tags.'
  },
  remi_lan_discovery: {
    id: 'remi_lan_discovery',
    type: 'decision',
    icon: 'search',
    question: 'Does the RIO appear in the RCP\'s REMI page?',
    hint: 'Check RCP → REMI tab. You should see the RIO listed with an Ethernet icon.',
    yes: 'remi_camera_export',
    no: 'remi_lan_discovery_fix'
  },
  remi_lan_discovery_fix: {
    id: 'remi_lan_discovery_fix',
    type: 'resolution',
    icon: 'info',
    title: 'LAN Discovery Troubleshooting',
    severity: 'warning',
    steps: [
      'Refresh the REMI page on both devices',
      'Verify UDP 3838 is not blocked by any firewall',
      'Check that tags match EXACTLY (spaces count!)',
      'Reboot both devices and wait 60 seconds',
      'If using managed switches, check for broadcast filtering',
      'Try adding RIO IP manually in Advanced Mode'
    ],
    nextCheck: 'remi_manual_ip',
    techNote: 'LAN discovery uses UDP broadcast. Some enterprise networks filter broadcasts between ports.'
  },

  // --- WAN/CLOUD REMI BRANCH ---
  remi_wan_start: {
    id: 'remi_wan_start',
    type: 'decision',
    icon: 'cloud',
    question: 'Is the cloud icon GREEN in the REMI tab on both devices?',
    hint: 'Green cloud = connected to Cyanview rendezvous server. Red/gray = no cloud connection.',
    yes: 'remi_wan_tags',
    no: 'remi_cloud_connection'
  },
  remi_cloud_connection: {
    id: 'remi_cloud_connection',
    type: 'decision',
    icon: 'wifi',
    question: 'Does the device have internet access?',
    hint: 'Check Admin tab → Connectivity Check. Internet indicator should be green.',
    yes: 'remi_cloud_firewall',
    no: 'remi_internet_fix'
  },
  remi_internet_fix: {
    id: 'remi_internet_fix',
    type: 'resolution',
    icon: 'alert',
    title: 'Internet Connection Required',
    severity: 'critical',
    steps: [
      'Connect the device to a network with internet access',
      'For 4G: Insert SIM card and verify data plan is active',
      'Configure WAN interface in IP Configuration page',
      'Set DHCP or enter static IP + gateway + DNS',
      'DNS servers: 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)',
      'Check Admin → Connectivity Check for status'
    ],
    nextCheck: 'remi_cloud_connection',
    techNote: 'Cloud requires outgoing internet. All connections are outbound, so no port forwarding needed on your router.'
  },
  remi_cloud_firewall: {
    id: 'remi_cloud_firewall',
    type: 'resolution',
    icon: 'shield',
    title: 'Cloud Connection Blocked',
    severity: 'warning',
    steps: [
      'The device has internet but cannot reach Cyanview cloud',
      'Check if corporate firewall blocks outgoing port 7887',
      'Required: Allow outgoing TCP to port 7887',
      'DNS: remi.cyanview.com (or regional servers)',
      'EU server: 1-eu-west-3.remi.cyanview.com',
      'US server: 1-us-west-2.remi.cyanview.com',
      'Ask IT to whitelist these addresses and port'
    ],
    nextCheck: 'remi_wan_start',
    techNote: 'Cyanview cloud acts as a rendezvous server. Both RCP and RIO make OUTGOING connections to port 7887.'
  },
  remi_wan_tags: {
    id: 'remi_wan_tags',
    type: 'decision',
    icon: 'settings',
    question: 'Do both devices have the SAME REMI tag configured?',
    hint: 'Tags must match exactly. They act as passwords for your camera group.',
    yes: 'remi_wan_discovery',
    no: 'remi_wan_tags_fix'
  },
  remi_wan_tags_fix: {
    id: 'remi_wan_tags_fix',
    type: 'resolution',
    icon: 'success',
    title: 'Configure Matching Cloud Tags',
    severity: 'info',
    steps: [
      'Open web UI on both RCP and RIO',
      'Navigate to the REMI tab',
      'Add identical tag to both devices',
      'Use a secure, unique tag name (it acts as a password)',
      'Avoid guessable names like "test" or company names',
      'Consider adding random characters for security'
    ],
    nextCheck: 'remi_wan_tags',
    techNote: 'Anyone who knows your tag can access your cameras. Treat tags like passwords.'
  },
  remi_wan_discovery: {
    id: 'remi_wan_discovery',
    type: 'decision',
    icon: 'cloud',
    question: 'Does the remote RIO appear in the RCP\'s REMI page with a cloud icon?',
    hint: 'Cloud icon next to device = reachable via internet. Ethernet icon = local only.',
    yes: 'remi_camera_export',
    no: 'remi_wan_discovery_fix'
  },
  remi_wan_discovery_fix: {
    id: 'remi_wan_discovery_fix',
    type: 'resolution',
    icon: 'info',
    title: 'Cloud Discovery Troubleshooting',
    severity: 'warning',
    steps: [
      'Verify cloud icon is GREEN on BOTH devices',
      'Check tags match exactly on both sides',
      'Refresh the REMI page (F5 or reload button)',
      'Wait 30-60 seconds for cloud sync',
      'Try removing and re-adding the tag',
      'Check remi.cyanview.com status page if available',
      'Reboot both devices if issue persists'
    ],
    nextCheck: 'remi_wan_discovery',
    techNote: 'Cloud discovery can take 30-60 seconds after connecting. Both devices must maintain active cloud connections.'
  },

  // --- CAMERA EXPORT/IMPORT BRANCH ---
  remi_camera_export: {
    id: 'remi_camera_export',
    type: 'decision',
    icon: 'camera',
    question: 'Is there a camera configured on the RIO that you want to import?',
    hint: 'The RIO must have a camera set up in its Configuration tab before it can be exported.',
    yes: 'remi_camera_visible',
    no: 'remi_camera_setup'
  },
  remi_camera_setup: {
    id: 'remi_camera_setup',
    type: 'resolution',
    icon: 'settings',
    title: 'Set Up Camera on RIO',
    severity: 'info',
    steps: [
      'Open RIO web interface (local IP or via cloud link)',
      'Go to Configuration tab',
      'Click + to add a new camera',
      'Select camera brand and model',
      'Configure connection (serial port, IP, etc.)',
      'Verify camera icon turns GREEN (communication OK)',
      'Camera will now appear in REMI for export'
    ],
    nextCheck: 'remi_camera_export',
    techNote: 'The RIO configures cameras exactly like an RCP. The camera must show green (connected) before it can be exported.'
  },
  remi_camera_visible: {
    id: 'remi_camera_visible',
    type: 'decision',
    icon: 'search',
    question: 'Do you see the camera listed under the RIO in the RCP\'s REMI page?',
    hint: 'Cameras appear indented below their parent device. Click the checkbox to import.',
    yes: 'remi_camera_import',
    no: 'remi_camera_not_visible'
  },
  remi_camera_not_visible: {
    id: 'remi_camera_not_visible',
    type: 'resolution',
    icon: 'alert',
    title: 'Camera Not Appearing in REMI',
    severity: 'warning',
    steps: [
      'On RIO: Verify camera is configured and shows GREEN',
      'On RIO: Check REMI tab shows "Remote GUI: On"',
      'Refresh RCP REMI page',
      'Check RIO firmware is up to date',
      'Verify RIO is in "exporter" or "both" mode',
      'Advanced: Check /dev/app.html → Cloud block → direction'
    ],
    nextCheck: 'remi_camera_visible',
    techNote: 'RIO default mode is "exporter". If changed to "importer", it won\'t share cameras. Check direction setting.'
  },
  remi_camera_import: {
    id: 'remi_camera_import',
    type: 'decision',
    icon: 'camera',
    question: 'After clicking the checkbox, does the camera appear in RCP Configuration tab?',
    hint: 'Imported cameras appear in the RCP\'s normal camera list with an import indicator.',
    yes: 'remi_camera_control',
    no: 'remi_import_issue'
  },
  remi_import_issue: {
    id: 'remi_import_issue',
    type: 'resolution',
    icon: 'alert',
    title: 'Camera Import Failed',
    severity: 'warning',
    steps: [
      'Uncheck and re-check the camera checkbox',
      'Verify no camera number conflict on RCP',
      'Check RCP has available camera slots (license limit)',
      'Refresh both RCP and RIO web interfaces',
      'Check network stability (intermittent connection?)',
      'Try rebooting the RCP'
    ],
    nextCheck: 'remi_camera_import',
    techNote: 'Imported cameras inherit number and name from source. You can change these on the RCP after import.'
  },
  remi_camera_control: {
    id: 'remi_camera_control',
    type: 'decision',
    icon: 'monitor',
    question: 'Can you control the camera from the RCP (iris, gain, etc.)?',
    hint: 'Try adjusting parameters. Changes should reflect on the actual camera.',
    yes: 'remi_success',
    no: 'remi_control_issue'
  },
  remi_control_issue: {
    id: 'remi_control_issue',
    type: 'decision',
    icon: 'alert',
    question: 'Is the camera showing GREEN status on the RIO side?',
    hint: 'Check RIO Configuration tab. Green = RIO can communicate with camera.',
    yes: 'remi_latency_issue',
    no: 'remi_rio_camera_issue'
  },
  remi_rio_camera_issue: {
    id: 'remi_rio_camera_issue',
    type: 'resolution',
    icon: 'alert',
    title: 'RIO-Camera Communication Problem',
    severity: 'critical',
    steps: [
      'Check physical cable between RIO and camera',
      'Verify correct serial cable type for your camera',
      'Confirm camera model selection matches actual camera',
      'Check camera is powered and in correct mode',
      'Some cameras need specific settings enabled for remote control',
      'Consult camera-specific documentation on support.cyanview.com'
    ],
    nextCheck: 'remi_camera_control',
    techNote: 'The REMI link may be working but the local RIO-camera connection is broken. Fix the RIO side first.'
  },
  remi_latency_issue: {
    id: 'remi_latency_issue',
    type: 'resolution',
    icon: 'info',
    title: 'REMI Link Troubleshooting',
    severity: 'warning',
    steps: [
      'Check RCP-RIO link status in REMI page (should be green)',
      'For WAN: Verify both cloud icons are green',
      'Test with simple commands first (tally, iris)',
      'High latency (>200ms) may feel unresponsive but still works',
      'For 4G: Check signal strength and data speed',
      'Try from a location with better internet'
    ],
    nextCheck: 'remi_camera_control',
    techNote: 'Typical cloud latency is 30-60ms. Acceptable for shading. 4G quality varies significantly by location.'
  },

  // --- REMI ADVANCED ISSUES ---
  remi_manual_ip: {
    id: 'remi_manual_ip',
    type: 'resolution',
    icon: 'settings',
    title: 'Manual IP Entry for REMI',
    severity: 'info',
    steps: [
      'Open RCP web interface → REMI tab',
      'Click the 3-dot menu in top-right corner',
      'Select "Advanced Mode"',
      'Find "Manual IP - Import Cameras from IP" section',
      'Enter the RIO\'s IP address',
      'Click the + button',
      'The RIO should appear once it\'s reachable'
    ],
    nextCheck: 'remi_camera_visible',
    techNote: 'Use manual IP when automatic discovery fails (WiFi, DataBridge, complex routing). The IP is removed once the device appears.'
  },
  remi_rio_live_limit: {
    id: 'remi_rio_live_limit',
    type: 'resolution',
    icon: 'alert',
    title: 'RIO-Live Limitations',
    severity: 'warning',
    steps: [
      'RIO-Live is LIMITED to LAN only (no cloud/WAN)',
      'RIO-Live supports only 1 camera',
      'For WAN control, you need a full RIO license',
      'Contact Cyanview sales to upgrade RIO-Live to RIO',
      'Upgrade unlocks: unlimited cameras + cloud access'
    ],
    nextCheck: 'entry',
    techNote: 'RIO-Live is designed for simple local setups. Upgrade to full RIO for remote/cloud productions.'
  },
  remi_success: {
    id: 'remi_success',
    type: 'success',
    icon: 'success',
    title: 'REMI Connection Successful!',
    message: 'Your remote camera control is working. The RCP can now control cameras connected to the RIO from any location.',
    links: [
      { label: 'REMI Documentation', url: 'https://support.cyanview.com/docs/Configuration/REMI' },
      { label: 'Workflows & Examples', url: 'https://support.cyanview.com/docs/Workflows/BlackmagicHaivision' },
      { label: 'Contact Support', url: 'mailto:support@cyanview.com' }
    ]
  },

  // --- DATABRIDGE BRANCH ---
  databridge_start: {
    id: 'databridge_start',
    type: 'decision',
    icon: 'network',
    question: 'Are you using Haivision DataBridge for your REMI connection?',
    hint: 'DataBridge tunnels Cyanview traffic through Haivision encoders/StreamHub.',
    yes: 'databridge_license',
    no: 'remi_start'
  },
  databridge_license: {
    id: 'databridge_license',
    type: 'decision',
    icon: 'settings',
    question: 'Is DataBridge license active on your StreamHub?',
    hint: 'DataBridge requires a separate license from Haivision.',
    yes: 'databridge_eth2',
    no: 'databridge_license_fix'
  },
  databridge_license_fix: {
    id: 'databridge_license_fix',
    type: 'resolution',
    icon: 'alert',
    title: 'DataBridge License Required',
    severity: 'critical',
    steps: [
      'DataBridge is a licensed feature on Haivision StreamHub',
      'Contact Haivision to purchase DataBridge license',
      'Apply license in StreamHub administration',
      'Verify DataBridge icon appears in StreamHub UI',
      'Alternative: Use Cyanview native cloud (free, no license needed)'
    ],
    nextCheck: 'databridge_license'
  },
  databridge_eth2: {
    id: 'databridge_eth2',
    type: 'decision',
    icon: 'network',
    question: 'Is the RIO connected to ETH2 on the Pro Series transmitter?',
    hint: 'ETH2 must be configured for Gateway mode with matching IP subnet.',
    yes: 'databridge_gateway',
    no: 'databridge_eth2_fix'
  },
  databridge_eth2_fix: {
    id: 'databridge_eth2_fix',
    type: 'resolution',
    icon: 'settings',
    title: 'DataBridge Wiring Setup',
    severity: 'info',
    steps: [
      'Connect RIO to ETH2 port on Haivision Pro Series transmitter',
      'ETH1 is for video — do not use for RIO',
      'Configure ETH2 in Gateway mode on the transmitter',
      'Set ETH2 IP address in the camera network range (e.g., 192.168.9.1)',
      'Set RIO WAN IP in same subnet (e.g., 192.168.9.2)'
    ],
    nextCheck: 'databridge_eth2'
  },
  databridge_gateway: {
    id: 'databridge_gateway',
    type: 'decision',
    icon: 'settings',
    question: 'Is ETH2 configured as "Gateway" mode on the transmitter?',
    hint: 'Gateway mode enables DataBridge to tunnel RIO traffic.',
    yes: 'databridge_status',
    no: 'databridge_gateway_fix'
  },
  databridge_gateway_fix: {
    id: 'databridge_gateway_fix',
    type: 'resolution',
    icon: 'settings',
    title: 'Configure Gateway Mode',
    severity: 'warning',
    steps: [
      'Access Haivision transmitter web interface',
      'Navigate to Network → ETH2 settings',
      'Set Mode to "Gateway"',
      'Configure IP address and subnet for camera network',
      'Enable DataBridge function',
      'Select destination StreamHub'
    ],
    nextCheck: 'databridge_gateway'
  },
  databridge_status: {
    id: 'databridge_status',
    type: 'decision',
    icon: 'cloud',
    question: 'Is DataBridge showing active connection on both transmitter and StreamHub?',
    hint: 'Both sides should show active DataBridge status icons.',
    yes: 'databridge_rcp_route',
    no: 'databridge_connection_fix'
  },
  databridge_connection_fix: {
    id: 'databridge_connection_fix',
    type: 'resolution',
    icon: 'alert',
    title: 'DataBridge Connection Issue',
    severity: 'warning',
    steps: [
      'Verify video link is established first (DataBridge uses same path)',
      'Check StreamHub shows the transmitter as connected',
      'Verify DataBridge is enabled on transmitter',
      'Check destination StreamHub selection is correct',
      'Reboot transmitter if connection won\'t establish'
    ],
    nextCheck: 'databridge_status'
  },
  databridge_rcp_route: {
    id: 'databridge_rcp_route',
    type: 'decision',
    icon: 'network',
    question: 'Does the RCP have a custom route configured to reach the RIO network via StreamHub?',
    hint: 'RCP needs to know to route 192.168.x.x traffic through the StreamHub gateway.',
    yes: 'databridge_manual_ip',
    no: 'databridge_route_fix'
  },
  databridge_route_fix: {
    id: 'databridge_route_fix',
    type: 'resolution',
    icon: 'settings',
    title: 'Configure RCP Custom Route',
    severity: 'critical',
    steps: [
      'Open RCP → IP Configuration',
      'Add a LAN IP in the StreamHub network (e.g., 192.168.1.10)',
      'Add a Custom Route with these settings:',
      '  • Network: Camera subnet (e.g., 192.168.8.0)',
      '  • Netmask: 255.255.248.0 (/21) or appropriate mask',
      '  • Gateway: StreamHub IP (e.g., 192.168.1.5)',
      'Save and verify route is active'
    ],
    nextCheck: 'databridge_rcp_route',
    techNote: 'The route tells RCP to send RIO traffic to StreamHub, which tunnels it through DataBridge to the transmitter.'
  },
  databridge_manual_ip: {
    id: 'databridge_manual_ip',
    type: 'resolution',
    icon: 'success',
    title: 'Add RIO Manually in REMI',
    severity: 'info',
    steps: [
      'DataBridge doesn\'t forward discovery broadcasts',
      'Open RCP → REMI tab → Advanced Mode',
      'Add RIO\'s WAN IP address manually (e.g., 192.168.9.2)',
      'Click + to add',
      'RIO should appear once DataBridge connection is active',
      'Import camera as normal by checking the checkbox'
    ],
    nextCheck: 'remi_camera_visible',
    techNote: 'Manual IP entry is required for DataBridge because UDP discovery broadcasts don\'t traverse the tunnel.'
  }
};

export default flowchartData;
