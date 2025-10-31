"use client";

import { useQuery } from '@tanstack/react-query';
import { SimpleForm } from '@/components/forms/SimpleForm';
import { motion } from 'framer-motion';

export default function ExamplePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['ping'],
    queryFn: async () => {
      const res = await fetch('/api/ping');
      return (await res.json()) as { ok: boolean; time: string };
    },
  });

  return (
    <div style={{ display: 'grid', gap: 24, padding: 24 }}>
      <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Страница примера</motion.h2>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
        <div style={{ padding: 16, border: '1px solid #e5e5e5', borderRadius: 8 }}>
          <strong>React Query:</strong>{' '}
          {isLoading ? 'Загрузка…' : `OK: ${data?.ok ? 'да' : 'нет'}, time: ${data?.time ?? '-'}`}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <strong>RHF + Zod:</strong>
        <div style={{ marginTop: 12 }}>
          <SimpleForm />
        </div>
      </motion.div>
    </div>
  );
}


