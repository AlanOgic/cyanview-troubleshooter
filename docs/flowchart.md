# Decision Tree Documentation

This document describes the complete troubleshooting flowchart logic used in the Cyanview Network Troubleshooter.

## Entry Point

Users select from three main troubleshooting paths:

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRY POINT                               │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │ Network / Device │  │  REMI / Cloud    │  │ DataBridge │ │
│  │     Setup        │  │    Control       │  │ (Haivision)│ │
│  └────────┬─────────┘  └────────┬─────────┘  └─────┬──────┘ │
│           │                     │                   │        │
│           ▼                     ▼                   ▼        │
│        start              remi_entry         databridge_start│
└─────────────────────────────────────────────────────────────┘
```

---

## Path 1: Network / Device Setup

### Physical Layer Checks

```
start: "Are any LEDs visible?"
    │
    ├── NO → power_issue (Resolution: Check power source)
    │
    └── YES → ethernet_green: "Steady GREEN LED on Ethernet?"
                │
                ├── NO → cable_issue (Resolution: Check cable/switch)
                │
                └── YES → ethernet_orange: "BLINKING orange LED?"
                            │
                            ├── NO → no_activity (Resolution: Wait/check)
                            │
                            └── YES → ping_test
```

### Network Layer Checks

```
ping_test: "Can you ping 10.192.X.Y?"
    │
    ├── NO → subnet_check: "Using 255.255.0.0 subnet?"
    │           │
    │           ├── NO → subnet_fix ⭐ MOST COMMON ISSUE
    │           │
    │           └── YES → ip_range_check: "IP in 10.192.x.x?"
    │                       │
    │                       ├── NO → ip_fix
    │                       │
    │                       └── YES → switch_type_check
    │
    └── YES → web_ui_access
```

### Switch Configuration

```
switch_type_check: "Using Cisco switch?"
    │
    ├── NO → firewall_check
    │
    └── YES → portfast_check: "Portfast enabled?"
                │
                ├── NO → portfast_fix ⭐ CRITICAL FOR CISCO
                │
                └── YES → firewall_check
```

### Firewall & Stability

```
firewall_check: "UDP 3838 allowed?"
    │
    ├── NO → firewall_fix
    │
    └── YES → arp_check: "Connection stable?"
                │
                ├── YES → web_ui_access
                │
                └── NO → netgear_check: "Using Netgear?"
                            │
                            ├── YES → netgear_fix ⭐ KNOWN CONFLICT
                            │
                            └── NO → general_instability
```

### Discovery & Camera

```
web_ui_access: "Can access web interface?"
    │
    ├── NO → web_ui_fix
    │
    └── YES → discovery_check: "RIO in Discovery page?"
                │
                ├── NO → discovery_issue → (wireless check) → manual_ip_fix
                │
                └── YES → camera_connection: "Camera responding?"
                            │
                            ├── YES → success ✅
                            │
                            └── NO → ci0_status_check → camera_protocol
```

---

## Path 2: REMI / Cloud Control

### Device Type Selection

```
remi_entry: "RIO or RCP vs RIO-Live?"
    │
    ├── RIO-Live → remi_rio_live_limit (LAN only, upgrade info)
    │
    └── RIO/RCP → remi_start: "LAN or WAN?"
                    │
                    ├── LAN → remi_lan_start
                    │
                    └── WAN → remi_wan_start
```

### LAN REMI Flow

```
remi_lan_start: "Devices can ping each other?"
    │
    ├── NO → remi_lan_network_issue
    │
    └── YES → remi_lan_tags: "Same REMI tag?"
                │
                ├── NO → remi_lan_tags_fix
                │
                └── YES → remi_lan_discovery: "RIO appears in REMI?"
                            │
                            ├── NO → remi_lan_discovery_fix
                            │
                            └── YES → remi_camera_export
