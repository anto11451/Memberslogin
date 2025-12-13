import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recipes, adminData, mockDailyLog } from '@/lib/mockData';
import { Calculator, Utensils, Zap, Plus, X, Video, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function NutritionPage() {
  const [macroInput, setMacroInput] = useState('');
  const [calculatedMacros, setCalculatedMacros] = useState<{p: number, c: number, f: number, cal: number} | null>(null);
  const [nutritionLog, setNutritionLog] = useState(mockDailyLog);

  const indianPresets = [
    'Paneer', 'Chapati', 'Paratha', 'Idli', 'Dosa', 'Poha', 'Upma', 'Rajma', 
    'Chole', 'Dal', 'Sprouts', 'Omelette', 'Chicken Curry', 'Fish Fry', 'Curd', 'Whey Scoop'
  ];

  const handleCalculate = () => {
    // Better mock logic that somewhat scales with input length
    const multiplier = macroInput.length > 10 ? 1.5 : 1;
    setCalculatedMacros({
      p: Math.round(45 * multiplier),
      c: Math.round(30 * multiplier), 
      f: Math.round(15 * multiplier),
      cal: Math.round(435 * multiplier)
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white">NUTRITION <span className="text-neon-green">HUB</span></h1>
          <p className="text-muted-foreground">Fuel your body with precision.</p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="bg-black/40 border border-white/10 p-1">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">MACRO CALC</TabsTrigger>
            <TabsTrigger value="recipes" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">RECIPES</TabsTrigger>
            <TabsTrigger value="hacks" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">PROTEIN HACKS</TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Dialog key={recipe.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer overflow-hidden bg-card/40 border-white/5 hover:border-neon-green/50 transition-all group">
                      <div className="h-48 relative">
                        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                          <h3 className="text-lg font-bold text-white leading-tight">{recipe.name}</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-muted-foreground">CAL</p>
                            <p className="font-bold text-white">{recipe.calories}</p>
                          </div>
                          <div className="bg-neon-green/10 rounded p-2 border border-neon-green/20">
                            <p className="text-xs text-neon-green">PRO</p>
                            <p className="font-bold text-neon-green">{recipe.protein}g</p>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-muted-foreground">CARB</p>
                            <p className="font-bold text-white">{recipe.carbs}g</p>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-muted-foreground">FAT</p>
                            <p className="font-bold text-white">{recipe.fats}g</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full border-neon-green/30 text-neon-green hover:bg-neon-green hover:text-black">
                          VIEW RECIPE
                        </Button>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-display font-bold text-white">{recipe.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 flex gap-2">
                          {recipe.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white">{tag}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center">
                         <div className="p-3 bg-white/5 rounded-lg">
                           <p className="text-sm text-muted-foreground">Calories</p>
                           <p className="text-xl font-bold">{recipe.calories}</p>
                         </div>
                         <div className="p-3 bg-neon-green/10 border border-neon-green/20 rounded-lg">
                           <p className="text-sm text-neon-green">Protein</p>
                           <p className="text-xl font-bold text-neon-green">{recipe.protein}g</p>
                         </div>
                         <div className="p-3 bg-white/5 rounded-lg">
                           <p className="text-sm text-muted-foreground">Carbs</p>
                           <p className="text-xl font-bold">{recipe.carbs}g</p>
                         </div>
                         <div className="p-3 bg-white/5 rounded-lg">
                           <p className="text-sm text-muted-foreground">Fats</p>
                           <p className="text-xl font-bold">{recipe.fats}g</p>
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-white mb-2">Ingredients</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                            {recipe.ingredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-2">Instructions</h4>
                          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                            {recipe.instructions?.map((step, i) => (
                              <li key={i}>{step}</li>
                            )) || <li>No instructions provided.</li>}
                          </ol>
                        </div>
                      </div>

                      {recipe.videoUrl && (
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-2">
                          <Video className="w-4 h-4 mr-2" /> WATCH COOKING VIDEO
                        </Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hacks" className="space-y-6">
            <div className="grid gap-4">
              <Card className="p-6 bg-card/40 border-white/5 border-l-4 border-l-neon-green">
                <h3 className="text-xl font-bold text-white mb-2">20 Ways to Hit 100g Protein</h3>
                <p className="text-muted-foreground">A comprehensive guide to hitting your protein targets without breaking the bank.</p>
              </Card>
              <Card className="p-6 bg-card/40 border-white/5 border-l-4 border-l-neon-green">
                <h3 className="text-xl font-bold text-white mb-2">Vegetarian Protein Sources</h3>
                <p className="text-muted-foreground">Top plant-based protein sources ranked by bioavailability.</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Calculator Section */}
              <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">AI MACRO CALCULATOR</h3>
                    <p className="text-muted-foreground text-sm">Type what you ate, get instant macros.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea 
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none resize-none"
                    placeholder="E.g., 2 eggs, 200g chicken breast, 1 cup rice..."
                    value={macroInput}
                    onChange={(e) => setMacroInput(e.target.value)}
                  />
                  
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Quick Add</p>
                    <div className="flex flex-wrap gap-2">
                      {indianPresets.map(item => (
                        <Button 
                          key={item} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setMacroInput(prev => prev ? `${prev}, ${item}` : item)}
                          className="text-xs bg-white/5 border-white/10 hover:border-neon-green hover:text-neon-green"
                        >
                          <Plus className="w-3 h-3 mr-1" /> {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-neon-green text-black font-bold hover:bg-neon-green/80 h-12 text-lg mt-4"
                    onClick={handleCalculate}
                  >
                    CALCULATE MACROS
                  </Button>

                  {calculatedMacros && (
                    <div className="mt-8 pt-8 border-t border-white/10 animate-in slide-in-from-bottom-4">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Calories</p>
                          <p className="text-2xl font-display font-bold text-white">{calculatedMacros.cal}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Protein</p>
                          <p className="text-2xl font-display font-bold text-neon-green">{calculatedMacros.p}g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Carbs</p>
                          <p className="text-2xl font-display font-bold text-white">{calculatedMacros.c}g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Fats</p>
                          <p className="text-2xl font-display font-bold text-white">{calculatedMacros.f}g</p>
                        </div>
                      </div>
                      <Button variant="secondary" className="w-full mt-4">
                        ADD TO DAILY LOG
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Daily Targets Summary Section */}
              <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">DAILY TARGETS</h3>
                    <p className="text-muted-foreground text-sm">Your goals vs reality.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                     <div className="flex justify-between items-end mb-2">
                       <div>
                         <p className="text-sm font-bold text-white">Calories</p>
                         <p className="text-xs text-muted-foreground">Remaining: {adminData.dailyTargets.calories - nutritionLog.caloriesConsumed}</p>
                       </div>
                       <p className="text-2xl font-display font-bold text-white">{nutritionLog.caloriesConsumed} <span className="text-sm text-muted-foreground font-normal">/ {adminData.dailyTargets.calories}</span></p>
                     </div>
                     <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                       <div className="h-full bg-white" style={{ width: `${(nutritionLog.caloriesConsumed / adminData.dailyTargets.calories) * 100}%` }} />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Protein</p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-green" style={{ width: `${(nutritionLog.proteinConsumed / adminData.dailyTargets.protein) * 100}%` }} />
                      </div>
                      <p className="text-sm font-bold text-white">{nutritionLog.proteinConsumed} / {adminData.dailyTargets.protein}g</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Carbs</p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(nutritionLog.carbsConsumed / adminData.dailyTargets.carbs) * 100}%` }} />
                      </div>
                      <p className="text-sm font-bold text-white">{nutritionLog.carbsConsumed} / {adminData.dailyTargets.carbs}g</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Fats</p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${(nutritionLog.fatsConsumed / adminData.dailyTargets.fats) * 100}%` }} />
                      </div>
                      <p className="text-sm font-bold text-white">{nutritionLog.fatsConsumed} / {adminData.dailyTargets.fats}g</p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 text-center">
                    <p className="text-sm text-muted-foreground italic">
                      "You're {adminData.dailyTargets.calories - nutritionLog.caloriesConsumed > 0 ? 'under' : 'over'} your calorie limit for today."
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
