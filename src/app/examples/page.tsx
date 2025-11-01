'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  format,
  formatDistance,
  formatRelative,
  differenceInDays,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { useTest } from '@/hooks/useUserData'
import { getMe } from '@/services/userService'
import styles from './page.module.scss'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

// Пример данных для графиков
const lineChartData = [
  { name: 'Пн', value: 400 },
  { name: 'Вт', value: 300 },
  { name: 'Ср', value: 200 },
  { name: 'Чт', value: 278 },
  { name: 'Пт', value: 189 },
  { name: 'Сб', value: 239 },
  { name: 'Вс', value: 349 },
]

const barChartData = [
  { name: 'Январь', value: 400 },
  { name: 'Февраль', value: 300 },
  { name: 'Март', value: 200 },
  { name: 'Апрель', value: 278 },
  { name: 'Май', value: 189 },
]

const pieChartData = [
  { name: 'Группа A', value: 400 },
  { name: 'Группа B', value: 300 },
  { name: 'Группа C', value: 300 },
  { name: 'Группа D', value: 200 },
]

export default function ExamplesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Пример использования TanStack Query
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', 'examples'],
    queryFn: getMe,
    retry: false, // Не ретраить если не авторизован
    enabled: false, // Отключаем автоматический запрос (пример использования)
  })
  
  const { data: testData, isLoading: testLoading } = useTest()
  // Примеры работы с датами
  const dateExamples = {
    formatted: format(selectedDate, 'dd.MM.yyyy', { locale: ru }),
    long: format(selectedDate, 'd MMMM yyyy', { locale: ru }),
    relative: formatRelative(selectedDate, new Date(), { locale: ru }),
    distance: formatDistance(selectedDate, new Date(), { locale: ru, addSuffix: true }),
    daysDiff: differenceInDays(new Date(), selectedDate),
    nextWeek: format(addDays(selectedDate, 7), 'dd.MM.yyyy', { locale: ru }),
    weekStart: format(startOfWeek(selectedDate, { locale: ru }), 'dd.MM.yyyy', { locale: ru }),
    weekEnd: format(endOfWeek(selectedDate, { locale: ru }), 'dd.MM.yyyy', { locale: ru }),
    weekDays: eachDayOfInterval({
      start: startOfWeek(selectedDate, { locale: ru }),
      end: endOfWeek(selectedDate, { locale: ru }),
    }).map((date) => format(date, 'EEEE dd.MM', { locale: ru })),
  }

  return (
    <div className={styles.examples}>
      <div className={styles.container}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Примеры использования инструментов
        </motion.h1>

        {/* Framer Motion - Анимации */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>Framer Motion - Анимации</h2>
          <div className={styles.animationGrid}>
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={styles.animatedBox}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: i * 0.1,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                Блок {i}
              </motion.div>
            ))}
          </div>

          <motion.button
            className={styles.animatedButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Наведите на меня
          </motion.button>
        </motion.section>

        {/* Recharts - Графики */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>Recharts - Графики</h2>
          <div className={styles.chartsGrid}>
            <div className={styles.chart}>
              <h3>Линейный график</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chart}>
              <h3>Столбчатая диаграмма</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chart}>
              <h3>Круговая диаграмма</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.section>

        {/* TanStack Query - Пример */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <h2 className={styles.sectionTitle}>TanStack Query - Server State</h2>
          <div className={styles.dateSection}>
            <div className={styles.dateItem}>
              <strong>Query настроен:</strong> QueryClient и QueryProvider используются в приложении
            </div>
            <div className={styles.dateItem}>
              <strong>React Query Devtools:</strong> Доступны в режиме разработки (правый нижний угол)
            </div>
            <div className={styles.dateItem}>
              <strong>Пример использования:</strong> Хук useUserData создан в src/hooks/useUserData.ts
            </div>
            <div className={styles.dateItem}>
              <strong>Статус запроса:</strong> {userLoading ? 'Загрузка...' : 'Готов к использованию'}
            </div>
          </div>
        </motion.section>

        {/* date-fns - Работа с датами */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className={styles.sectionTitle}>date-fns - Работа с датами</h2>
          <div className={styles.dateSection}>
            <label className={styles.dateLabel}>
              Выберите дату:
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className={styles.dateInput}
              />
            </label>

            <motion.div
              className={styles.dateExamples}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.dateItem}>
                <strong>Форматированная дата:</strong> {dateExamples.formatted}
              </div>
              <div className={styles.dateItem}>
                <strong>Длинный формат:</strong> {dateExamples.long}
              </div>
              <div className={styles.dateItem}>
                <strong>Относительное время:</strong> {dateExamples.relative}
              </div>
              <div className={styles.dateItem}>
                <strong>Расстояние во времени:</strong> {dateExamples.distance}
              </div>
              <div className={styles.dateItem}>
                <strong>Разница в днях:</strong> {dateExamples.daysDiff} дней
              </div>
              <div className={styles.dateItem}>
                <strong>Через неделю:</strong> {dateExamples.nextWeek}
              </div>
              <div className={styles.dateItem}>
                <strong>Начало недели:</strong> {dateExamples.weekStart}
              </div>
              <div className={styles.dateItem}>
                <strong>Конец недели:</strong> {dateExamples.weekEnd}
              </div>
              <div className={styles.dateItem}>
                <strong>Дни недели:</strong>
                <ul>
                  {dateExamples.weekDays.map((day, i) => (
                    <li key={i}>{day}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