```

### WAN/Cloud REMI Flow

```
remi_wan_start: "Cloud icon GREEN on both?"
    │
    ├── NO → remi_cloud_connection: "Internet access?"
    │           │
    │           ├── NO → remi_internet_fix
    │           │
    │           └── YES → remi_cloud_firewall (Port 7887)
    │
    └── YES → remi_wan_tags: "Same REMI tag?"
                │
                ├── NO → remi_wan_tags_fix
                │
                └── YES → remi_wan_discovery: "RIO appears with cloud icon?"
                            │
                            ├── NO → remi_wan_discovery_fix
                            │
                            └── YES → remi_camera_export
```

### Camera Export/Import Flow

```
remi_camera_export: "Camera configured on RIO?"
    │
    ├── NO → remi_camera_setup
    │
    └── YES → remi_camera_visible: "Camera listed under RIO in REMI?"
                │
                ├── NO → remi_camera_not_visible
                │
                └── YES → remi_camera_import: "Camera in RCP Configuration?"
                            │
                            ├── NO → remi_import_issue
                            │
                            └── YES → remi_camera_control: "Can control?"
                                        │
                                        ├── YES → remi_success ✅
                                        │
                                        └── NO → remi_control_issue
```

---

## Path 3: Haivision DataBridge

```
databridge_start: "Using Haivision DataBridge?"
    │
    ├── NO → remi_start (use standard REMI)
    │
    └── YES → databridge_license: "License active?"
                │
                ├── NO → databridge_license_fix
                │
                └── YES → databridge_eth2: "RIO on ETH2?"
                            │
                            ├── NO → databridge_eth2_fix
                            │
                            └── YES → databridge_gateway: "Gateway mode?"
                                        │
                                        ├── NO → databridge_gateway_fix
                                        │
                                        └── YES → databridge_status: "Active?"
                                                    │
                                                    ├── NO → databridge_connection_fix
                                                    │
                                                    └── YES → databridge_rcp_route
                                                                │
                                                                └── databridge_manual_ip
                                                                    │
                                                                    └── remi_camera_visible
```

---

## Node Types

### Decision Node
```javascript
{
  id: 'unique_id',
  type: 'decision',
  icon: 'network',
  question: 'Question text?',
  hint: 'Helpful context',
  yes: 'next_node_if_yes',
  no: 'next_node_if_no',
  yesLabel: 'Custom Yes',  // optional
  noLabel: 'Custom No'     // optional
}
```

### Resolution Node
```javascript
{
  id: 'unique_id',
  type: 'resolution',
  icon: 'settings',
  title: 'Issue Title',
  severity: 'critical',  // critical | warning | info
  steps: [
    'Step 1',
    'Step 2'
  ],
  nextCheck: 'return_to_node',  // optional
  techNote: 'Technical explanation'  // optional
}
```

### Success Node
```javascript
{
  id: 'unique_id',
  type: 'success',
  icon: 'success',
  title: 'Success!',
  message: 'Description',
  links: [
    { label: 'Link Text', url: 'https://...' }
  ]
}
```

### Entry Node
```javascript
{
  id: 'unique_id',
  type: 'entry',
  icon: 'settings',
  title: 'Selection Title',
  options: [
    { label: 'Option 1', description: 'Desc', target: 'target_node' }
  ]
}
```

---

## Common Issues Quick Reference

| Issue | Node | Severity |
|-------|------|----------|
| Wrong subnet mask (/24 vs /16) | `subnet_fix` | Critical |
| Cisco Portfast disabled | `portfast_fix` | Critical |
| Netgear ARP conflict | `netgear_fix` | Critical |
| Firewall blocking UDP 3838 | `firewall_fix` | Warning |
| Cloud port 7887 blocked | `remi_cloud_firewall` | Warning |
| WiFi blocking discovery | `manual_ip_fix` | Info |
| RIO-Live WAN limitation | `remi_rio_live_limit` | Warning |
| DataBridge license missing | `databridge_license_fix` | Critical |

---

## Statistics

- **Total nodes**: 58
- **Decision nodes**: 28
- **Resolution nodes**: 26
- **Success nodes**: 2
- **Entry nodes**: 2
- **Average path length**: 5-8 steps
