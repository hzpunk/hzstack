"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email('Введите корректный email'),
  name: z.string().min(2, 'Минимум 2 символа'),
});

type FormValues = z.infer<typeof formSchema>;

export function SimpleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (values: FormValues) => {
    // Demo: pretend submit
    await new Promise((r) => setTimeout(r, 400));
    alert(`Отправлено: ${JSON.stringify(values)}`);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 420 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Email
          <input type="email" placeholder="you@example.com" {...register('email')} />
        </label>
        {errors.email && <span style={{ color: 'crimson' }}>{errors.email.message}</span>}

        <label>
          Имя
          <input type="text" placeholder="Иван" {...register('name')} />
        </label>
        {errors.name && <span style={{ color: 'crimson' }}>{errors.name.message}</span>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка…' : 'Отправить'}
        </button>
      </div>
    </form>
  );
}


