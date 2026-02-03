# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # ESLint check (zero warnings allowed)
```

## Architecture

This is a single-page React application implementing an interactive troubleshooting flowchart for Cyanview broadcast equipment (RCP/RIO devices).

### Core Pattern: State Machine Flowchart

The entire application logic is in `src/App.jsx` built around a state machine pattern:

- **`flowchartData` object**: Contains all troubleshooting nodes (~58 total) keyed by unique IDs
- **Navigation state**: `currentNode` (current position) and `history` (breadcrumb trail for back navigation)
- **Node types**:
  - `entry`: Multi-option topic selector (e.g., Network vs REMI vs DataBridge)
  - `decision`: Yes/No diagnostic questions with `yes`/`no` target node references
  - `resolution`: Step-by-step fix instructions with optional `nextCheck` to continue
  - `success`: Terminal success state with external resource links

### Adding/Modifying Diagnostic Nodes

Add nodes to the `flowchartData` object in `src/App.jsx`:

```javascript
my_node: {
  id: 'my_node',
  type: 'decision',           // decision | resolution | success | entry
  icon: 'network',            // See IconMap for options
  question: 'Your question?', // For decision nodes
  hint: 'Helper text',
  yes: 'next_if_yes',         // Target node ID
  no: 'next_if_no',
  // For resolution nodes:
  severity: 'warning',        // critical | warning | info
  steps: ['Step 1', 'Step 2'],
  techNote: 'Technical detail',
  nextCheck: 'return_node'
}
```

### Key Data Structures

- **`quickReference`**: Static data for the sidebar (ports, IPs, LEDs, cloud servers)
- **`IconMap`**: Maps icon names to Lucide React components
- **`severityColors`**: Tailwind class mappings for critical/warning/info/success states

### Styling

Uses Tailwind CSS with a dark slate theme. Color conventions:
- Cyan (`cyan-400/500`): Primary accent, links, highlights
- Emerald (`emerald-400/500`): Success states, "Yes" buttons
- Red (`red-400/500`): Critical severity, "No" buttons
- Amber (`amber-400/500`): Warning severity

## Diagnostic Flow Documentation

See `docs/flowchart.md` for the complete decision tree visualization showing all paths and node relationships.
