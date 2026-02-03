# Cyanview Network Troubleshooter

An interactive flowchart-based troubleshooting tool for Cyanview RCP and RIO devices. Helps broadcast engineers and technicians quickly diagnose and resolve network connectivity issues during setup and production.

![Cyanview Troubleshooter](docs/screenshot.png)

## Features

### 🔧 Network Diagnostics
- LED status interpretation (power, link, activity)
- IP addressing validation (factory IPs, subnet masks)
- Cisco Portfast configuration guidance
- Firewall port requirements (UDP 3838, TCP 1883, TCP 7887)
- Netgear ARP conflict detection

### ☁️ REMI/Cloud Troubleshooting
- LAN vs WAN setup workflows
- Cloud connection verification
- Tag-based device grouping
- Camera export/import procedures
- RIO-Live limitations explained

### 🎥 Haivision DataBridge
- License verification
- ETH2 Gateway mode configuration
- Custom routing setup
- Manual IP entry for discovery

### 📚 Quick Reference
- Network ports and their purposes
- Factory IP addressing scheme (10.192.X.Y)
- CI0 screen symbol meanings
- REMI status icon explanations
- Cloud server addresses for firewall whitelisting

## Tech Stack

- **React 18** with Hooks
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cyanview/cyanview-troubleshooter.git
cd cyanview-troubleshooter

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
cyanview-troubleshooter/
├── src/
│   ├── App.jsx          # Main troubleshooter component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind imports
├── public/
│   └── favicon.svg      # Cyanview icon
├── docs/
│   ├── screenshot.png   # App screenshot
│   └── flowchart.md     # Decision tree documentation
├── index.html           # HTML entry point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Decision Tree Overview

The troubleshooter uses a state-machine pattern with three node types:

| Node Type | Purpose |
|-----------|---------|
| `entry` | Topic selection (Network, REMI, DataBridge) |
| `decision` | Yes/No diagnostic questions |
| `resolution` | Step-by-step fix instructions |
| `success` | Confirmation of working system |

### Main Diagnostic Paths

1. **Network Setup** (`start`)
   - Power/LED verification
   - Ethernet link status
   - Ping tests
   - Subnet mask validation (/16 requirement)
   - Switch configuration (Portfast)
   - Firewall rules

2. **REMI/Cloud** (`remi_start`)
   - LAN vs WAN selection
   - Cloud connection status
   - Tag configuration
   - Camera export/import
   - Latency considerations

3. **DataBridge** (`databridge_start`)
   - Haivision license
   - ETH2 Gateway mode
   - Custom routing
   - Manual IP discovery

## Customization

### Adding New Diagnostic Nodes

Edit `src/App.jsx` and add nodes to the `flowchartData` object:

```javascript
my_new_node: {
  id: 'my_new_node',
  type: 'decision',  // or 'resolution', 'success'
  icon: 'network',   // see IconMap for options
  question: 'Is your new condition met?',
  hint: 'Helpful context for the user',
  yes: 'next_node_if_yes',
  no: 'next_node_if_no'
}
```

### Available Icons

`power`, `network`, `terminal`, `settings`, `shield`, `alert`, `monitor`, `search`, `wifi`, `camera`, `cpu`, `success`, `info`, `cloud`

### Severity Levels (for resolution nodes)

- `critical` - Red styling, urgent issues
- `warning` - Amber styling, important issues  
- `info` - Cyan styling, informational

## Network Requirements Reference

| Port | Protocol | Purpose |
|------|----------|---------|
| 3838 | UDP | Device discovery (broadcast) |
| 1883 | TCP | MQTT communication |
| 7887 | TCP | Cloud/REMI (outbound only) |

### Cloud Servers

| Region | Address |
|--------|---------|
| Dynamic | remi.cyanview.com |
| Europe | 1-eu-west-3.remi.cyanview.com |
| US West | 1-us-west-2.remi.cyanview.com |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-diagnostic`)
3. Commit your changes (`git commit -am 'Add new diagnostic path'`)
4. Push to the branch (`git push origin feature/new-diagnostic`)
5. Open a Pull Request

## Related Resources

- [Cyanview Support Documentation](https://support.cyanview.com)
- [IP Configuration Guide](https://support.cyanview.com/docs/Configuration/ConfIP)
- [REMI Documentation](https://support.cyanview.com/docs/Configuration/REMI)
- [Troubleshooting FAQ](https://support.cyanview.com/docs/Troubleshooting/FAQ)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For Cyanview product support:
- 📧 support@cyanview.com
- 🌍 Belgium (CET timezone)
- 🔗 [support.cyanview.com](https://support.cyanview.com)

---

Made with ❤️ for the broadcast community by [Cyanview](https://www.cyanview.com)
# cyanview-troubleshooter
