# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-03

### Added
- Initial release of Cyanview Network Troubleshooter
- **Network/Device Setup** diagnostic path
  - LED status verification (power, link, activity)
  - IP addressing validation (factory IPs, /16 subnet)
  - Cisco Portfast configuration guidance
  - Netgear ARP conflict detection
  - Firewall port requirements (UDP 3838, TCP 1883)
  - CI0 screen symbol interpretation
- **REMI/Cloud Control** diagnostic path
  - LAN vs WAN setup workflows
  - Cloud connection verification (port 7887)
  - Tag-based device grouping
  - Camera export/import procedures
  - RIO-Live limitations documentation
  - Latency troubleshooting for 4G connections
- **Haivision DataBridge** diagnostic path
  - License verification steps
  - ETH2 Gateway mode configuration
  - Custom routing setup for RCP
  - Manual IP discovery workaround
- **Quick Reference Panel**
  - Network ports and purposes
  - Factory IP addressing scheme
  - CI0 screen symbols
  - REMI status icon explanations
  - Cloud server addresses
- Interactive flowchart with:
  - Entry point topic selection
  - Yes/No decision nodes with custom labels
  - Resolution nodes with severity indicators
  - Progress tracking and breadcrumb navigation
  - Dark theme optimized for control rooms
- Comprehensive documentation
  - README with setup instructions
  - Decision tree flowchart documentation
  - MIT license

### Technical
- React 18 with functional components and hooks
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building
- State machine pattern for flowchart navigation
