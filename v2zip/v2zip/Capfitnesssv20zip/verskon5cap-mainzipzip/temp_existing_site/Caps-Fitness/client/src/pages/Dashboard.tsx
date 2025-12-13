import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import BodyMap from '@/components/BodyMap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Flame, Trophy, Calendar, Utensils, Activity, ChevronRight, Save } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { adminData, mockDailyLog } from '@/lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState(adminData.todaysWorkout);
  const [nutritionLog, setNutritionLog] = useState(mockDailyLog);
  const [isNutritionDialogOpen, setIsNutritionDialogOpen] = useState(false);

  const handleExerciseChange = (index: number, field: string, value: string | number) => {
    const newExercises = [...workoutData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const handleNutritionChange = (field: string, value: string) => {
    setNutritionLog({ ...nutritionLog, [field]: Number(value) });
  };

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
              WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ALEX</span>
            </h1>
            <p className="text-muted-foreground text-lg">Your body is a machine. Keep it tuned.</p>
          </div>
          <Link href="/streak">
            <Button className="bg-orange-500/10 text-orange-500 border border-orange-500/50 hover:bg-orange-500 hover:text-white transition-all group">
              YOUR STREAK: 12 DAYS <Flame className="w-4 h-4 ml-2 group-hover:animate-bounce" />
            </Button>
          </Link>
        </div>

        {/* Admin/Backend Driven Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/40 backdrop-blur-md border-white/5 p-6 hover:bg-card/60 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Today's Focus</p>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">{adminData.todaysWorkout.focus}</h3>
                <p className="text-xs mt-2 text-primary opacity-80">{adminData.todaysWorkout.duration}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-primary group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-white/5 p-6 hover:bg-card/60 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Calories Remaining</p>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-accent transition-colors">
                  {adminData.dailyTargets.calories - nutritionLog.caloriesConsumed}
                </h3>
                <p className="text-xs mt-2 text-muted-foreground">Target: {adminData.dailyTargets.calories}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-accent group-hover:scale-110 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-white/5 p-6 hover:bg-card/60 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Protein Goal</p>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-neon-green transition-colors">
                  {Math.round((nutritionLog.proteinConsumed / adminData.dailyTargets.protein) * 100)}%
                </h3>
                <p className="text-xs mt-2 text-muted-foreground">{nutritionLog.proteinConsumed} / {adminData.dailyTargets.protein}g</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-neon-green group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-white/5 p-6 hover:bg-card/60 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Next Session</p>
                <h3 className="text-xl font-display font-bold text-white">TOMORROW</h3>
                <p className="text-xs mt-2 text-muted-foreground">Day 45 of 90</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-white group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions (Updated with new Flows) */}
        <div className="grid md:grid-cols-2 gap-6">
          <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-card/40 border-white/5 p-6 relative overflow-hidden group cursor-pointer hover:border-accent/50 transition-all h-full">
                <div className="absolute right-0 top-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-all" />
                <h3 className="text-xl font-display font-bold mb-2 flex items-center gap-2">
                  TODAY'S WORKOUT <ChevronRight className="w-5 h-5 text-accent" />
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{workoutData.focus} - {workoutData.duration}</p>
                <Button className="w-full bg-accent/10 text-accent hover:bg-accent hover:text-black border border-accent/20">
                  START SESSION
                </Button>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-display font-bold">TODAY'S PROGRAM</DialogTitle>
                <DialogDescription className="text-accent">{workoutData.focus} • {workoutData.duration}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {workoutData.exercises.map((ex, i) => (
                  <Card key={ex.id} className="p-4 bg-black/40 border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg">{ex.name}</h4>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white">Swap</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Sets</Label>
                        <Input 
                          value={ex.sets} 
                          onChange={(e) => handleExerciseChange(i, 'sets', e.target.value)}
                          className="bg-white/5 border-white/10 h-8 mt-1" 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Reps</Label>
                        <Input 
                          value={ex.reps} 
                          onChange={(e) => handleExerciseChange(i, 'reps', e.target.value)}
                          className="bg-white/5 border-white/10 h-8 mt-1" 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Rest</Label>
                        <Input 
                          value={ex.rest} 
                          onChange={(e) => handleExerciseChange(i, 'rest', e.target.value)}
                          className="bg-white/5 border-white/10 h-8 mt-1" 
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <DialogFooter>
                <Button className="w-full bg-accent text-black font-bold hover:bg-accent/80" onClick={() => setIsWorkoutDialogOpen(false)}>
                  COMPLETE & SAVE WORKOUT
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isNutritionDialogOpen} onOpenChange={setIsNutritionDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-card/40 border-white/5 p-6 relative overflow-hidden group cursor-pointer hover:border-secondary/50 transition-all h-full">
                <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-all" />
                <h3 className="text-xl font-display font-bold mb-2 flex items-center gap-2">
                  NUTRITION LOG <ChevronRight className="w-5 h-5 text-secondary" />
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {nutritionLog.caloriesConsumed} / {adminData.dailyTargets.calories} kcal
                </p>
                <Button className="w-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white border border-secondary/20">
                  LOG MEALS
                </Button>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">DAILY MACROS</DialogTitle>
                <DialogDescription>Track your intake against trainer targets.</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Calories ({adminData.dailyTargets.calories})</Label>
                      <Input 
                        value={nutritionLog.caloriesConsumed} 
                        onChange={(e) => handleNutritionChange('caloriesConsumed', e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Protein ({adminData.dailyTargets.protein}g)</Label>
                      <Input 
                        value={nutritionLog.proteinConsumed} 
                        onChange={(e) => handleNutritionChange('proteinConsumed', e.target.value)}
                        className="bg-white/5 border-white/10 text-neon-green font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Carbs ({adminData.dailyTargets.carbs}g)</Label>
                      <Input 
                        value={nutritionLog.carbsConsumed} 
                        onChange={(e) => handleNutritionChange('carbsConsumed', e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fats ({adminData.dailyTargets.fats}g)</Label>
                      <Input 
                        value={nutritionLog.fatsConsumed} 
                        onChange={(e) => handleNutritionChange('fatsConsumed', e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                   <div className="flex justify-between text-sm mb-2">
                     <span>Progress to Goal</span>
                     <span className="text-secondary font-bold">{Math.round((nutritionLog.caloriesConsumed / adminData.dailyTargets.calories) * 100)}%</span>
                   </div>
                   <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-secondary" 
                       style={{ width: `${Math.min((nutritionLog.caloriesConsumed / adminData.dailyTargets.calories) * 100, 100)}%` }}
                     />
                   </div>
                </div>
              </div>

              <DialogFooter>
                <Button className="w-full bg-secondary text-white font-bold hover:bg-secondary/80" onClick={() => setIsNutritionDialogOpen(false)}>
                  <Save className="w-4 h-4 mr-2" /> SAVE LOG
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Feature: Interactive Body Map Teaser */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/80 to-black/80 p-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50" />
          
          <div className="grid lg:grid-cols-3 gap-8 p-6 lg:p-12">
            <div className="lg:col-span-1 space-y-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Interactive Analysis
              </div>
              <h2 className="text-3xl font-display font-bold">TARGET YOUR WEAKNESSES</h2>
              <p className="text-muted-foreground">
                Select a muscle group on the holographic body map to instantly generate targeted exercises and recovery protocols.
              </p>
              <Link href="/bodymap">
                <Button className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold tracking-wide h-12 px-8">
                  LAUNCH BODY MAP <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="lg:col-span-2 relative min-h-[400px] flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
               <BodyMap />
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
