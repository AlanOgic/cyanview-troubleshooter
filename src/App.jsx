import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, CheckCircle, AlertTriangle, Cable, Settings, HelpCircle, ExternalLink, Cpu } from 'lucide-react';
import flowchartData from './data/flowchartData';
import quickReference from './data/quickReference';
import { IconMap, severityColors } from './data/constants';

export default function CyanviewTroubleshooter() {
  const [currentNode, setCurrentNode] = useState('entry');
  const [history, setHistory] = useState([]);
  const [showReference, setShowReference] = useState(false);
  const [animating, setAnimating] = useState(false);

  const node = flowchartData[currentNode];

  const navigate = (nextNodeId) => {
    if (animating) return;
    setAnimating(true);
    setHistory([...history, currentNode]);
    setTimeout(() => {
      setCurrentNode(nextNodeId);
      setAnimating(false);
    }, 150);
  };

  const goBack = () => {
    if (history.length === 0 || animating) return;
    setAnimating(true);
    const newHistory = [...history];
    const previousNode = newHistory.pop();
    setTimeout(() => {
      setHistory(newHistory);
      setCurrentNode(previousNode);
      setAnimating(false);
    }, 150);
  };

  const restart = () => {
    setAnimating(true);
    setTimeout(() => {
      setHistory([]);
      setCurrentNode('entry');
      setAnimating(false);
    }, 150);
  };

  const NodeIcon = IconMap[node.icon] || HelpCircle;
  const severity = node.severity ? severityColors[node.severity] : severityColors.info;

  return (
    <div className="min-h-screen text-slate-100 font-sans relative">

      {/* Header */}
      <header className="relative border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Cable className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-white">Cyanview Network Troubleshooter</h1>
                <p className="text-xs text-slate-400 tracking-wide uppercase">RCP & RIO Setup Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReference(!showReference)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 flex items-center gap-2
                  ${showReference
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}
              >
                <Settings className="w-4 h-4" />
                Quick Reference
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Main content area */}
          <div className={`flex-1 transition-all duration-300 ${showReference ? 'pr-0' : ''}`}>

            {/* Progress indicator */}
            <div className="mb-12 flex items-center gap-2 text-sm">
              <span className="text-slate-500">Step {history.length + 1}</span>
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((history.length + 1) * 10, 100)}%` }}
                />
              </div>
              {history.length > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={restart}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
            </div>

            {/* Node content */}
            <div className={`transition-all duration-150 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>

            {/* Entry Node - Topic Selection */}
              {node.type === 'entry' && (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                      <NodeIcon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-medium text-white">{node.title}</h2>
                  </div>

                  <div className="grid gap-4">
                    {node.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(option.target)}
                        className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-left
                          hover:bg-slate-700/50 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5
                          transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-white group-hover:text-cyan-300 transition-colors">
                              {option.label}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision Node */}
              {node.type === 'decision' && (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                      <NodeIcon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-medium text-white mb-3 leading-tight">{node.question}</h2>
                      {node.hint && (
                        <p className="text-slate-400 text-sm mb-6 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-500" />
                          {node.hint}
                        </p>
                      )}

                      <div className="flex gap-4 mt-8">
                        <button
                          onClick={() => navigate(node.yes)}
                          className="flex-1 py-4 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium
                            hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10
                            transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                          <CheckCircle className="w-5 h-5" />
                          {node.yesLabel || 'Yes'}
                          <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </button>
                        <button
                          onClick={() => navigate(node.no)}
                          className="flex-1 py-4 px-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium
                            hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10
                            transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                          <AlertTriangle className="w-5 h-5" />
                          {node.noLabel || 'No'}
                          <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Node */}
              {node.type === 'resolution' && (
                <div className={`${severity.bg} backdrop-blur-sm border ${severity.border} rounded-2xl p-8 shadow-2xl ${severity.glow}`}>
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl ${severity.bg} border ${severity.border} flex items-center justify-center flex-shrink-0`}>
                      <NodeIcon className={`w-8 h-8 ${severity.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-2xl font-medium text-white">{node.title}</h2>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${severity.bg} ${severity.text} border ${severity.border}`}>
                          {node.severity}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        {node.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3 text-slate-300">
                            <span className={`w-6 h-6 rounded-full ${severity.bg} ${severity.text} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>

                      {node.techNote && (
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 mb-6">
                          <p className="text-sm text-slate-400 flex items-start gap-2">
                            <Cpu className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-500" />
                            <span><strong className="text-cyan-400">Technical Note:</strong> {node.techNote}</span>
                          </p>
                        </div>
                      )}

                      {node.nextCheck && (
                        <button
                          onClick={() => navigate(node.nextCheck)}
                          className="py-3 px-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium
                            hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10
                            transition-all duration-200 flex items-center gap-2 group"
                        >
                          Continue Troubleshooting
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Success Node */}
              {node.type === 'success' && (
                <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-medium text-white mb-3">{node.title}</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">{node.message}</p>

                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      {node.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300
                            hover:bg-slate-700/50 hover:border-slate-600 hover:text-white
                            transition-all duration-200 flex items-center gap-2 text-sm"
                        >
                          {link.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>

                    <button
                      onClick={restart}
                      className="py-3 px-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 font-medium
                        hover:bg-slate-700/50 hover:border-slate-600 hover:text-white
                        transition-all duration-200 flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Path breadcrumb */}
            {history.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Path:</span>
                {history.map((nodeId, i) => (
                  <React.Fragment key={nodeId}>
                    <button
                      onClick={() => {
                        const newHistory = history.slice(0, i);
                        setHistory(newHistory);
                        setCurrentNode(nodeId);
                      }}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {flowchartData[nodeId].title || flowchartData[nodeId].question?.slice(0, 20) + '...'}
                    </button>
                    <ChevronRight className="w-3 h-3" />
                  </React.Fragment>
                ))}
                <span className="text-cyan-400">{node.title || node.question?.slice(0, 20) + '...'}</span>
              </div>
            )}
          </div>

          {/* Quick Reference Sidebar */}
          <div className={`transition-all duration-300 overflow-hidden ${showReference ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="w-80 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Quick Reference
              </h3>

              {/* Ports */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Network Ports</h4>
                <div className="space-y-2">
                  {quickReference.ports.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{item.port}</code>
                      <span className="text-slate-400">{item.purpose}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IP Addressing */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">IP Addressing</h4>
                <div className="space-y-2">
                  {quickReference.ips.map((item, i) => (
                    <div key={i} className="text-sm">
                      <code className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded block mb-1">{item.format}</code>
                      <span className="text-slate-400 text-xs">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LED Status */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">LED Indicators</h4>
                <div className="space-y-2">
                  {quickReference.leds.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-3 h-3 rounded-full ${
                        item.color.includes('Green') ? 'bg-emerald-400' :
                        item.color.includes('Orange') ? 'bg-amber-400 animate-pulse' :
                        'bg-slate-600'
                      }`} />
                      <span className="text-slate-300">{item.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CI0 Display */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">CI0 Screen Symbols</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <code className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">{'>-<'}</code>
                    <span className="text-slate-400">Waiting for network</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-mono">X</code>
                    <span className="text-slate-400">No RCP connection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono text-xs">1</code>
                    <span className="text-slate-400">Config only</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">1</code>
                    <span className="text-slate-400">Fully connected</span>
                  </div>
                </div>
              </div>

              {/* REMI Status Icons */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">REMI Status Icons</h4>
                <div className="space-y-2 text-sm">
                  {quickReference.remi.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-slate-400">{item.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cloud Servers */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Cloud Servers</h4>
                <div className="space-y-2">
                  {quickReference.cloud.map((item, i) => (
                    <div key={i} className="text-sm">
                      <code className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded text-xs block mb-1 break-all">{item.server}</code>
                      <span className="text-slate-500 text-xs">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support link */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <a
                  href="https://support.cyanview.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                >
                  Full Documentation
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Cyanview Network Troubleshooter v1.0</span>
            <span>support@cyanview.com • Belgium (CET)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
