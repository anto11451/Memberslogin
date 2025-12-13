import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, PlayCircle, Video } from 'lucide-react';
import { exercises } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function WorkoutsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || ex.muscleGroup === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">WORKOUT <span className="text-accent">REPOSITORY</span></h1>
            <p className="text-muted-foreground">Access the complete library of elite exercises.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search exercises..." 
                className="pl-9 bg-black/20 border-white/10 text-white focus:border-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                selectedFilter === filter 
                  ? "bg-accent/10 border-accent text-accent shadow-[0_0_10px_rgba(0,243,255,0.2)]" 
                  : "bg-black/20 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((ex) => (
            <Dialog key={ex.id}>
              <DialogTrigger asChild>
                <Card className="group bg-card/40 backdrop-blur-sm border-white/5 hover:border-accent/50 transition-all overflow-hidden flex flex-col cursor-pointer">
                  <div className="h-48 bg-black/50 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                    <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-accent group-hover:scale-110 transition-all z-20 relative" />
                    <div className="absolute bottom-3 left-3 z-20">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-accent text-black px-2 py-1 rounded">
                        {ex.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{ex.name}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ex.instructions}</p>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded border border-white/5">{ex.muscleGroup}</span>
                        <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded border border-white/5">{ex.equipment}</span>
                      </div>
                      
                      <Button className="w-full bg-white/5 hover:bg-accent hover:text-black border border-white/10 text-white transition-colors">
                        VIEW DETAILS
                      </Button>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-display font-bold text-white">{ex.name}</DialogTitle>
                  <DialogDescription className="text-accent">{ex.muscleGroup} • {ex.difficulty}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
                     <PlayCircle className="w-16 h-16 text-white/30" />
                     <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button className="bg-red-600 hover:bg-red-700 text-white">
                         <Video className="w-4 h-4 mr-2" /> WATCH ON YOUTUBE
                       </Button>
                     </a>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Instructions</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{ex.instructions}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Coaching Cues</h4>
                        <ul className="space-y-1">
                          {ex.cues.map((cue, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {cue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div>
                         <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">Details</h4>
                         <div className="grid grid-cols-2 gap-2">
                           <div className="p-3 bg-white/5 rounded">
                             <p className="text-xs text-muted-foreground">Equipment</p>
                             <p className="font-bold">{ex.equipment}</p>
                           </div>
                           <div className="p-3 bg-white/5 rounded">
                             <p className="text-xs text-muted-foreground">Secondary</p>
                             <p className="font-bold">{ex.secondaryMuscles?.join(", ") || "None"}</p>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </Layout>
  );
}
