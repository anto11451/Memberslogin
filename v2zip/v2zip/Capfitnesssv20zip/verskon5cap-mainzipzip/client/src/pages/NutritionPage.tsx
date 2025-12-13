import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recipes } from '@/lib/mockData';
import { Calculator, Utensils, Zap, Plus, X, Video, Save, Check, Trash2, Cloud } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/App';
import { useToast } from '@/hooks/use-toast';
import { submitNutrition } from '@/lib/googleSheetsApi';

const DAILY_LOG_KEY = 'capsfitness_daily_log';

interface FoodEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  timestamp: number;
}

interface DailyLog {
  date: string;
  entries: FoodEntry[];
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatsConsumed: number;
}

const foodDatabase: Record<string, { protein: number; carbs: number; fats: number; calories: number; defaultUnit: string; servingSize: number }> = {
  'Paneer': { protein: 18, carbs: 4, fats: 22, calories: 265, defaultUnit: 'g', servingSize: 100 },
  'Chapati': { protein: 3, carbs: 18, fats: 4, calories: 120, defaultUnit: 'piece', servingSize: 1 },
  'Paratha': { protein: 4, carbs: 30, fats: 10, calories: 220, defaultUnit: 'piece', servingSize: 1 },
  'Idli': { protein: 2, carbs: 12, fats: 0.5, calories: 60, defaultUnit: 'piece', servingSize: 1 },
  'Dosa': { protein: 4, carbs: 28, fats: 5, calories: 170, defaultUnit: 'piece', servingSize: 1 },
  'Poha': { protein: 3, carbs: 25, fats: 4, calories: 150, defaultUnit: 'bowl', servingSize: 1 },
  'Upma': { protein: 4, carbs: 22, fats: 6, calories: 160, defaultUnit: 'bowl', servingSize: 1 },
  'Rajma': { protein: 9, carbs: 23, fats: 0.5, calories: 127, defaultUnit: 'g', servingSize: 100 },
  'Chole': { protein: 8, carbs: 27, fats: 3, calories: 164, defaultUnit: 'g', servingSize: 100 },
  'Dal': { protein: 9, carbs: 20, fats: 1, calories: 116, defaultUnit: 'g', servingSize: 100 },
  'Sprouts': { protein: 7, carbs: 12, fats: 1, calories: 80, defaultUnit: 'g', servingSize: 100 },
  'Omelette': { protein: 12, carbs: 1, fats: 10, calories: 140, defaultUnit: 'eggs', servingSize: 2 },
  'Chicken Curry': { protein: 25, carbs: 8, fats: 12, calories: 240, defaultUnit: 'g', servingSize: 150 },
  'Fish Fry': { protein: 20, carbs: 5, fats: 10, calories: 180, defaultUnit: 'piece', servingSize: 1 },
  'Curd': { protein: 4, carbs: 5, fats: 3, calories: 60, defaultUnit: 'g', servingSize: 100 },
  'Whey Scoop': { protein: 24, carbs: 3, fats: 1, calories: 120, defaultUnit: 'scoop', servingSize: 1 },
  'Eggs': { protein: 6, carbs: 1, fats: 5, calories: 70, defaultUnit: 'piece', servingSize: 1 },
  'Chicken Breast': { protein: 31, carbs: 0, fats: 3.6, calories: 165, defaultUnit: 'g', servingSize: 100 },
  'Rice': { protein: 2.7, carbs: 28, fats: 0.3, calories: 130, defaultUnit: 'g', servingSize: 100 },
  'Banana': { protein: 1.3, carbs: 27, fats: 0.4, calories: 105, defaultUnit: 'piece', servingSize: 1 },
  'Milk': { protein: 3.4, carbs: 5, fats: 3.6, calories: 60, defaultUnit: 'ml', servingSize: 100 },
  'Almonds': { protein: 21, carbs: 22, fats: 50, calories: 579, defaultUnit: 'g', servingSize: 100 },
  'Peanut Butter': { protein: 25, carbs: 20, fats: 50, calories: 588, defaultUnit: 'tbsp', servingSize: 2 },
  'Oats': { protein: 13, carbs: 68, fats: 7, calories: 389, defaultUnit: 'g', servingSize: 100 },
};

const unitOptions = ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece', 'scoop', 'bowl', 'eggs'];

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getEmptyLog(): DailyLog {
  return {
    date: getTodayKey(),
    entries: [],
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatsConsumed: 0,
  };
}

