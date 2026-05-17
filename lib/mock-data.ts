// Mock data for GymFlow app
export const mockUsers = [
  { id: '1', name: 'Lucas Silva', avatar: '/avatars/1.jpg', streak: 12, weeklyWorkouts: 5, fires: 48, plan: 'Premium', dueDate: '2026-06-15', lastWorkout: '2026-05-16', status: 'ativo' as const, weight: 82, height: 178, goal: 'Hipertrofia', position: 1, monthlyFee: 149.90, paymentStatus: 'pago' as const },
  { id: '2', name: 'Ana Oliveira', avatar: '/avatars/2.jpg', streak: 8, weeklyWorkouts: 4, fires: 35, plan: 'Basico', dueDate: '2026-05-20', lastWorkout: '2026-05-15', status: 'ativo' as const, weight: 62, height: 165, goal: 'Emagrecimento', position: 2, monthlyFee: 99.90, paymentStatus: 'pago' as const },
  { id: '3', name: 'Pedro Santos', avatar: '/avatars/3.jpg', streak: 15, weeklyWorkouts: 6, fires: 62, plan: 'Premium', dueDate: '2026-07-01', lastWorkout: '2026-05-16', status: 'ativo' as const, weight: 90, height: 185, goal: 'Hipertrofia', position: 3, monthlyFee: 149.90, paymentStatus: 'pago' as const },
  { id: '4', name: 'Maria Costa', avatar: '/avatars/4.jpg', streak: 3, weeklyWorkouts: 3, fires: 18, plan: 'Basico', dueDate: '2026-05-10', lastWorkout: '2026-05-14', status: 'ativo' as const, weight: 58, height: 160, goal: 'Condicionamento', position: 4, monthlyFee: 99.90, paymentStatus: 'pendente' as const },
  { id: '5', name: 'Rafael Mendes', avatar: '/avatars/5.jpg', streak: 0, weeklyWorkouts: 0, fires: 5, plan: 'Premium', dueDate: '2026-04-30', lastWorkout: '2026-05-02', status: 'inativo' as const, weight: 95, height: 180, goal: 'Hipertrofia', position: 8, monthlyFee: 149.90, paymentStatus: 'atrasado' as const },
  { id: '6', name: 'Julia Ferreira', avatar: '/avatars/6.jpg', streak: 6, weeklyWorkouts: 4, fires: 29, plan: 'Premium', dueDate: '2026-06-20', lastWorkout: '2026-05-16', status: 'ativo' as const, weight: 65, height: 170, goal: 'Hipertrofia', position: 5, monthlyFee: 149.90, paymentStatus: 'pago' as const },
  { id: '7', name: 'Carlos Rocha', avatar: '/avatars/7.jpg', streak: 0, weeklyWorkouts: 0, fires: 2, plan: 'Basico', dueDate: '2026-04-15', lastWorkout: '2026-04-28', status: 'inativo' as const, weight: 78, height: 175, goal: 'Emagrecimento', position: 12, monthlyFee: 99.90, paymentStatus: 'atrasado' as const },
  { id: '8', name: 'Fernanda Lima', avatar: '/avatars/8.jpg', streak: 20, weeklyWorkouts: 5, fires: 55, plan: 'Premium', dueDate: '2026-08-01', lastWorkout: '2026-05-16', status: 'ativo' as const, weight: 57, height: 162, goal: 'Condicionamento', position: 6, monthlyFee: 149.90, paymentStatus: 'pago' as const },
  { id: '9', name: 'Thiago Alves', avatar: '/avatars/9.jpg', streak: 0, weeklyWorkouts: 1, fires: 8, plan: 'Basico', dueDate: '2026-05-05', lastWorkout: '2026-05-08', status: 'inativo' as const, weight: 88, height: 182, goal: 'Hipertrofia', position: 15, monthlyFee: 99.90, paymentStatus: 'atrasado' as const },
  { id: '10', name: 'Camila Nunes', avatar: '/avatars/10.jpg', streak: 4, weeklyWorkouts: 3, fires: 22, plan: 'Premium', dueDate: '2026-06-10', lastWorkout: '2026-05-15', status: 'ativo' as const, weight: 60, height: 168, goal: 'Emagrecimento', position: 7, monthlyFee: 149.90, paymentStatus: 'pago' as const },
]

