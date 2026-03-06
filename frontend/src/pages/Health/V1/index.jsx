/**
 * Health V1 Modules - Index
 * Экспорт всех страниц Health Modules V1
 */

// Nutrition Module (Питание)
export { default as NutritionV1 } from './NutritionV1';
export { default as FoodDiaryV1 } from './FoodDiaryV1';
export { default as MealPlannerV1 } from './MealPlannerV1';
export { default as RecipesV1 } from './RecipesV1';
export { default as ProductsDBV1 } from './ProductsDBV1';

// Fitness Module (Фитнес)
export { default as FitnessV1 } from './FitnessV1';
export { default as WorkoutLoggerV1 } from './WorkoutLoggerV1';
export { default as ExerciseLibraryV1 } from './ExerciseLibraryV1';

// Sleep Module (Сон)
export { default as SleepV1 } from './SleepV1';
export { default as SleepAnalysisV1 } from './SleepAnalysisV1';

// Mental Health Module (Психология)
export { default as MentalHealthV1 } from './MentalHealthV1';
export { default as MoodTrackerV1 } from './MoodTrackerV1';

// Medical Module (Медицина)
export { default as MedicalV1 } from './MedicalV1';
export { default as MedicationsV1 } from './MedicationsV1';

/**
 * Route Configuration Helper
 * Use this to generate routes programmatically
 */
export const healthV1Routes = [
  // Nutrition
  { path: '/health/nutrition-v1', component: NutritionV1, name: 'Питание - Главная' },
  { path: '/health/nutrition/diary-v1', component: FoodDiaryV1, name: 'Дневник питания' },
  { path: '/health/nutrition/meal-plan-v1', component: MealPlannerV1, name: 'Планировщик' },
  { path: '/health/nutrition/recipes-v1', component: RecipesV1, name: 'Рецепты' },
  { path: '/health/nutrition/products-v1', component: ProductsDBV1, name: 'База продуктов' },
  
  // Fitness
  { path: '/health/fitness-v1', component: FitnessV1, name: 'Фитнес - Главная' },
  { path: '/health/fitness/workout-v1', component: WorkoutLoggerV1, name: 'Тренировка' },
  { path: '/health/fitness/exercises-v1', component: ExerciseLibraryV1, name: 'Упражнения' },
  
  // Sleep
  { path: '/health/sleep-v1', component: SleepV1, name: 'Сон - Главная' },
  { path: '/health/sleep/analysis-v1', component: SleepAnalysisV1, name: 'Анализ сна' },
  
  // Mental Health
  { path: '/health/mental-v1', component: MentalHealthV1, name: 'Ментальное здоровье' },
  { path: '/health/mental/mood-v1', component: MoodTrackerV1, name: 'Трекер настроения' },
  
  // Medical
  { path: '/health/medical-v1', component: MedicalV1, name: 'Медицина - Главная' },
  { path: '/health/medical/meds-v1', component: MedicationsV1, name: 'Лекарства' },
];

/**
 * Navigation Links Helper
 * Use this for generating navigation menus
 */
export const healthV1Navigation = {
  nutrition: [
    { path: '/health/nutrition-v1', label: 'Обзор', icon: '🥗' },
    { path: '/health/nutrition/diary-v1', label: 'Дневник', icon: '📝' },
    { path: '/health/nutrition/meal-plan-v1', label: 'План', icon: '📅' },
    { path: '/health/nutrition/recipes-v1', label: 'Рецепты', icon: '👨‍🍳' },
    { path: '/health/nutrition/products-v1', label: 'Продукты', icon: '🛒' },
  ],
  fitness: [
    { path: '/health/fitness-v1', label: 'Обзор', icon: '💪' },
    { path: '/health/fitness/workout-v1', label: 'Тренировка', icon: '🏋️' },
    { path: '/health/fitness/exercises-v1', label: 'Упражнения', icon: '📚' },
  ],
  sleep: [
    { path: '/health/sleep-v1', label: 'Обзор', icon: '😴' },
    { path: '/health/sleep/analysis-v1', label: 'Анализ', icon: '📊' },
  ],
  mental: [
    { path: '/health/mental-v1', label: 'Обзор', icon: '🧠' },
    { path: '/health/mental/mood-v1', label: 'Трекер', icon: '📈' },
  ],
  medical: [
    { path: '/health/medical-v1', label: 'Обзор', icon: '🏥' },
    { path: '/health/medical/meds-v1', label: 'Лекарства', icon: '💊' },
  ],
};

export default {
  routes: healthV1Routes,
  navigation: healthV1Navigation,
};
