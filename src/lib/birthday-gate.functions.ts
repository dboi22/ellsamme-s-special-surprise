import { createHash, timingSafeEqual } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type BirthdaySession = { unlocked?: boolean };

const DEFAULT_SITE_PASSWORD = "1810";
const DEFAULT_SESSION_SECRET = "ellsamme-special-birthday-secret-key-32-chars-long";

function matches(input: string, expected: string) {
  const left = createHash("sha256").update(input, "utf8").digest();
  const right = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(left, right);
}

export const getBirthdayAccess = createServerFn({ method: "GET" }).handler(async () => {
  const secret = process.env['SESSION_SECRET'] || DEFAULT_SESSION_SECRET;
  if (!secret) return { unlocked: false };
  const session = await useSession<BirthdaySession>({
    password: secret,
    name: "ellsamme-birthday",
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === "production",
      sameSite: "lax",
      path: "/",
    },
  });
  return { unlocked: session.data.unlocked === true };
});

export const unlockBirthday = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ code: z.string().regex(/^\d{4}$/) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env['SITE_PASSWORD'] || DEFAULT_SITE_PASSWORD;
    const secret = process.env['SESSION_SECRET'] || DEFAULT_SESSION_SECRET;
    if (!expected || !secret || !matches(data.code, expected)) return { ok: false as const };
    const session = await useSession<BirthdaySession>({
      password: secret,
      name: "ellsamme-birthday",
      maxAge: 60 * 60 * 24 * 7,
      cookie: {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === "production",
        sameSite: "lax",
        path: "/",
      },
    });
    await session.update({ unlocked: true });
    return { ok: true as const };
  });