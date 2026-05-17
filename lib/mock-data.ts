export const mockUsers: any[] = []

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
