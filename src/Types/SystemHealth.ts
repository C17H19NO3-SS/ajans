// src/types/System.ts
export type SystemHealth = {
  status: "ok" | "degraded" | "down";
  time: string; // ISO
};

export type SystemInfo = {
  version?: string;
  uptimeSec?: number;
  env?: string;
};
