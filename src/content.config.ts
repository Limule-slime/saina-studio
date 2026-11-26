import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const block = z.object({ name: z.string(), description: z.string() });

const kits = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/kits' }),
	schema: z.object({
		name: z.string(),
		summary: z.string(),
		status: z.enum(['available', 'upcoming']),
		order: z.number(),
		version: z.string().optional(),
		facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
		demoUrl: z.string().optional(),
		freeUrl: z.string().optional(),
		/** Hero of the kit page */
		title: z.string().optional(),
		titleAccent: z.string().optional(),
		intro: z.string().optional(),
		badge: z.string().optional(),
		meta: z.array(z.string()).default([]),
		/** Demo preview, rendered as live text rather than a screenshot */
		preview: z
			.object({
				brand: z.string(),
				headline: z.string(),
				text: z.string(),
				cta: z.string(),
				caption: z.string(),
				links: z.array(z.string()),
			})
			.optional(),
		figures: z.array(z.object({ value: z.string(), text: z.string() })).default([]),
		checks: z.array(z.object({ name: z.string(), text: z.string(), tag: z.string() })).default([]),
		freeBlocks: z.array(block).default([]),
		proBlocks: z.array(block).default([]),
		plans: z
			.array(
				z.object({
					name: z.string(),
					annual: z.number(),
					lifetime: z.number().optional(),
					licenses: z.union([z.number(), z.literal('unlimited')]).optional(),
					text: z.string(),
					features: z.array(z.string()),
					featured: z.boolean().default(false),
				}),
			)
			.default([]),
		faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
	}),
});

export const collections = { kits };
