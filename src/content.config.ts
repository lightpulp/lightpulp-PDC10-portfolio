import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    subtitle: z.string(),
    summary: z.string(),
    /** The one thing this case study proves. Shown as a pull quote. */
    finding: z.string(),
    role: z.string(),
    status: z.string(),
    stack: z.array(z.string()),
    techniques: z.array(z.string()),
    outcomes: z.array(z.enum(['clo1', 'clo2', 'clo3', 'clo4'])),
    sources: z.array(z.object({ title: z.string(), url: z.string() })),
  }),
});

export const collections = { work };
