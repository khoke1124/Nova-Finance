import { useState } from 'react';
import { LineChart as ChartIcon, BookOpen, Calculator, Bot, Layout, Wallet, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortfolioView } from './components/dashboard/PortfolioView';
import { OptionsSimulator } from './components/dashboard/OptionsSimulator';
import { EducationHub } from './components/dashboard/EducationHub';
import { AIAdvisor } from './components/dashboard/AIAdvisor';

export default function App() {
  const [activeTab, setActiveTab] = useState('portfolio');

  const navItems = [
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'options', label: 'Derivatives Sandbox', icon: Calculator },
    { id: 'education', label: 'Education Hub', icon: BookOpen },
    { id: 'advisor', label: 'AI Advisor', icon: Bot },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 glass flex flex-col items-stretch max-md:hidden z-10 shadow-sm relative">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 text-blue-400 p-1.5 rounded-md border border-blue-500/50">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-blue-400">Nova<span className="text-slate-100">Finance</span></h1>
          </div>
          <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-mono">Derivatives Terminal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-sm glow-blue" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 bg-slate-900/30">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-500 font-bold text-xs font-mono">
               US
             </div>
             <div>
               <p className="text-sm font-medium text-slate-200">Demo User</p>
               <p className="text-xs text-slate-500">Pro Tier</p>
             </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-background/50">
         {/* Mobile Header */}
         <div className="md:hidden flex items-center gap-2 p-4 border-b border-border bg-card">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">Nova Finance</span>
         </div>
         
         <div className="p-4 md:p-8 lg:p-10 h-full max-w-[1400px] mx-auto">
           {activeTab === 'portfolio' && <PortfolioView />}
           {activeTab === 'options' && <OptionsSimulator />}
           {activeTab === 'education' && <EducationHub />}
           {activeTab === 'advisor' && <AIAdvisor />}
         </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card flex justify-around p-2 z-20 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 w-16 transition-colors",
              activeTab === item.id 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
              {item.label.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

