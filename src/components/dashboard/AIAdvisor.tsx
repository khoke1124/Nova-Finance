import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  role: "user" | "model";
  content: string;
};

export function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am your AI quant tutor. Feel free to ask me anything about derivatives, options pricing (Black-Scholes, Greeks), portfolio hedging strategies, or general investing principles.",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Build conversation history for context in a simplest way
      const history = messages.map(m => m.content).join("\n") + "\nUser: " + userMessage;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview", // Complex finance/math reasoning model
        contents: userMessage,
        config: {
          systemInstruction: "You are a friendly but highly technical AI financial advisor for young investors. Explain concepts like options, derivatives, and hedging simply, using metaphors when helpful. Emphasize risk management heavily, warning against unhedged short positions.",
        }
      });
      
      setMessages((prev) => [...prev, { role: "model", content: response.text || "Sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", content: "I encountered an error connecting to the API. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col max-w-4xl">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">AI Quant Advisor</h2>
        <p className="text-muted-foreground mt-1">Ask complex questions about Greeks, volatility, or strategy structures.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-white/5 bg-slate-900/40">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`mt-1 shrink-0 bg-slate-800 rounded-full p-2 h-8 w-8 flex items-center justify-center border border-white/5`}>
                  {msg.role === "model" ? <Bot className="h-4 w-4 text-blue-400" /> : <User className="h-4 w-4 text-green-400" />}
                </div>
                <div 
                  className={`p-3 rounded-xl border ${
                    msg.role === "user" 
                      ? "bg-blue-600/20 text-white border-blue-500/30 rounded-tr-sm shadow-[0_0_15px_rgba(37,99,235,0.15)]" 
                      : "bg-slate-800/50 border-white/5 text-slate-200 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="mt-1 shrink-0 bg-slate-800 rounded-full p-2 h-8 w-8 flex items-center justify-center border border-white/5">
                   <Bot className="h-4 w-4 text-blue-400" /> 
                </div>
                <div className="p-3 rounded-xl border bg-slate-800/50 border-white/5 text-slate-200 rounded-tl-sm flex items-center">
                   <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-white/5 bg-slate-900/60">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. What happens to my call option's Delta as we approach expiration?"
              className="flex-1 bg-slate-950 border-white/10 text-white placeholder:text-slate-500"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="shrink-0 px-6 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <Send className="h-4 w-4 mr-2" />
              Ask
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
