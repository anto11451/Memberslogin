import { useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Flame,
  Utensils,
  Activity,
  ChevronRight,
  Heart,
  Scale,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/App";

// Hologram + helpers (added in Part 1)
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================
// BODY TYPE + SOMATOTYPE LOGIC
// ============================

type BodyType = "obese" | "skinny" | "fit" | "muscular";
type Somatotype = "endomorph" | "ectomorph" | "mesomorph";

function determineBodyType(
  bmi: number,
  muscleMass: string = "average",
): BodyType {
  if (muscleMass === "high") return "muscular";
  if (bmi >= 30) return "obese";
  if (bmi < 18.5) return "skinny";
  if (bmi >= 18.5 && bmi < 25) return "fit";
  return "fit";
}

function calculateIdealWeight(
  heightCm: number,
  gender: string,
): { min: number; max: number } {
  const heightM = heightCm / 100;
  const minBmi = 18.5;
  const maxBmi = gender === "male" ? 24.9 : 23.9;
  return {
    min: Math.round(minBmi * heightM * heightM),
    max: Math.round(maxBmi * heightM * heightM),
  };
}

function calculateProteinIntake(weight: number, goal: string): number {
  const multiplier =
    goal === "muscle_gain" ? 2.2 : goal === "fat_loss" ? 2.0 : 1.6;
  return Math.round(weight * multiplier);
}

// ============================
// SOMATOTYPE DETECTION (BMI + MUSCLE MASS)
// ============================

function determineSomatotype(bmi: number, muscleMass?: string): Somatotype {
  if (bmi >= 27) return "endomorph";
  if (bmi < 19 && muscleMass !== "high") return "ectomorph";
  return "mesomorph";
}

function getSomatotypeRecommendation(type: Somatotype): string {
  switch (type) {
    case "endomorph":
      return "Focus on caloric deficit, high steps (8–12k/day), HIIT 2–3× weekly, and strength training with supersets. Reduce sugar & refined carbs.";
    case "ectomorph":
      return "Increase calories (+300–500 surplus), focus on heavy compound lifts, keep cardio low, and increase protein + carbs intake.";
    case "mesomorph":
      return "Follow a balanced training plan with progressive overload, moderate cardio, and high protein intake.";
    default:
      return "";
  }
}

// ============================
// HOLOGRAPHIC BODY MAP (OLD VERSION RESTORED)
// ============================

function HolographicBodyMap({
  bodyType,
  somatotype,
  onAnalysisClick,
}: {
  bodyType: BodyType;
  somatotype: string;
  onAnalysisClick: () => void;
}) {
  const colors = {
    primary: "#00eaff",
    glow: "rgba(0, 234, 255, 0.55)",
    innerGlow: "rgba(0, 150, 200, 0.25)",
    scanBeam: "rgba(0, 245, 255, 0.35)",
    particles: "#7ffcff",
  };

  // REAL BODY PATHS — FROM YOUR ORIGINAL COMPONENT
  const bodyPaths: Record<BodyType, string> = {
    obese:
      "M150,25 C170,25 182,38 182,55 C182,70 172,82 162,86 L168,90 C195,96 218,100 230,120 L245,145 L255,200 L250,260 C248,270 235,275 225,265 L210,220 L200,140 L185,145 L192,200 L188,265 L182,275 L190,340 L195,420 L185,440 L160,445 L152,350 L150,270 L148,350 L140,445 L115,440 L105,420 L110,340 L118,275 L112,265 L108,200 L115,145 L100,140 L90,220 L75,265 C65,275 52,270 50,260 L45,200 L55,145 L70,120 C82,100 105,96 132,90 L138,86 C128,82 118,70 118,55 C118,38 130,25 150,25 Z",

    skinny:
      "M150,25 C162,25 170,35 170,48 C170,60 163,70 156,74 L160,78 C175,82 188,82 198,95 L206,112 L210,155 L206,190 C204,195 198,195 194,190 L188,155 L184,108 L174,110 L177,145 L173,195 L168,202 L172,275 L175,355 L168,370 L155,373 L148,290 L146,220 L144,290 L137,373 L124,370 L117,355 L120,275 L124,202 L119,195 L115,145 L118,110 L108,108 L104,155 L98,190 C94,195 88,195 86,190 L82,155 L86,112 L94,95 C104,82 117,82 132,78 L136,74 C129,70 122,60 122,48 C122,35 130,25 150,25 Z",

    fit: "M150,25 C165,25 175,35 175,50 C175,62 168,72 160,75 L165,78 C185,82 200,80 210,95 L220,115 L225,160 L220,195 C218,200 212,200 208,195 L200,155 L195,108 L182,110 L185,145 L180,200 L175,205 L180,280 L182,360 L175,375 L160,378 L152,290 L150,220 L148,290 L140,378 L125,375 L118,360 L120,280 L125,205 L120,200 L115,145 L118,110 L105,108 L100,155 L92,195 C88,200 82,200 80,195 L75,160 L80,115 L90,95 C100,80 115,82 135,78 L140,75 C132,72 125,62 125,50 C125,35 135,25 150,25 Z",

    muscular:
      "M150,25 C168,25 180,36 180,52 C180,66 170,76 160,80 L166,84 C192,90 212,95 225,115 L238,140 L245,190 L238,230 C236,238 225,240 218,232 L205,185 L198,125 L180,128 L186,175 L182,235 L176,245 L182,315 L186,400 L178,418 L158,422 L150,325 L150,245 L150,325 L142,422 L122,418 L114,400 L118,315 L124,245 L118,235 L114,175 L120,128 L102,125 L95,185 L82,232 C75,240 64,238 62,230 L55,190 L62,140 L75,115 C88,95 108,90 134,84 L140,80 C130,76 120,66 120,52 C120,36 132,25 150,25 Z",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      onClick={onAnalysisClick}
      className="relative h-72 rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br from-black/40 to-black/10 border border-cyan-500/20 backdrop-blur-md"
    >
      {/* CYAN OUTER GLOW */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
          opacity: 0.45,
        }}
      />

      {/* PARTICLES */}
      {[...Array(22)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: colors.particles,
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
          }}
          animate={{ opacity: [0.1, 1, 0.2], scale: [0.6, 1.4, 0.6] }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* SCAN BEAM */}
      <motion.div
        className="absolute left-0 w-full h-12"
        style={{
          background: `linear-gradient(to bottom, transparent, ${colors.scanBeam}, transparent)`,
        }}
        animate={{ top: ["0%", "85%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* BODY SVG */}
      <svg viewBox="0 0 300 450" className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="depthShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
            <stop offset="50%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop offset="90%" stopColor={colors.primary} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* MAIN BODY */}
        <motion.path
          d={bodyPaths[bodyType]}
          fill="url(#depthShade)"
          stroke={colors.primary}
          strokeWidth="2"
          filter="url(#outerGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* LABELS */}
      <div className="absolute bottom-3 left-3 flex flex-col space-y-1">
        <span
          className="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-widest"
          style={{ backgroundColor: colors.innerGlow, color: colors.primary }}
        >
          {bodyType.toUpperCase()}
        </span>
        <span
          className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: colors.innerGlow, color: colors.primary }}
        >
          {somatotype.toUpperCase()} PROFILE
        </span>
      </div>

      {/* BUTTON */}
      <div className="absolute bottom-3 right-3">
        <Button
          size="sm"
          variant="ghost"
          className="text-white/70 hover:text-white text-xs group-hover:bg-white/10"
        >
          Workout Guide <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  // ----------------------------
  // USER BASIC VALUES
  // ----------------------------
  const firstName = user?.name?.split(" ")[0]?.toUpperCase() || "CHAMP";
  const currentStreak = user?.currentStreak || 0;

  const userHeight = user?.height || 175;
  const userWeight = user?.weight || user?.currentWeight || 70;
  const userGender = user?.gender || "male";
  const userMuscleMass = user?.muscleMass || "average";

  // ----------------------------
  // BODY CALCULATIONS
  // ----------------------------

  const userTargets = useMemo(
    () => ({
      calories: user?.calorieTarget || 2000,
      protein: user?.proteinTarget || 150,
      carbs: user?.carbsTarget || 200,
      fats: user?.fatsTarget || 65,
    }),
    [user],
  );

  const bmi = userWeight / Math.pow(userHeight / 100, 2);
  const bodyType = determineBodyType(bmi, userMuscleMass);
  const idealWeight = calculateIdealWeight(userHeight, userGender);
  const recommendedProtein = calculateProteinIntake(userWeight, "muscle_gain");

  // SOMATOTYPE PROFILE
  const somatotype = determineSomatotype(bmi, userMuscleMass);
  const somatotypeAdvice = getSomatotypeRecommendation(somatotype);

  // ----------------------------
  // PROGRAM INFO
  // ----------------------------
  const programInfo = useMemo(() => {
    if (!user?.programStartDate || !user?.programEndDate) {
      return { currentDay: 1, totalDays: 90, currentWeek: 1 };
    }
    const start = new Date(user.programStartDate);
    const end = new Date(user.programEndDate);
    const now = new Date();

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const currentDay = Math.max(
      1,
      Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const currentWeek = Math.ceil(currentDay / 7);

    return {
      currentDay: Math.min(currentDay, totalDays),
      totalDays,
      currentWeek,
    };
  }, [user]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* ---------------------------------- */}
        {/* WELCOME HEADER */}
        {/* ---------------------------------- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
              WELCOME BACK,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {firstName}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your body is a machine. Keep it tuned.
            </p>
          </div>

          <Link href="/app/streak">
            <Button className="bg-orange-500/10 text-orange-500 border border-orange-500/50 hover:bg-orange-500 hover:text-white transition-all group">
              YOUR STREAK: {currentStreak} DAYS{" "}
              <Flame className="w-4 h-4 ml-2 group-hover:animate-bounce" />
            </Button>
          </Link>
        </div>

        {/* ---------------------------------- */}
        {/* TODAY'S ACTION CARDS (UNCHANGED) */}
        {/* ---------------------------------- */}
        {/* Keeping your new UI EXACTLY as it is */}
        {/* This entire block is copied untouched from your new Dashboard */}

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/app/plans">
            <Card className="bg-card/40 border-white/5 p-6 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all h-full">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
                    Today's Focus
                  </p>
                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                    {user?.nextSession || "Rest Day"}
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </h3>
                  <p className="text-xs mt-1 text-primary opacity-80">
                    Week {programInfo.currentWeek} • Day{" "}
                    {programInfo.currentDay}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                45–60 min session ready
              </p>
              <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20 font-bold">
                VIEW WORKOUT PLANS
              </Button>
            </Card>
          </Link>

          <Link href="/app/nutrition">
            <Card className="bg-card/40 border-white/5 p-6 relative overflow-hidden group cursor-pointer hover:border-accent/50 transition-all h-full">
              <div className="absolute right-0 top-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-all" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
                    Fuel Tracker
                  </p>
                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2">
                    {userTargets.calories} kcal{" "}
                    <ChevronRight className="w-5 h-5 text-accent" />
                  </h3>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Remaining of {userTargets.calories} target
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                  <Utensils className="w-6 h-6" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Daily Progress</span>
                  <span className="text-accent font-bold">0%</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>

              <Button className="w-full bg-accent/10 text-accent hover:bg-accent hover:text-black border border-accent/20 font-bold">
                OPEN MACRO CALCULATOR
              </Button>
            </Card>
          </Link>
        </div>

        {/* ---------------------------------- */}
        {/* 🔥 RESTORED OLD HOLOGRAM SECTION */}
        {/* ---------------------------------- */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-card/80 to-black/80 p-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50" />

          <div className="grid lg:grid-cols-3 gap-8 p-6 lg:p-12">
            {/* LEFT SIDE — BODY STATS + SOMATOTYPE */}
            <div className="lg:col-span-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Body Analysis
              </div>

              <h2 className="text-3xl font-display font-bold">
                YOUR BODY <span className="text-primary">PROFILE</span>
              </h2>

              <p className="text-muted-foreground">
                Your personalized assessment powered by body composition,
                somatotype science and BMI.
              </p>

              {/* BMI */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Heart className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-xs text-muted-foreground">BMI</p>
                  <p className="font-bold text-white">{bmi.toFixed(1)}</p>
                </div>
              </div>

              {/* Ideal Weight */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Scale className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Target Weight</p>
                  <p className="font-bold text-white">
                    {idealWeight.min}-{idealWeight.max} kg
                  </p>
                </div>
              </div>

              {/* Protein */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Daily Protein</p>
                  <p className="font-bold text-white">{recommendedProtein}g</p>
                </div>
              </div>

              {/* SOMATOTYPE */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mt-4">
                <p className="text-sm text-primary font-bold uppercase tracking-wider">
                  {somatotype.toUpperCase()} PROFILE
                </p>
                <p className="text-white mt-1">{somatotypeAdvice}</p>
              </div>

              <Link href="/app/progress">
                <Button className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold tracking-wide h-12 px-8">
                  VIEW FULL PROGRESS <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* RIGHT SIDE — HOLOGRAM VISUAL */}
            <div className="lg:col-span-2 relative">
              <HolographicBodyMap
                bodyType={bodyType}
                somatotype={somatotype}
                onAnalysisClick={() => setLocation("/app/bodymap")}
              />

              {/* Body Type Categories */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {["obese", "skinny", "fit", "muscular"].map((type) => (
                  <div
                    key={type}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      bodyType === type
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-white/5 border-white/10 text-muted-foreground",
                    )}
                  >
                    <p className="text-xs uppercase tracking-wider font-bold">
                      {type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
