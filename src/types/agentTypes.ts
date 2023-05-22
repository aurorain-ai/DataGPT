import { z } from "zod";

export const messageParser = z.object({
  type: z.enum(["goal", "thinking", "sql", "sqltable", "task", "action", "system"]),
  info: z.string().optional(),
  value: z.string(),
  table: z.any().optional(),
});

export type Message = z.infer<typeof messageParser>;
