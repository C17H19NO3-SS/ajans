import prisma from "@/lib/prisma";

export interface WhitelistRecord {
  id: string;
  ip: string | null;
  note: string | null;
}
export interface CheckResult {
  allowed: boolean;
  ip: string | null;
}

export class AdminAccessService {
  static async check(request: Request): Promise<CheckResult> {
    if (!request.headers.get("cf-connecting-ip"))
      return { allowed: false, ip: null };

    const whitelist = await prisma.adminWhitelist.findMany({
      select: { id: true, ip: true, note: true },
    });

    const record =
      whitelist.find((w) => w.ip === request.headers.get("cf-connecting-ip")) ??
      null;

    return {
      allowed: Boolean(record),
      ip: request.headers.get("cf-connecting-ip"),
    };
  }
}
