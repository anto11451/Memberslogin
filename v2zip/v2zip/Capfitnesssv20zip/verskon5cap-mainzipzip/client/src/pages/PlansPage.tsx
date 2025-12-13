import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BarChart, ChevronRight, CalendarCheck, Loader2 } from 'lucide-react';
import { getAllPrograms, ProgramDay } from '@/lib/googleSheetsApi';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PlanGroup {
  name: string;
  days: ProgramDay[];
  level?: string;
  description?: string;
}

export default function PlansPage() {
  const [programs, setPrograms] = useState<PlanGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true);
      try {
        const data = await getAllPrograms();
        if (data) {
          const grouped = data.reduce((acc: Record<string, ProgramDay[]>, day) => {
            const name = day.plan_name || 'Unknown Plan';
            if (!acc[name]) acc[name] = [];
            acc[name].push(day);
            return acc;
          }, {});

          const planGroups: PlanGroup[] = Object.entries(grouped).map(([name, days]) => ({
            name,
            days: days.sort((a, b) => {
              if (a.week_number !== b.week_number) return a.week_number - b.week_number;
              return a.day_number - b.day_number;
            }),
            level: 'Intermediate',
            description: `A comprehensive ${name} program designed for maximum results.`,
          }));

          setPrograms(planGroups);
        }
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  const getDaysPerWeek = (days: ProgramDay[]) => {
    const uniqueDays = new Set(days.map(d => d.day_number));
    return uniqueDays.size;
  };

  const getTotalWeeks = (days: ProgramDay[]) => {
    const uniqueWeeks = new Set(days.map(d => d.week_number));
    return uniqueWeeks.size;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <span className="ml-3 text-muted-foreground">Loading training plans...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">TRAINING <span className="text-secondary">PLANS</span></h1>
          <p className="text-muted-foreground">Structured programs designed for maximum hypertrophy and strength.</p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No training plans available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {programs.map((plan, index) => (
              <Dialog key={plan.name}>
                <DialogTrigger asChild>
                  <Card className="relative overflow-hidden bg-card/40 backdrop-blur-md border-white/5 hover:border-secondary/50 transition-all group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center relative z-10">
                      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-[0_0_15px_rgba(188,19,254,0.1)]">
                        <span className="font-display font-bold text-2xl">{index + 1}</span>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-display font-bold text-white">{plan.name}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/5 text-muted-foreground border border-white/5">
                            {plan.level}
                          </span>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">{plan.description}</p>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Clock className="w-4 h-4 text-secondary" />
                            {getTotalWeeks(plan.days)} Weeks
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <BarChart className="w-4 h-4 text-secondary" />
                            {getDaysPerWeek(plan.days)} Days / Week
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button className="w-full md:w-auto bg-secondary text-white hover:bg-secondary/80 font-bold tracking-wide">
                          VIEW PROGRAM <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-card border-white/10 text-white h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-display font-bold text-white">{plan.name}</DialogTitle>
                    <DialogDescription>
                      {getDaysPerWeek(plan.days)} days/week • {getTotalWeeks(plan.days)} weeks • {plan.level}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                      <h4 className="font-bold text-secondary mb-2">Program Overview</h4>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-display">Weekly Schedule</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {plan.days.map((day, i) => (
                          <Card key={i} className={`p-4 border-white/10 ${day.is_rest_day ? 'bg-black/20' : 'bg-black/40'}`}>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-bold text-white">
                                {day.day_name || `Day ${day.day_number}`}
                                {day.week_number > 1 && <span className="text-xs text-muted-foreground ml-2">(Week {day.week_number})</span>}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded ${day.is_rest_day ? 'bg-white/5 text-muted-foreground' : 'bg-secondary/20 text-secondary'}`}>
                                {day.focus || (day.is_rest_day ? 'Rest Day' : 'Training')}
                              </span>
                            </div>
                            {day.is_rest_day ? (
                              <p className="text-sm text-muted-foreground italic">Recovery and rest</p>
                            ) : (
                              <ul className="space-y-2">
                                {day.exercises?.map((ex, j) => (
                                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <div className="w-1 h-1 bg-secondary rounded-full mt-2" />
                                    <div>
                                      <span className="text-white">{ex.name}</span>
                                      {(ex.sets || ex.reps) && (
                                        <span className="text-xs ml-2 text-muted-foreground">
                                          {ex.sets && `${ex.sets} sets`} {ex.reps && `x ${ex.reps}`}
                                        </span>
                                      )}
                                    </div>
                                  </li>
                                )) || <li className="text-sm text-muted-foreground">No exercises listed</li>}
                              </ul>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button className="bg-secondary text-white hover:bg-secondary/80 w-full md:w-auto">
                        <CalendarCheck className="w-4 h-4 mr-2" /> ADD TO MY CALENDAR
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