export const mockExercises = [
  { id: '1', name: 'Supino Reto', muscle: 'Peito', sets: 4, reps: '8-12', pr: 85 },
  { id: '2', name: 'Supino Inclinado', muscle: 'Peito', sets: 4, reps: '10-12', pr: 70 },
  { id: '3', name: 'Crucifixo', muscle: 'Peito', sets: 3, reps: '12-15', pr: 22 },
  { id: '4', name: 'Crossover', muscle: 'Peito', sets: 3, reps: '12-15', pr: 30 },
  { id: '5', name: 'Agachamento', muscle: 'Perna', sets: 4, reps: '8-10', pr: 120 },
  { id: '6', name: 'Leg Press', muscle: 'Perna', sets: 4, reps: '10-12', pr: 250 },
  { id: '7', name: 'Puxada Frontal', muscle: 'Costas', sets: 4, reps: '10-12', pr: 80 },
  { id: '8', name: 'Remada Curvada', muscle: 'Costas', sets: 4, reps: '8-10', pr: 70 },
  { id: '9', name: 'Desenvolvimento', muscle: 'Ombro', sets: 4, reps: '10-12', pr: 40 },
  { id: '10', name: 'Rosca Direta', muscle: 'Biceps', sets: 3, reps: '10-12', pr: 30 },
  { id: '11', name: 'Abdominal Supra', muscle: 'Abdomen', sets: 3, reps: '15-20', pr: 0 },
  { id: '12', name: 'Prancha', muscle: 'Abdomen', sets: 3, reps: '30-60s', pr: 0 },
  { id: '13', name: 'Abdominal Infra', muscle: 'Abdomen', sets: 3, reps: '15-20', pr: 0 },
  { id: '14', name: 'Obliquo', muscle: 'Abdomen', sets: 3, reps: '15-20', pr: 0 },
  { id: '15', name: 'Abdominal Bicicleta', muscle: 'Abdomen', sets: 3, reps: '20-30', pr: 0 },
  { id: '16', name: 'Elevacao de Pernas', muscle: 'Fullbody', sets: 3, reps: '12-15', pr: 0 },
  { id: '17', name: 'Burpee', muscle: 'Fullbody', sets: 3, reps: '10-15', pr: 0 },
  { id: '18', name: 'Desenvolvimento Halter', muscle: 'Ombro', sets: 4, reps: '10-12', pr: 30 },
  { id: '19', name: 'Elevacao Lateral', muscle: 'Ombro', sets: 3, reps: '12-15', pr: 12 },
  { id: '20', name: 'Rosca Martelo', muscle: 'Biceps', sets: 3, reps: '10-12', pr: 20 },
  { id: '21', name: 'Triceps Corda', muscle: 'Triceps', sets: 3, reps: '12-15', pr: 25 },
  { id: '22', name: 'Triceps Testa', muscle: 'Triceps', sets: 3, reps: '10-12', pr: 20 },
]

export const mockFeedPosts = [
  { id: '1', userId: '3', type: 'photo' as const, image: '/feed/1.jpg', fires: 24, comments: 5, createdAt: '2026-05-16T10:30:00' },
  { id: '2', userId: '1', type: 'achievement' as const, text: 'Lucas bateu PR — Supino 85kg', fires: 48, comments: 12, createdAt: '2026-05-16T09:15:00' },
  { id: '3', userId: '6', type: 'photo' as const, image: '/feed/2.jpg', fires: 18, comments: 3, createdAt: '2026-05-15T18:00:00' },
  { id: '4', userId: '8', type: 'achievement' as const, text: 'Fernanda treinou 5x essa semana', fires: 35, comments: 8, createdAt: '2026-05-15T15:30:00' },
  { id: '5', userId: '2', type: 'photo' as const, image: '/feed/3.jpg', fires: 15, comments: 2, createdAt: '2026-05-15T12:00:00' },
]

export const mockWeeklyFrequency = [
  { day: 'Seg', count: 45 },
  { day: 'Ter', count: 52 },
  { day: 'Qua', count: 48 },
  { day: 'Qui', count: 55 },
  { day: 'Sex', count: 60 },
  { day: 'Sab', count: 35 },
  { day: 'Dom', count: 15 },
]

export const mockProgressionData = [
  { week: 'Sem 1', weight: 60 },
  { week: 'Sem 2', weight: 62.5 },
  { week: 'Sem 3', weight: 62.5 },
  { week: 'Sem 4', weight: 65 },
  { week: 'Sem 5', weight: 67.5 },
  { week: 'Sem 6', weight: 70 },
  { week: 'Sem 7', weight: 70 },
  { week: 'Sem 8', weight: 75 },
]

export const mockMonthlyRevenue = [
  { month: 'Dez', revenue: 12500 },
  { month: 'Jan', revenue: 15800 },
  { month: 'Fev', revenue: 14200 },
  { month: 'Mar', revenue: 16500 },
  { month: 'Abr', revenue: 17800 },
  { month: 'Mai', revenue: 18200 },
]

export const muscleGroups = [
  'Peito',
  'Costas',
  'Perna',
  'Ombro',
  'Biceps',
  'Triceps',
  'Abdomen',
  'Fullbody',
  'Peito + Triceps',
  'Costas + Biceps',
  'Perna + Ombro',
] as const

export const weekDays = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terca' },
  { key: 'qua', label: 'Quarta' },
  { key: 'qui', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
  { key: 'sab', label: 'Sabado' },
  { key: 'dom', label: 'Domingo' },
] as const