export default function NutritionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [macroInput, setMacroInput] = useState('');
  const [calculatedMacros, setCalculatedMacros] = useState<{p: number, c: number, f: number, cal: number, name: string} | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog>(getEmptyLog());
  
  const [portionQuantity, setPortionQuantity] = useState<number>(1);
  const [portionUnit, setPortionUnit] = useState<string>('serving');

  const targets = {
    calories: user?.calorieTarget || 2000,
    protein: user?.proteinTarget || 150,
    carbs: user?.carbsTarget || 200,
    fats: user?.fatsTarget || 65,
  };

  const indianPresets = [
    'Paneer', 'Chapati', 'Paratha', 'Idli', 'Dosa', 'Poha', 'Upma', 'Rajma', 
    'Chole', 'Dal', 'Sprouts', 'Omelette', 'Chicken Curry', 'Fish Fry', 'Curd', 'Whey Scoop'
  ];

  useEffect(() => {
    const stored = localStorage.getItem(DAILY_LOG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as DailyLog;
      if (parsed.date === getTodayKey()) {
        setDailyLog(parsed);
      } else {
        localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(getEmptyLog()));
      }
    }
  }, []);

  const saveDailyLog = (log: DailyLog) => {
    localStorage.setItem(DAILY_LOG_KEY, JSON.stringify(log));
    setDailyLog(log);
  };

  const calculateFromInput = (input: string): { p: number; c: number; f: number; cal: number } => {
    let totalP = 0, totalC = 0, totalF = 0, totalCal = 0;
    
    const items = input.split(',').map(item => item.trim().toLowerCase());
    
    for (const item of items) {
      const quantityMatch = item.match(/^(\d+\.?\d*)\s*(g|ml|oz|cup|cups|piece|pieces|scoop|scoops|bowl|bowls|eggs?|tbsp|tsp)?\s*/i);
      let quantity = 1;
      let cleanItem = item;
      
      if (quantityMatch) {
        quantity = parseFloat(quantityMatch[1]) || 1;
        cleanItem = item.replace(quantityMatch[0], '').trim();
      }
      
      for (const [foodName, data] of Object.entries(foodDatabase)) {
        if (cleanItem.toLowerCase().includes(foodName.toLowerCase()) || foodName.toLowerCase().includes(cleanItem)) {
          const multiplier = quantity / data.servingSize;
          totalP += data.protein * multiplier;
          totalC += data.carbs * multiplier;
          totalF += data.fats * multiplier;
          totalCal += data.calories * multiplier;
          break;
        }
      }
    }
    
    if (totalCal === 0 && input.length > 0) {
      const baseMultiplier = Math.min(input.length / 10, 3);
      totalP = Math.round(15 * baseMultiplier);
      totalC = Math.round(20 * baseMultiplier);
      totalF = Math.round(8 * baseMultiplier);
      totalCal = Math.round((totalP * 4) + (totalC * 4) + (totalF * 9));
    }
    
    return {
      p: Math.round(totalP * portionQuantity),
      c: Math.round(totalC * portionQuantity),
      f: Math.round(totalF * portionQuantity),
      cal: Math.round(totalCal * portionQuantity),
    };
  };

  const handleCalculate = () => {
    if (!macroInput.trim()) {
      toast({
        title: "Enter food items",
        description: "Please type what you ate to calculate macros.",
        variant: "destructive",
      });
      return;
    }
    
    const macros = calculateFromInput(macroInput);
    setCalculatedMacros({
      ...macros,
      name: macroInput,
    });
  };

  const handleAddToLog = async () => {
    if (!calculatedMacros) return;

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: calculatedMacros.name,
      quantity: portionQuantity,
      unit: portionUnit,
      protein: calculatedMacros.p,
      carbs: calculatedMacros.c,
      fats: calculatedMacros.f,
      calories: calculatedMacros.cal,
      timestamp: Date.now(),
    };

    const updatedLog: DailyLog = {
      ...dailyLog,
      entries: [...dailyLog.entries, newEntry],
      caloriesConsumed: dailyLog.caloriesConsumed + newEntry.calories,
      proteinConsumed: dailyLog.proteinConsumed + newEntry.protein,
      carbsConsumed: dailyLog.carbsConsumed + newEntry.carbs,
      fatsConsumed: dailyLog.fatsConsumed + newEntry.fats,
    };

    saveDailyLog(updatedLog);
    setMacroInput('');
    setCalculatedMacros(null);
    setPortionQuantity(1);
    setPortionUnit('serving');

    let syncSuccess = false;
    if (user?.userId) {
      try {
        const result = await submitNutrition(user.userId, getTodayKey(), [{
          name: newEntry.name,
          calories: newEntry.calories,
          protein: newEntry.protein,
          carbs: newEntry.carbs,
          fats: newEntry.fats,
        }]);
        syncSuccess = result?.ok === true;
      } catch (error) {
        console.error('Failed to sync nutrition to cloud:', error);
      }
    }

    toast({
      title: "Added to daily log",
      description: syncSuccess 
        ? `${newEntry.name} (${newEntry.calories} cal) synced to cloud.`
        : `${newEntry.name} (${newEntry.calories} cal) saved locally.`,
    });
  };

  const handleRemoveEntry = (entryId: string) => {
    const entry = dailyLog.entries.find(e => e.id === entryId);
    if (!entry) return;

    const updatedLog: DailyLog = {
      ...dailyLog,
      entries: dailyLog.entries.filter(e => e.id !== entryId),
      caloriesConsumed: dailyLog.caloriesConsumed - entry.calories,
      proteinConsumed: dailyLog.proteinConsumed - entry.protein,
      carbsConsumed: dailyLog.carbsConsumed - entry.carbs,
      fatsConsumed: dailyLog.fatsConsumed - entry.fats,
    };

    saveDailyLog(updatedLog);
    toast({
      title: "Removed from log",
      description: `${entry.name} removed from your daily log.`,
    });
  };

  const progressPercent = (consumed: number, target: number) => {
    return Math.min((consumed / target) * 100, 100);
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
                        <Button variant="outline" className="w-full border-neon-green/50 text-neon-green font-bold hover:bg-neon-green hover:text-black">
                          VIEW RECIPE
                        </Button>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-display font-bold text-white">{recipe.name}</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        {recipe.tags.join(' • ')}
                      </DialogDescription>
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
                        <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-2">
                            <Video className="w-4 h-4 mr-2" /> WATCH COOKING VIDEO
                          </Button>
                        </a>
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

          <TabsContent value="calculator" className="max-w-5xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-card/40 border-white/5 backdrop-blur-xl h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">MACRO CALCULATOR</h3>
                    <p className="text-muted-foreground text-sm">Type what you ate, get instant macros.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea 
                    className="w-full h-28 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none resize-none"
                    placeholder="E.g., 2 eggs, 200g chicken breast, 1 cup rice..."
                    value={macroInput}
                    onChange={(e) => setMacroInput(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Quantity</Label>
                      <Input
                        type="number"
                        min={0.1}
                        step={0.5}
                        value={portionQuantity}
                        onChange={(e) => setPortionQuantity(parseFloat(e.target.value) || 1)}
                        className="bg-black/40 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Unit</Label>
                      <Select value={portionUnit} onValueChange={setPortionUnit}>
                        <SelectTrigger className="bg-black/40 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="serving">serving</SelectItem>
                          {unitOptions.map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Quick Add</p>
                    <div className="flex flex-wrap gap-2">
                      {indianPresets.slice(0, 8).map(item => (
                        <Button
                          key={item}
                          variant="outline"
                          size="sm"
                          onClick={() => setMacroInput(prev => prev ? `${prev}, ${item}` : item)}
                          className="text-xs bg-white/5 border-white/10 text-white hover:border-neon-green hover:text-neon-green hover:bg-neon-green/10"
                        >
                          <Plus className="w-3 h-3 mr-1" /> {item}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-neon-green text-black font-bold hover:bg-neon-green/80 h-12 text-lg mt-2"
                    onClick={handleCalculate}
                  >
                    CALCULATE MACROS
                  </Button>

                  {calculatedMacros && (
                    <div className="mt-6 pt-6 border-t border-white/10 animate-in slide-in-from-bottom-4">
                      <div className="grid grid-cols-4 gap-4 text-center mb-4">
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
                      <Button
                        className="w-full bg-neon-green/20 hover:bg-neon-green/40 text-neon-green border border-neon-green/50 font-bold"
                        onClick={handleAddToLog}
                      >
                        <Check className="w-4 h-4 mr-2" /> ADD TO DAILY LOG
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

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
                         <p className="text-xs text-muted-foreground">Remaining: {Math.max(0, targets.calories - dailyLog.caloriesConsumed)}</p>
                       </div>
                       <p className="text-2xl font-display font-bold text-white">{dailyLog.caloriesConsumed} <span className="text-sm text-muted-foreground font-normal">/ {targets.calories}</span></p>
                     </div>
                     <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-300 ${dailyLog.caloriesConsumed > targets.calories ? 'bg-red-500' : 'bg-white'}`} 
                         style={{ width: `${progressPercent(dailyLog.caloriesConsumed, targets.calories)}%` }} 
                       />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Protein</p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-green transition-all duration-300" style={{ width: `${progressPercent(dailyLog.proteinConsumed, targets.protein)}%` }} />
                      </div>
                      <p className="text-sm font-bold text-white">{dailyLog.proteinConsumed} / {targets.protein}g</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Carbs</p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progressPercent(dailyLog.carbsConsumed, targets.carbs)}%` }} />
                      </div>
                      <p className="text-sm font-bold text-white">{dailyLog.carbsConsumed} / {targets.carbs}g</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Fats</p>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${progressPercent(dailyLog.fatsConsumed, targets.fats)}%` }} />
                      </div>
                      <p className="text-sm font-bold text-white">{dailyLog.fatsConsumed} / {targets.fats}g</p>
                    </div>
                  </div>

                  {dailyLog.entries.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-white/10">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Today's Log</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {dailyLog.entries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="text-white truncate">{entry.name}</p>
                              <p className="text-xs text-muted-foreground">{entry.calories} cal | P:{entry.protein}g C:{entry.carbs}g F:{entry.fats}g</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveEntry(entry.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-white/5 text-center">
                    <p className="text-sm text-muted-foreground italic">
                      {dailyLog.caloriesConsumed === 0 
                        ? "Start logging your meals to track your progress!"
                        : targets.calories - dailyLog.caloriesConsumed > 0 
                          ? `You're ${targets.calories - dailyLog.caloriesConsumed} calories under your target.`
                          : `You're ${dailyLog.caloriesConsumed - targets.calories} calories over your target.`
                      }
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
