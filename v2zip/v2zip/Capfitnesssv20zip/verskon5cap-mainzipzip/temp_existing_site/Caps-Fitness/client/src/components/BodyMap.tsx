import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, PlayCircle, Info } from 'lucide-react';
import { exercises } from '@/lib/mockData';

const MusclePath = ({ 
  d, 
  id, 
  name, 
  isActive, 
  onClick
}: { 
  d: string; 
  id: string; 
  name: string; 
  isActive: boolean; 
  onClick: (id: string) => void;
}) => (
  <motion.path
    d={d}
    className={cn(
      "cursor-pointer transition-all duration-300 stroke-[0.5px]",
      isActive 
        ? "fill-primary/60 stroke-primary filter drop-shadow-[0_0_10px_rgba(0,255,157,0.6)]" 
        : "fill-white/5 stroke-white/20 hover:fill-primary/30 hover:stroke-primary/50"
    )}
    onClick={() => onClick(id)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  />
);

export default function BodyMap() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [view, setView] = useState<'front' | 'back'>('front');

  // Enhanced SVG paths for more anatomical correctness
  const frontMuscles = [
    { id: 'chest', name: 'Chest', d: 'M130 90 Q150 110 170 90 L170 120 Q150 140 130 120 Z' },
    { id: 'shoulders', name: 'Shoulders', d: 'M110 80 Q130 70 150 80 L150 85 L130 90 L120 110 L110 100 Z M150 80 Q170 70 190 80 L190 100 L180 110 L170 90 L150 85 Z' },
    { id: 'abs', name: 'Abs', d: 'M135 125 L165 125 L160 170 L140 170 Z' },
    { id: 'biceps', name: 'Biceps', d: 'M115 110 L128 110 L125 140 L115 135 Z M172 110 L185 110 L185 135 L175 140 Z' },
    { id: 'forearms', name: 'Forearms', d: 'M110 140 L125 140 L120 170 L105 165 Z M175 140 L190 140 L195 165 L180 170 Z' },
    { id: 'quads', name: 'Quads', d: 'M130 175 L148 175 L145 250 L135 250 Z M152 175 L170 175 L165 250 L155 250 Z' },
    { id: 'calves', name: 'Calves', d: 'M135 255 L145 255 L142 300 L138 300 Z M155 255 L165 255 L162 300 L158 300 Z' },
    { id: 'obliques', name: 'Obliques', d: 'M125 120 L135 125 L140 170 L125 160 Z M175 120 L165 125 L160 170 L175 160 Z' },
  ];

  const backMuscles = [
    { id: 'back', name: 'Back', d: 'M120 85 L180 85 L170 140 L130 140 Z' },
    { id: 'traps', name: 'Traps', d: 'M130 70 L170 70 L150 85 Z' },
    { id: 'glutes', name: 'Glutes', d: 'M130 160 L170 160 L165 200 L135 200 Z' },
    { id: 'hamstrings', name: 'Hamstrings', d: 'M135 205 L148 205 L145 270 L135 270 Z M152 205 L165 205 L162 270 L152 270 Z' },
    { id: 'triceps', name: 'Triceps', d: 'M110 110 L120 110 L120 140 L110 135 Z M180 110 L190 110 L190 135 L180 140 Z' },
    { id: 'calves', name: 'Calves', d: 'M135 275 L145 275 L142 320 L138 320 Z M155 275 L165 275 L162 320 L158 320 Z' },
  ];

  const currentMuscles = view === 'front' ? frontMuscles : backMuscles;

  const selectedExercises = selectedMuscle 
    ? exercises.filter(e => e.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase())
    : [];

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Body Map Container */}
      <div className="flex-1 w-full relative min-h-[600px] flex flex-col items-center justify-center bg-card/30 backdrop-blur-sm rounded-3xl border border-white/5 p-8 shadow-2xl">
        
        {/* View Switcher */}
        <div className="absolute top-6 right-6 flex gap-2 bg-black/40 p-1 rounded-lg border border-white/10 z-10">
          <button 
            onClick={() => setView('front')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              view === 'front' ? "bg-primary text-black shadow-[0_0_10px_rgba(0,255,157,0.5)]" : "text-muted-foreground hover:text-white"
            )}
          >
            FRONT
          </button>
          <button 
            onClick={() => setView('back')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              view === 'back' ? "bg-primary text-black shadow-[0_0_10px_rgba(0,255,157,0.5)]" : "text-muted-foreground hover:text-white"
            )}
          >
            BACK
          </button>
        </div>

        <div className="relative h-[550px] w-[300px]">
          <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,157,0.1)]">
            {/* Base Silhouette */}
            <path 
              d="M150 20 Q180 20 180 50 L190 55 L220 55 L230 120 L210 150 L210 180 L190 180 L180 280 L170 380 L130 380 L120 280 L110 180 L90 180 L90 150 L70 120 L80 55 L110 55 L120 50 Q120 20 150 20 Z" 
              fill="rgba(0,0,0,0.5)" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1"
            />
            
            {/* Render Interactive Muscles */}
            {currentMuscles.map((muscle) => (
              <MusclePath
                key={muscle.id}
                {...muscle}
                isActive={selectedMuscle === muscle.id}
                onClick={setSelectedMuscle}
              />
            ))}
          </svg>

          {/* Glowing Dots for joints/points of interest */}
          <div className="absolute top-[15%] left-[50%] w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,255,157,1)] animate-pulse" />
        </div>
        
        <p className="text-muted-foreground text-sm mt-4 font-mono tracking-widest uppercase">
          Select a muscle group to view exercises
        </p>
      </div>

      {/* Info Panel Overlay */}
      <AnimatePresence>
        {selectedMuscle && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-96 bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-2xl lg:sticky lg:top-8 max-h-[600px] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-display font-bold text-white uppercase">{selectedMuscle}</h2>
                <p className="text-primary text-sm font-mono tracking-wider">TARGET ZONE ACTIVE</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMuscle(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Recommended Exercises</h3>
              
              {selectedExercises.length > 0 ? (
                selectedExercises.map((ex) => (
                  <Card key={ex.id} className="bg-black/40 border-white/10 p-4 hover:border-primary/50 transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{ex.name}</h4>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">{ex.difficulty}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">{ex.equipment}</span>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/20">
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No specific exercises found.
                </div>
              )}

              <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold tracking-wide mt-4">
                GENERATE MINI-WORKOUT
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
