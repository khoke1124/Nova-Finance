import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export function OptionsSimulator() {
  const [underlyingPrice, setUnderlyingPrice] = useState(150);
  const [strikePrice, setStrikePrice] = useState(155);
  const [premium, setPremium] = useState(3.50);
  const [optionType, setOptionType] = useState<"Call" | "Put">("Call");
  const [positionType, setPositionType] = useState<"Long" | "Short">("Long");

  // Generate generic payoff data
  const generatePayoffData = () => {
    let data = [];
    for (let price = strikePrice - 30; price <= strikePrice + 30; price += 1) {
      let payoff = 0;
      if (optionType === "Call") {
        payoff = Math.max(0, price - strikePrice);
      } else {
        payoff = Math.max(0, strikePrice - price);
      }
      
      let pnl = positionType === "Long" ? payoff - premium : premium - payoff;
      
      data.push({
        price,
        pnl: Number((pnl * 100).toFixed(2)), // Options are x100 shares
      });
    }
    return data;
  };

  const chartData = generatePayoffData();
  const maxLoss = positionType === "Long" ? `-$${(premium * 100).toFixed(2)}` : optionType === "Call" ? "Unlimited" : `-$${((strikePrice - premium) * 100).toFixed(2)}`;
  const maxProfit = positionType === "Long" ? (optionType === "Call" ? "Unlimited" : `$${((strikePrice - premium) * 100).toFixed(2)}`) : `$${(premium * 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Derivatives Sandbox</h2>
        <p className="text-muted-foreground mt-1">Visualize strategies before putting capital at risk.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Builder</CardTitle>
              <CardDescription>Configure the leg details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex gap-2">
                <button 
                  className={`flex-1 py-1 px-3 text-sm rounded ${positionType === "Long" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  onClick={() => setPositionType("Long")}
                >Buy</button>
                <button 
                  className={`flex-1 py-1 px-3 text-sm rounded ${positionType === "Short" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  onClick={() => setPositionType("Short")}
                >Sell</button>
              </div>

              <div className="flex gap-2">
                <button 
                  className={`flex-1 py-1 px-3 text-sm rounded ${optionType === "Call" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  onClick={() => setOptionType("Call")}
                >Call</button>
                <button 
                  className={`flex-1 py-1 px-3 text-sm rounded ${optionType === "Put" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  onClick={() => setOptionType("Put")}
                >Put</button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium uppercase tracking-wider opacity-70">Underlying Price</label>
                  <span className="font-mono text-sm">${underlyingPrice}</span>
                </div>
                <Slider max={300} min={50} step={1} value={[underlyingPrice]} onValueChange={(v) => setUnderlyingPrice(v[0])} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium uppercase tracking-wider opacity-70">Strike Price</label>
                  <span className="font-mono text-sm">${strikePrice}</span>
                </div>
                <Slider max={300} min={50} step={1} value={[strikePrice]} onValueChange={(v) => setStrikePrice(v[0])} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium uppercase tracking-wider opacity-70">Premium Paid/Received</label>
                  <span className="font-mono text-sm">${premium.toFixed(2)}</span>
                </div>
                <Slider max={20} min={0.1} step={0.1} value={[premium]} onValueChange={(v) => setPremium(v[0])} />
              </div>

            </CardContent>
          </Card>

          <Card className="bg-card/50">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg">Strategy Metrics</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               <div className="flex border-b border-white/5 pb-2 justify-between text-sm">
                 <span className="text-slate-400">Max Profit</span>
                 <span className="font-mono text-green-400">{maxProfit}</span>
               </div>
               <div className="flex border-b border-white/5 pb-2 justify-between text-sm">
                 <span className="text-slate-400">Max Loss</span>
                 <span className="font-mono text-red-500">{maxLoss}</span>
               </div>
               <div className="flex pb-2 justify-between text-sm">
                 <span className="text-slate-400">Breakeven</span>
                 <span className="font-mono">
                   ${(optionType === "Call" ? strikePrice + premium : strikePrice - premium).toFixed(2)}
                 </span>
               </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Payoff Diagram</CardTitle>
              <CardDescription>P&L at expiration based on underlying price.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                  <XAxis 
                    dataKey="price" 
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    stroke="#888888" 
                    fontSize={12} 
                    tickFormatter={(val) => `$${val}`}
                    fontFamily="JetBrains Mono"
                  />
                  <YAxis 
                   stroke="#888888" 
                   fontSize={12}
                   tickFormatter={(val) => `$${val}`}
                   fontFamily="JetBrains Mono"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontFamily: "JetBrains Mono"}}
                    labelFormatter={(label) => `Price: $${label}`}
                    formatter={(value: number) => {
                      const isPositive = value >= 0;
                      return [
                        <span style={{ color: isPositive ? '#10b981' : '#ef4444' }}>${value.toFixed(2)}</span>,
                        "P&L"
                      ]
                    }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3"/>
                  <ReferenceLine x={strikePrice} stroke="hsla(var(--primary), 0.5)" strokeDasharray="3 3"/>
                  <ReferenceLine x={underlyingPrice} stroke="#888888" label={{ value: "Current", position: 'top', fill: '#888', fontSize: 10 }} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="var(--primary)" 
                    strokeWidth={3} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
