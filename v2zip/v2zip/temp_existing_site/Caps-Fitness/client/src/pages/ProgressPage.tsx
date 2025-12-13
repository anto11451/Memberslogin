import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const data = [
  { name: 'Week 1', weight: 82 },
  { name: 'Week 2', weight: 81.5 },
  { name: 'Week 3', weight: 80.8 },
  { name: 'Week 4', weight: 79.5 },
  { name: 'Week 5', weight: 79.0 },
  { name: 'Week 6', weight: 78.5 },
];

export default function ProgressPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [targetDate, setTargetDate] = useState<Date | undefined>(new Date());

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">PROGRESS <span className="text-accent">TRACKER</span></h1>
          <p className="text-muted-foreground">Visualize your transformation.</p>
        </div>

        {/* Timeline Controls */}
        <div className="flex flex-wrap gap-4 p-4 bg-card/40 border border-white/5 rounded-xl">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal border-white/10 bg-black/20 text-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-white/10">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Target Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal border-white/10 bg-black/20 text-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-white/10">
                <Calendar mode="single" selected={targetDate} onSelect={setTargetDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-card/40 border-white/5 p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Weight Trend</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-xs">Weekly</Button>
                <Button size="sm" variant="ghost" className="text-xs">Monthly</Button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(190, 100%, 50%)" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="text-center">
                 <p className="text-xs text-muted-foreground uppercase">Avg Change</p>
                 <p className="text-xl font-bold text-accent">-0.7 kg/wk</p>
              </div>
              <div className="text-center">
                 <p className="text-xs text-muted-foreground uppercase">Est. Completion</p>
                 <p className="text-xl font-bold text-white">4 Weeks</p>
              </div>
              <div className="text-center">
                 <p className="text-xs text-muted-foreground uppercase">Total Lost</p>
                 <p className="text-xl font-bold text-white">3.5 kg</p>
              </div>
            </div>
          </Card>

          {/* Goal Tracker */}
          <div className="space-y-6">
            <Card className="bg-card/40 border-white/5 p-6 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
               <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Goal</h3>
               <p className="text-2xl font-display font-bold text-white mb-4">CUT TO 75 KG</p>
               
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-white">Progress</span>
                   <span className="text-accent">50%</span>
                 </div>
                 <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                   <div className="h-full w-1/2 bg-accent shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                 </div>
                 <p className="text-xs text-muted-foreground mt-2">3.5 kg remaining</p>
               </div>
               
               <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                 <p className="text-sm italic text-accent-foreground">"You're halfway there! Keep pushing."</p>
               </div>
            </Card>

            <Card className="bg-card/40 border-white/5 p-6 backdrop-blur-xl">
               <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Milestones</h3>
               <div className="space-y-4">
                 {[
                   { label: "Hit 80kg", done: true },
                   { label: "Hit 78kg", done: true },
                   { label: "Hit 76kg", done: false },
                   { label: "Hit 75kg", done: false },
                 ].map((m, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className={cn(
                       "w-5 h-5 rounded-full flex items-center justify-center border",
                       m.done ? "bg-accent border-accent text-black" : "border-white/20 text-transparent"
                     )}>
                       ✓
                     </div>
                     <span className={m.done ? "text-white line-through opacity-50" : "text-white"}>{m.label}</span>
                   </div>
                 ))}
               </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
