import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Minus, 
  ChevronRight, 
  ChevronLeft,
  Dumbbell,
  Flame,
  Timer,
  Volume2,
  VolumeX,
  Check,
  Trash2,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

type WorkoutMode = 'weight' | 'abs-cardio';
type AppStep = 'landing' | 'mode-select' | 'plan-select' | 'edit-workout' | 'workout-active' | 'workout-complete' | 'custom-builder';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restDuration?: number;
  gifUrl?: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  type: WorkoutMode;
  exercises: Exercise[];
  isCustom?: boolean;
  totalDuration?: string;
}

const WEIGHT_TRAINING_PLANS: WorkoutPlan[] = [
  {
    id: 'bro-split',
    name: 'Bro Split',
    type: 'weight',
    exercises: [
      { id: '1', name: 'Bench Press', sets: 4, reps: 10, weight: 135 },
      { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 50 },
      { id: '3', name: 'Cable Flyes', sets: 3, reps: 15 },
      { id: '4', name: 'Tricep Pushdowns', sets: 3, reps: 12 },
      { id: '5', name: 'Overhead Tricep Extension', sets: 3, reps: 12 },
    ]
  },
  {
    id: 'push-pull-legs',
    name: 'Push Pull Legs',
    type: 'weight',
    exercises: [
      { id: '1', name: 'Squats', sets: 4, reps: 8, weight: 185 },
      { id: '2', name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 135 },
      { id: '3', name: 'Leg Press', sets: 3, reps: 12 },
      { id: '4', name: 'Leg Curls', sets: 3, reps: 12 },
      { id: '5', name: 'Calf Raises', sets: 4, reps: 15 },
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper Lower',
    type: 'weight',
    exercises: [
      { id: '1', name: 'Pull-ups', sets: 4, reps: 8 },
      { id: '2', name: 'Barbell Rows', sets: 4, reps: 10, weight: 135 },
      { id: '3', name: 'Shoulder Press', sets: 3, reps: 10, weight: 95 },
      { id: '4', name: 'Lateral Raises', sets: 3, reps: 15 },
      { id: '5', name: 'Bicep Curls', sets: 3, reps: 12 },
    ]
  },
  {
    id: 'mixed-routine',
    name: 'Mixed Routine',
    type: 'weight',
    exercises: [
      { id: '1', name: 'Deadlift', sets: 4, reps: 6, weight: 225 },
      { id: '2', name: 'Bench Press', sets: 4, reps: 8, weight: 155 },
      { id: '3', name: 'Barbell Rows', sets: 3, reps: 10, weight: 135 },
      { id: '4', name: 'Dumbbell Lunges', sets: 3, reps: 12 },
    ]
  },
  {
    id: 'beginner-strength',
    name: 'Beginner Strength',
    type: 'weight',
    exercises: [
      { id: '1', name: 'Goblet Squats', sets: 3, reps: 10, weight: 30 },
      { id: '2', name: 'Push-ups', sets: 3, reps: 10 },
      { id: '3', name: 'Dumbbell Rows', sets: 3, reps: 10, weight: 25 },
      { id: '4', name: 'Plank', sets: 3, reps: 30 },
    ]
  },
  {
    id: 'fat-loss-strength',
    name: 'Fat Loss Strength',
    type: 'weight',
    exercises: [
      { id: '1', name: 'Kettlebell Swings', sets: 4, reps: 20 },
      { id: '2', name: 'Burpees', sets: 3, reps: 10 },
      { id: '3', name: 'Mountain Climbers', sets: 3, reps: 20 },
      { id: '4', name: 'Jump Squats', sets: 3, reps: 15 },
      { id: '5', name: 'Battle Ropes', sets: 3, reps: 30 },
    ]
  },
];

const ABS_CARDIO_PLANS: WorkoutPlan[] = [
  {
    id: 'beginner-abs',
    name: 'Beginner Abs',
    type: 'abs-cardio',
    totalDuration: '5 min',
    exercises: [
      { id: '1', name: 'Crunches', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '2', name: 'Leg Raises', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnR6M3p0Mmw0dW82cnI3MjFmc2RxcjFlcHQ3cWsyNjlraTEwbnBmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif' },
      { id: '3', name: 'Bicycle Crunches', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGJhbmgwMTBkcm1jdDdhemhwYjM1bHd5dDVoMnpqdWM1d2tmcTI5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9DPJVjlYHwWsZRxm/giphy.gif' },
      { id: '4', name: 'Plank Hold', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk2d2swNjltdGtiYjFnZjBnb2drMW5pbDhxNXFmZG12dnE3cXB4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6bVAk7wUmY/giphy.gif' },
      { id: '5', name: 'Mountain Climbers', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
    ]
  },
  {
    id: 'intense-abs',
    name: 'Intense Abs',
    type: 'abs-cardio',
    totalDuration: '10 min',
    exercises: [
      { id: '1', name: 'V-Ups', sets: 1, reps: 1, duration: 40, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '2', name: 'Russian Twists', sets: 1, reps: 1, duration: 40, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGJhbmgwMTBkcm1jdDdhemhwYjM1bHd5dDVoMnpqdWM1d2tmcTI5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9DPJVjlYHwWsZRxm/giphy.gif' },
      { id: '3', name: 'Toe Touches', sets: 1, reps: 1, duration: 40, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnR6M3p0Mmw0dW82cnI3MjFmc2RxcjFlcHQ3cWsyNjlraTEwbnBmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif' },
      { id: '4', name: 'Flutter Kicks', sets: 1, reps: 1, duration: 40, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
      { id: '5', name: 'Dead Bug', sets: 1, reps: 1, duration: 40, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk2d2swNjltdGtiYjFnZjBnb2drMW5pbDhxNXFmZG12dnE3cXB4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6bVAk7wUmY/giphy.gif' },
      { id: '6', name: 'Plank Jacks', sets: 1, reps: 1, duration: 40, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
    ]
  },
  {
    id: 'core-strength',
    name: 'Core Strength',
    type: 'abs-cardio',
    totalDuration: '15 min',
    exercises: [
      { id: '1', name: 'Hollow Body Hold', sets: 1, reps: 1, duration: 45, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk2d2swNjltdGtiYjFnZjBnb2drMW5pbDhxNXFmZG12dnE3cXB4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6bVAk7wUmY/giphy.gif' },
      { id: '2', name: 'Side Plank Left', sets: 1, reps: 1, duration: 30, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '3', name: 'Side Plank Right', sets: 1, reps: 1, duration: 30, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '4', name: 'Bird Dogs', sets: 1, reps: 1, duration: 40, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGJhbmgwMTBkcm1jdDdhemhwYjM1bHd5dDVoMnpqdWM1d2tmcTI5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9DPJVjlYHwWsZRxm/giphy.gif' },
      { id: '5', name: 'Superman Hold', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnR6M3p0Mmw0dW82cnI3MjFmc2RxcjFlcHQ3cWsyNjlraTEwbnBmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif' },
      { id: '6', name: 'Plank Up-Downs', sets: 1, reps: 1, duration: 45, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
      { id: '7', name: 'Reverse Crunches', sets: 1, reps: 1, duration: 40, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '8', name: 'Ab Wheel Rollouts', sets: 1, reps: 1, duration: 40, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk2d2swNjltdGtiYjFnZjBnb2drMW5pbDhxNXFmZG12dnE3cXB4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6bVAk7wUmY/giphy.gif' },
    ]
  },
  {
    id: 'home-abs-blast',
    name: 'Home Abs Blast',
    type: 'abs-cardio',
    totalDuration: '8 min',
    exercises: [
      { id: '1', name: 'High Knees', sets: 1, reps: 1, duration: 30, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
      { id: '2', name: 'Plank Hold', sets: 1, reps: 1, duration: 45, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk2d2swNjltdGtiYjFnZjBnb2drMW5pbDhxNXFmZG12dnE3cXB4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6bVAk7wUmY/giphy.gif' },
      { id: '3', name: 'Crunches', sets: 1, reps: 1, duration: 40, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '4', name: 'Leg Raises', sets: 1, reps: 1, duration: 40, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnR6M3p0Mmw0dW82cnI3MjFmc2RxcjFlcHQ3cWsyNjlraTEwbnBmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif' },
      { id: '5', name: 'Bicycle Crunches', sets: 1, reps: 1, duration: 40, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGJhbmgwMTBkcm1jdDdhemhwYjM1bHd5dDVoMnpqdWM1d2tmcTI5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9DPJVjlYHwWsZRxm/giphy.gif' },
    ]
  },
  {
    id: 'hiit-interval',
    name: 'HIIT Interval Routine',
    type: 'abs-cardio',
    totalDuration: '12 min',
    exercises: [
      { id: '1', name: 'Jumping Jacks', sets: 1, reps: 1, duration: 45, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
      { id: '2', name: 'Burpees', sets: 1, reps: 1, duration: 30, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '3', name: 'Mountain Climbers', sets: 1, reps: 1, duration: 40, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
      { id: '4', name: 'High Knees', sets: 1, reps: 1, duration: 45, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGJhbmgwMTBkcm1jdDdhemhwYjM1bHd5dDVoMnpqdWM1d2tmcTI5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9DPJVjlYHwWsZRxm/giphy.gif' },
      { id: '5', name: 'Squat Jumps', sets: 1, reps: 1, duration: 35, restDuration: 20, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnR6M3p0Mmw0dW82cnI3MjFmc2RxcjFlcHQ3cWsyNjlraTEwbnBmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif' },
      { id: '6', name: 'Plank Jacks', sets: 1, reps: 1, duration: 40, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk2d2swNjltdGtiYjFnZjBnb2drMW5pbDhxNXFmZG12dnE3cXB4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6bVAk7wUmY/giphy.gif' },
      { id: '7', name: 'Speed Skaters', sets: 1, reps: 1, duration: 45, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
    ]
  },
  {
    id: 'fat-loss-cardio',
    name: 'Fat Loss Cardio',
    type: 'abs-cardio',
    totalDuration: '10 min',
    exercises: [
      { id: '1', name: 'Jumping Jacks', sets: 1, reps: 1, duration: 40, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
      { id: '2', name: 'High Knees', sets: 1, reps: 1, duration: 40, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGJhbmgwMTBkcm1jdDdhemhwYjM1bHd5dDVoMnpqdWM1d2tmcTI5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9DPJVjlYHwWsZRxm/giphy.gif' },
      { id: '3', name: 'Burpees', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3J6bWNiaWNvNnFvb2JxZm80emNqNDFqcDN0c2NkOHRiM3pzaXJ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qBff8cRRFf7k2u4/giphy.gif' },
      { id: '4', name: 'Mountain Climbers', sets: 1, reps: 1, duration: 40, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpjOWI3anhjYXA0bGw2cTF4d2M3aHU4OHBxdWxxd3hrM3Q3MnJoOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1qfKN8Dt0CRdCRxz57/giphy.gif' },
      { id: '5', name: 'Squat Pulses', sets: 1, reps: 1, duration: 45, restDuration: 10, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnR6M3p0Mmw0dW82cnI3MjFmc2RxcjFlcHQ3cWsyNjlraTEwbnBmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNQ03J5JxX6lva/giphy.gif' },
      { id: '6', name: 'Tuck Jumps', sets: 1, reps: 1, duration: 30, restDuration: 15, gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk2d2swNjltdGtiYjFnZjBnb2drMW5pbDhxNXFmZG12dnE3cXB4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNaQ6bVAk7wUmY/giphy.gif' },
    ]
  },
];

function useVoiceCoach(enabled: boolean) {
  const speak = useCallback((text: string) => {
    if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [enabled]);

  return { speak };
}

function useTimer(initialTime: number, onComplete: () => void) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev: number) => {
          if (prev <= 1) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, onComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newTime: number) => {
    setTime(newTime);
    setIsRunning(false);
  };

  return { time, isRunning, start, pause, reset };
}

function useStopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev: number) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return { time, isRunning, start, stop, reset };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <motion.div
        animate={{ 
          boxShadow: [
            '0 0 30px rgba(0, 255, 157, 0.3)',
            '0 0 60px rgba(0, 255, 157, 0.5)',
            '0 0 30px rgba(0, 255, 157, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8"
      >
        <Dumbbell className="w-16 h-16 text-black" />
      </motion.div>
      
      <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-wider">
        YOUR WORKOUT<br /><span className="text-primary">PARTNER</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-muted-foreground mb-12">
        Are you ready to train?
      </p>
      
      <Button 
        onClick={onStart}
        size="lg"
        className="text-xl px-12 py-6 rounded-full bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_30px_rgba(0,255,157,0.5)] hover:shadow-[0_0_50px_rgba(0,255,157,0.7)] transition-all duration-300"
      >
        Let's Begin
        <ChevronRight className="w-6 h-6 ml-2" />
      </Button>
    </motion.div>
  );
}

function ModeSelection({ onSelect }: { onSelect: (mode: WorkoutMode) => void }) {
  const [selectedMode, setSelectedMode] = useState<WorkoutMode>('weight');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8 text-center">
        Choose Your <span className="text-primary">Mode</span>
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-12 w-full max-w-2xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMode('weight')}
          className={cn(
            "flex-1 p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
            selectedMode === 'weight' 
              ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,255,157,0.3)]"
              : "border-white/10 bg-card hover:border-white/30"
          )}
        >
          <Dumbbell className={cn("w-12 h-12 mb-4 mx-auto", selectedMode === 'weight' ? "text-primary" : "text-white")} />
          <h3 className="text-xl font-display font-bold text-white mb-2">Weight Training Mode</h3>
          <p className="text-muted-foreground text-sm">Track sets, reps, and rest periods</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMode('abs-cardio')}
          className={cn(
            "flex-1 p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
            selectedMode === 'abs-cardio' 
              ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(0,200,255,0.3)]"
              : "border-white/10 bg-card hover:border-white/30"
          )}
        >
          <Flame className={cn("w-12 h-12 mb-4 mx-auto", selectedMode === 'abs-cardio' ? "text-accent" : "text-white")} />
          <h3 className="text-xl font-display font-bold text-white mb-2">Abs / Cardio Coach</h3>
          <p className="text-muted-foreground text-sm">Guided workouts with voice & GIFs</p>
        </motion.button>
      </div>

      <Button 
        onClick={() => onSelect(selectedMode)}
        size="lg"
        className="px-12 py-6 rounded-full bg-primary text-black font-bold hover:bg-primary/90"
      >
        Continue
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
}

function PlanSelection({ 
  mode, 
  customPlans,
  onSelectPlan, 
  onBack,
  onCreateCustom 
}: { 
  mode: WorkoutMode; 
  customPlans: WorkoutPlan[];
  onSelectPlan: (plan: WorkoutPlan) => void; 
  onBack: () => void;
  onCreateCustom: () => void;
}) {
  const plans = mode === 'weight' ? WEIGHT_TRAINING_PLANS : ABS_CARDIO_PLANS;
  const allPlans = [...plans, ...customPlans.filter(p => p.type === mode)];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
          {mode === 'weight' ? 'Weight Training' : 'Abs / Cardio'} <span className="text-primary">Plans</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {allPlans.map(plan => (
          <motion.button
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPlan(plan)}
            className="p-6 rounded-xl border border-white/10 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-display font-bold text-white">{plan.name}</h3>
              {plan.isCustom && (
                <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">Custom</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {plan.exercises.length} exercises
              {plan.totalDuration && ` • ${plan.totalDuration}`}
            </p>
          </motion.button>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={onCreateCustom}
          className="border-dashed border-white/30 hover:border-primary hover:bg-primary/10"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your Own Workout
        </Button>
      </div>
    </motion.div>
  );
}

function ExerciseEditor({
  plan,
  onSave,
  onBack,
  onStart
}: {
  plan: WorkoutPlan;
  onSave: (plan: WorkoutPlan) => void;
  onBack: () => void;
  onStart: () => void;
}) {
  const [exercises, setExercises] = useState<Exercise[]>(plan.exercises);
  const [newExerciseName, setNewExerciseName] = useState('');

  const updateExercise = (id: string, field: keyof Exercise, value: number | string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const addExercise = () => {
    if (!newExerciseName.trim()) return;
    const newEx: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      sets: 3,
      reps: 10,
    };
    setExercises(prev => [...prev, newEx]);
    setNewExerciseName('');
  };

  const handleStart = () => {
    onSave({ ...plan, exercises });
    onStart();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto px-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-display font-bold text-white">{plan.name}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {exercises.map((ex, idx) => (
          <Card key={ex.id} className="p-4 bg-card border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-primary font-display font-bold text-lg w-8">{idx + 1}</span>
              
              <div className="flex-1">
                <Input
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                  className="bg-transparent border-none text-white font-medium text-lg p-0 h-auto focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center">
                  <label className="text-xs text-muted-foreground block mb-1">Sets</label>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6"
                      onClick={() => updateExercise(ex.id, 'sets', Math.max(1, ex.sets - 1))}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-bold text-primary">{ex.sets}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6"
                      onClick={() => updateExercise(ex.id, 'sets', ex.sets + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <label className="text-xs text-muted-foreground block mb-1">Reps</label>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6"
                      onClick={() => updateExercise(ex.id, 'reps', Math.max(1, ex.reps - 1))}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-bold text-primary">{ex.reps}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6"
                      onClick={() => updateExercise(ex.id, 'reps', ex.reps + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <label className="text-xs text-muted-foreground block mb-1">Weight</label>
                  <Input
                    type="number"
                    value={ex.weight || ''}
                    onChange={(e) => updateExercise(ex.id, 'weight', parseInt(e.target.value) || 0)}
                    placeholder="lbs"
                    className="w-16 text-center bg-white/5 border-white/10"
                  />
                </div>

                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-destructive hover:bg-destructive/20"
                  onClick={() => removeExercise(ex.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        <Input
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
          placeholder="Add new exercise..."
          className="bg-white/5 border-white/10"
          onKeyDown={(e) => e.key === 'Enter' && addExercise()}
        />
        <Button onClick={addExercise} className="bg-primary/20 text-primary hover:bg-primary/30">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <Button 
        onClick={handleStart}
        className="w-full py-6 text-lg bg-primary text-black font-bold hover:bg-primary/90"
      >
        <Play className="w-5 h-5 mr-2" />
        Start Workout
      </Button>
    </motion.div>
  );
}

function WeightWorkoutActive({
  plan,
  voiceEnabled,
  onToggleVoice,
  onComplete,
  onStop
}: {
  plan: WorkoutPlan;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onComplete: (stats: { totalTime: number; exercisesCompleted: number }) => void;
  onStop: () => void;
}) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [setInProgress, setSetInProgress] = useState(false);
  const [restTime, setRestTime] = useState(60);
  
  const { speak } = useVoiceCoach(voiceEnabled);
  const setTimer = useStopwatch();
  const totalTimer = useStopwatch();
  
  const [restCountdown, setRestCountdown] = useState(60);
  const restIntervalRef = useRef<number | null>(null);

  const currentExercise = plan.exercises[currentExerciseIdx];
  const totalExercises = plan.exercises.length;
  const isLastSet = currentSet >= currentExercise.sets;
  const isLastExercise = currentExerciseIdx >= totalExercises - 1;

  useEffect(() => {
    totalTimer.start();
    speak("Let's start your workout!");
    return () => totalTimer.stop();
  }, []);

  useEffect(() => {
    if (isResting && restCountdown > 0) {
      restIntervalRef.current = window.setInterval(() => {
        setRestCountdown((prev: number) => {
          if (prev <= 1) {
            if (restIntervalRef.current) window.clearInterval(restIntervalRef.current);
            speak("Go!");
            setTimeout(() => {
              handleRestComplete();
            }, 1500);
            return 0;
          }
          if (prev === Math.floor(restTime / 2)) {
            speak("Halfway there!");
          }
          if (prev <= 3) {
            speak(prev.toString());
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restIntervalRef.current) window.clearInterval(restIntervalRef.current);
    };
  }, [isResting, restCountdown]);

  const handleStartSet = () => {
    setSetInProgress(true);
    setTimer.start();
    speak(`Start your set. ${currentExercise.name}.`);
  };

  const handleDoneSet = () => {
    setTimer.stop();
    setSetInProgress(false);
    
    if (isLastSet && isLastExercise) {
      speak("Workout complete! Amazing work!");
      onComplete({
        totalTime: totalTimer.time,
        exercisesCompleted: totalExercises
      });
    } else if (isLastSet) {
      speak(`Exercise complete. Rest for ${restTime} seconds.`);
      setIsResting(true);
      setRestCountdown(restTime);
    } else {
      speak(`Set ${currentSet} done. Rest for ${restTime} seconds.`);
      setIsResting(true);
      setRestCountdown(restTime);
    }
    setTimer.reset();
  };

  const handleRestComplete = () => {
    setIsResting(false);
    speak("Next set starts now!");
    
    if (isLastSet) {
      setCurrentExerciseIdx(prev => prev + 1);
      setCurrentSet(1);
      speak(`Moving to ${plan.exercises[currentExerciseIdx + 1]?.name}`);
    } else {
      setCurrentSet(prev => prev + 1);
    }
  };

  const skipRest = () => {
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    handleRestComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          Total: {formatTime(totalTimer.time)}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleVoice}
            className={voiceEnabled ? "text-primary" : "text-muted-foreground"}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <Button variant="destructive" size="sm" onClick={onStop}>
            <Square className="w-4 h-4 mr-1" /> Stop
          </Button>
        </div>
      </div>

      <Progress 
        value={(currentExerciseIdx / totalExercises) * 100} 
        className="h-2 mb-8"
      />

      <AnimatePresence mode="wait">
        {isResting ? (
          <motion.div
            key="rest"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <div className="text-2xl text-muted-foreground mb-4">REST</div>
            <div className="text-8xl font-display font-bold text-primary mb-8">
              {restCountdown}
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              {isLastSet ? `Next: ${plan.exercises[currentExerciseIdx + 1]?.name}` : `Set ${currentSet + 1} coming up`}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setRestTime(60)} className={restTime === 60 ? "border-primary" : ""}>
                60s
              </Button>
              <Button variant="outline" onClick={() => setRestTime(90)} className={restTime === 90 ? "border-primary" : ""}>
                90s
              </Button>
              <Button variant="outline" onClick={() => setRestTime(120)} className={restTime === 120 ? "border-primary" : ""}>
                120s
              </Button>
            </div>
            <Button onClick={skipRest} className="mt-6 bg-primary text-black">
              Skip Rest
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="text-sm text-muted-foreground mb-2">
              Exercise {currentExerciseIdx + 1} of {totalExercises}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {currentExercise.name}
            </h2>
            <div className="text-xl text-primary mb-2">
              Set {currentSet} of {currentExercise.sets}
            </div>
            <div className="text-lg text-muted-foreground mb-8">
              {currentExercise.reps} reps {currentExercise.weight ? `@ ${currentExercise.weight} lbs` : ''}
            </div>

            {setInProgress && (
              <div className="text-6xl font-display font-bold text-primary mb-8">
                {formatTime(setTimer.time)}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              {!setInProgress ? (
                <Button 
                  onClick={handleStartSet}
                  className="px-12 py-6 text-xl bg-primary text-black font-bold hover:bg-primary/90"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Set
                </Button>
              ) : (
                <Button 
                  onClick={handleDoneSet}
                  className="px-12 py-6 text-xl bg-accent text-black font-bold hover:bg-accent/90"
                >
                  <Check className="w-6 h-6 mr-2" />
                  Done
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AbsCardioActive({
  plan,
  voiceEnabled,
  onToggleVoice,
  onComplete,
  onStop
}: {
  plan: WorkoutPlan;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onComplete: (stats: { totalTime: number; exercisesCompleted: number }) => void;
  onStop: () => void;
}) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { speak } = useVoiceCoach(voiceEnabled);
  const totalTimer = useStopwatch();
  const intervalRef = useRef<number | null>(null);

  const currentExercise = plan.exercises[currentExerciseIdx];
  const totalExercises = plan.exercises.length;
  const isLastExercise = currentExerciseIdx >= totalExercises - 1;

  useEffect(() => {
    totalTimer.start();
    speak("Let's start your workout!");
    startExercise();
    
    return () => {
      totalTimer.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startExercise = () => {
    const ex = plan.exercises[currentExerciseIdx];
    speak(`Let's start ${ex.name}`);
    setCountdown(ex.duration || 30);
    setIsResting(false);
    startCountdown(ex.duration || 30, false);
  };

  const getPartnerCountPhrase = (count: number, isResting: boolean): string => {
    if (isResting) {
      if (count === 10) return "10 more seconds, get ready!";
      if (count === 5) return "5 seconds, almost there!";
      if (count === 3) return "3!";
      if (count === 2) return "2!";
      if (count === 1) return "1! Let's go!";
    } else {
      if (count === 10) return "10 seconds, you got this!";
      if (count === 5) return "5 more, push through!";
      if (count === 3) return "3, keep going!";
      if (count === 2) return "2, almost done!";
      if (count === 1) return "1, finish strong!";
    }
    return "";
  };

  const startCountdown = (time: number, isRestPhase: boolean) => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setCountdown(time);
    
    intervalRef.current = window.setInterval(() => {
      setCountdown((prev: number) => {
        if (prev <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          if (isRestPhase) {
            handleNextExercise();
          } else {
            handleExerciseComplete();
          }
          return 0;
        }
        const phrase = getPartnerCountPhrase(prev, isRestPhase);
        if (phrase) speak(phrase);
        return prev - 1;
      });
    }, 1000);
  };

  const handleExerciseComplete = () => {
    if (isLastExercise) {
      speak("Workout complete! You crushed it!");
      totalTimer.stop();
      onComplete({
        totalTime: totalTimer.time,
        exercisesCompleted: totalExercises
      });
    } else {
      const restDuration = currentExercise.restDuration || 15;
      speak(`Rest for ${restDuration} seconds`);
      setIsResting(true);
      startCountdown(restDuration, true);
    }
  };

  const handleNextExercise = () => {
    setCurrentExerciseIdx(prev => prev + 1);
    const nextEx = plan.exercises[currentExerciseIdx + 1];
    if (nextEx) {
      speak(`Let's start ${nextEx.name}`);
      setCountdown(nextEx.duration || 30);
      setIsResting(false);
      startCountdown(nextEx.duration || 30, false);
    }
  };

  const togglePause = () => {
    if (isPaused) {
      startCountdown(countdown, isResting);
      totalTimer.start();
      speak("Resume");
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      totalTimer.stop();
      speak("Paused");
    }
    setIsPaused(!isPaused);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          Total: {formatTime(totalTimer.time)}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleVoice}
            className={voiceEnabled ? "text-primary" : "text-muted-foreground"}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <Progress 
        value={((currentExerciseIdx + (isResting ? 0.5 : 0)) / totalExercises) * 100} 
        className="h-2 mb-8"
      />

      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">
          {isResting ? 'REST' : `Exercise ${currentExerciseIdx + 1} of ${totalExercises}`}
        </div>
        
        {!isResting && currentExercise.gifUrl && (
          <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-primary/30">
            <img 
              src={currentExercise.gifUrl} 
              alt={currentExercise.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
          {isResting ? 'Get Ready...' : currentExercise.name}
        </h2>
        
        {isResting && !isLastExercise && (
          <p className="text-lg text-muted-foreground mb-4">
            Next: {plan.exercises[currentExerciseIdx + 1]?.name}
          </p>
        )}

        <motion.div 
          key={countdown}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "text-8xl md:text-9xl font-display font-bold mb-8",
            isResting ? "text-accent" : "text-primary",
            countdown <= 5 && "text-destructive"
          )}
        >
          {countdown}
        </motion.div>

        <div className="flex gap-4 justify-center">
          <Button 
            onClick={togglePause}
            variant="outline"
            className="px-8 py-4"
          >
            {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button 
            onClick={onStop}
            variant="destructive"
            className="px-8 py-4"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function WorkoutComplete({
  stats,
  mode,
  onRestart,
  onBack
}: {
  stats: { totalTime: number; exercisesCompleted: number };
  mode: WorkoutMode;
  onRestart: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 0.5 }}
        className="text-8xl mb-8"
      >
        🎉
      </motion.div>
      
      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
        Workout <span className="text-primary">Complete!</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-8 my-8">
        <div className="text-center">
          <div className="text-4xl font-display font-bold text-primary mb-2">
            {formatTime(stats.totalTime)}
          </div>
          <div className="text-sm text-muted-foreground">Total Time</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-display font-bold text-accent mb-2">
            {stats.exercisesCompleted}
          </div>
          <div className="text-sm text-muted-foreground">Exercises</div>
        </div>
      </div>

      <p className="text-lg text-muted-foreground mb-8">
        Amazing work! You've earned your rest.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Plans
        </Button>
        <Button onClick={onRestart} className="bg-primary text-black">
          <RotateCcw className="w-5 h-5 mr-2" />
          Workout Again
        </Button>
      </div>
    </motion.div>
  );
}

function CustomWorkoutBuilder({
  onSave,
  onBack
}: {
  onSave: (plan: WorkoutPlan) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkoutMode>('weight');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 30,
    restDuration: 15
  });

  const addExercise = () => {
    if (!newExercise.name.trim()) return;
    
    const ex: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      sets: type === 'weight' ? newExercise.sets : 1,
      reps: type === 'weight' ? newExercise.reps : 1,
      weight: type === 'weight' ? newExercise.weight : undefined,
      duration: type === 'abs-cardio' ? newExercise.duration : undefined,
      restDuration: type === 'abs-cardio' ? newExercise.restDuration : undefined,
    };
    
    setExercises(prev => [...prev, ex]);
    setNewExercise({
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 30,
      restDuration: 15
    });
  };

  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return;
    
    const plan: WorkoutPlan = {
      id: `custom-${Date.now()}`,
      name,
      type,
      exercises,
      isCustom: true,
      totalDuration: type === 'abs-cardio' 
        ? `${Math.ceil(exercises.reduce((acc, ex) => acc + (ex.duration || 30) + (ex.restDuration || 15), 0) / 60)} min`
        : undefined
    };
    
    onSave(plan);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto px-4"
    >
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-display font-bold text-white">
          Create <span className="text-primary">Custom Workout</span>
        </h2>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Workout Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Workout"
              className="bg-white/5 border-white/10"
            />
          </div>
          <Button 
            onClick={() => setStep(2)} 
            disabled={!name.trim()}
            className="w-full bg-primary text-black"
          >
            Next <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <p className="text-muted-foreground">Choose workout type:</p>
          <div className="flex gap-4">
            <Button
              variant={type === 'weight' ? 'default' : 'outline'}
              onClick={() => setType('weight')}
              className="flex-1 py-6"
            >
              <Dumbbell className="w-5 h-5 mr-2" />
              Weight Training
            </Button>
            <Button
              variant={type === 'abs-cardio' ? 'default' : 'outline'}
              onClick={() => setType('abs-cardio')}
              className="flex-1 py-6"
            >
              <Flame className="w-5 h-5 mr-2" />
              Abs / Cardio
            </Button>
          </div>
          <Button 
            onClick={() => setStep(3)}
            className="w-full bg-primary text-black"
          >
            Next <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-3">
            {exercises.map((ex, idx) => (
              <Card key={ex.id} className="p-4 bg-card border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-primary font-bold mr-3">{idx + 1}.</span>
                  <span className="text-white">{ex.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  {type === 'weight' ? (
                    <span className="text-sm text-muted-foreground">
                      {ex.sets} x {ex.reps} {ex.weight ? `@ ${ex.weight}lbs` : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {ex.duration}s / {ex.restDuration}s rest
                    </span>
                  )}
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => setExercises(prev => prev.filter(e => e.id !== ex.id))}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-card border-white/10 space-y-4">
            <Input
              value={newExercise.name}
              onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Exercise name"
              className="bg-white/5 border-white/10"
            />
            
            {type === 'weight' ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Sets</label>
                  <Input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Reps</label>
                  <Input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, reps: parseInt(e.target.value) || 1 }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Weight (lbs)</label>
                  <Input
                    type="number"
                    value={newExercise.weight || ''}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Duration (sec)</label>
                  <Input
                    type="number"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Rest (sec)</label>
                  <Input
                    type="number"
                    value={newExercise.restDuration}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, restDuration: parseInt(e.target.value) || 15 }))}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
            )}

            <Button onClick={addExercise} className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Add Exercise
            </Button>
          </Card>

          <Button 
            onClick={handleSave}
            disabled={exercises.length === 0}
            className="w-full py-6 bg-primary text-black font-bold"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Workout
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default function WorkoutPartnerPage() {
  const [step, setStep] = useState<AppStep>('landing');
  const [mode, setMode] = useState<WorkoutMode>('weight');
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [customPlans, setCustomPlans] = useState<WorkoutPlan[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [workoutStats, setWorkoutStats] = useState({ totalTime: 0, exercisesCompleted: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('customWorkoutPlans');
    if (saved) {
      setCustomPlans(JSON.parse(saved));
    }
  }, []);

  const saveCustomPlan = (plan: WorkoutPlan) => {
    const updated = [...customPlans, plan];
    setCustomPlans(updated);
    localStorage.setItem('customWorkoutPlans', JSON.stringify(updated));
    setStep('plan-select');
  };

  const handleModeSelect = (selectedMode: WorkoutMode) => {
    setMode(selectedMode);
    setStep('plan-select');
  };

  const handlePlanSelect = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    if (mode === 'weight') {
      setStep('edit-workout');
    } else {
      setStep('edit-workout');
    }
  };

  const handleStartWorkout = () => {
    setStep('workout-active');
  };

  const handleWorkoutComplete = (stats: { totalTime: number; exercisesCompleted: number }) => {
    setWorkoutStats(stats);
    setStep('workout-complete');
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)]">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <LandingScreen onStart={() => setStep('mode-select')} />
          )}

          {step === 'mode-select' && (
            <ModeSelection onSelect={handleModeSelect} />
          )}

          {step === 'plan-select' && (
            <PlanSelection 
              mode={mode}
              customPlans={customPlans}
              onSelectPlan={handlePlanSelect}
              onBack={() => setStep('mode-select')}
              onCreateCustom={() => setStep('custom-builder')}
            />
          )}

          {step === 'edit-workout' && selectedPlan && (
            <ExerciseEditor
              plan={selectedPlan}
              onSave={setSelectedPlan}
              onBack={() => setStep('plan-select')}
              onStart={handleStartWorkout}
            />
          )}

          {step === 'workout-active' && selectedPlan && (
            mode === 'weight' ? (
              <WeightWorkoutActive
                plan={selectedPlan}
                voiceEnabled={voiceEnabled}
                onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
                onComplete={handleWorkoutComplete}
                onStop={() => setStep('plan-select')}
              />
            ) : (
              <AbsCardioActive
                plan={selectedPlan}
                voiceEnabled={voiceEnabled}
                onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
                onComplete={handleWorkoutComplete}
                onStop={() => setStep('plan-select')}
              />
            )
          )}

          {step === 'workout-complete' && (
            <WorkoutComplete
              stats={workoutStats}
              mode={mode}
              onRestart={handleStartWorkout}
              onBack={() => setStep('plan-select')}
            />
          )}

          {step === 'custom-builder' && (
            <CustomWorkoutBuilder
              onSave={saveCustomPlan}
              onBack={() => setStep('plan-select')}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
