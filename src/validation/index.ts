import { z } from "zod";

export const localeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Locale code must be at least 2 characters")
  .max(5, "Locale code must be 5 characters or less");

const isoDateString = z
  .string()
  .refine(
    (value) => value.length === 0 || !Number.isNaN(Date.parse(value)),
    "Invalid ISO date string"
  )
  .optional();

export const productOptionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  type: z.enum(["addon", "subscription"]),
  isRequired: z.boolean(),
  isRecurring: z.boolean(),
  priceAmount: z.number(),
  priceLabel: z.string().nullable().optional(),
  currency: z.string().min(1),
  billingPeriod: z.string().min(1).nullable().optional(),
});

export const productSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  href: z.string().nullable().optional(),
  categoryId: z.string().min(1),
  categoryTitle: z.string().nullable().optional(),
  price: z.string().nullable().optional(),
  created_at: isoDateString,
  updated_at: isoDateString,
  options: z.array(productOptionSchema).optional(),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  created_at: isoDateString,
  updated_at: isoDateString,
});

export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().nonnegative(),
    pageSize: z.number().int().positive(),
  });

export const productsResponseSchema = paginatedSchema(productSchema);
export const categoriesResponseSchema = paginatedSchema(categorySchema);
export const productDetailResponseSchema = productSchema;

export const authUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  username: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  company: z.string().nullable(),
  phone: z.string().nullable(),
  position: z.string().nullable(),
  createdAt: z.string(),
});

export const authSuccessSchema = z.object({
  ok: z.literal(true),
  token: z.string().min(10),
  user: authUserSchema,
  expiresAt: z.string().optional(),
});

export const authMeResponseSchema = z.object({
  user: authUserSchema,
  expiresAt: z.string().optional(),
});

export const authErrorSchema = z.object({
  ok: z.literal(false),
  error: z.string().min(1),
});

const trimmedLowerEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email("Gecerli bir e-posta adresi girin");

const loginIdentifier = z
  .string()
  .trim()
  .min(3, "Kullanici adi veya e-posta gerekli");

const optionalField = (
  label: string,
  { min = 2, max = 120 }: { min?: number; max?: number } = {}
) =>
  z
    .string()
    .transform((value) => value.trim())
    .refine(
      (value) => value.length === 0 || value.length >= min,
      `${label} en az ${min} karakter olmali`
    )
    .refine(
      (value) => value.length === 0 || value.length <= max,
      `${label} en fazla ${max} karakter olabilir`
    )
    .transform((value) => (value.length === 0 ? undefined : value));

const nullableField = (
  label: string,
  { min = 2, max = 120 }: { min?: number; max?: number } = {}
) =>
  z
    .string()
    .transform((value) => value.trim())
    .refine(
      (value) => value.length === 0 || value.length >= min,
      `${label} en az ${min} karakter olmali`
    )
    .refine(
      (value) => value.length === 0 || value.length <= max,
      `${label} en fazla ${max} karakter olabilir`
    )
    .transform((value) => (value.length === 0 ? null : value));

const optionalUsername = optionalField("Kullanici adi", {
  min: 3,
  max: 32,
}).refine(
  (value) =>
    value === undefined || /^[a-z0-9_.-]+$/.test(value.toLowerCase()),
  "Kullanici adi harf, rakam ve ._- karakterlerini icerebilir"
);

const optionalPhone = optionalField("Telefon", { min: 6, max: 24 }).refine(
  (value) =>
    value === undefined ||
    /^[0-9+()\-\s]+$/.test(value),
  "Telefon numarasi sadece rakam, +, -, () ve bosluk icerebilir"
);

export const loginFormSchema = z.object({
  identifier: loginIdentifier,
  password: z.string().min(6, "Parola en az 6 karakter olmali"),
  remember: z.boolean().optional(),
});

export const registerFormSchema = z
  .object({
    firstName: optionalField("Ad", { min: 2, max: 60 }),
    lastName: optionalField("Soyad", { min: 2, max: 60 }),
    username: optionalUsername,
    company: optionalField("Sirket", { min: 2, max: 120 }),
    phone: optionalPhone,
    position: optionalField("Pozisyon", { min: 2, max: 120 }),
    email: trimmedLowerEmail,
    password: z.string().min(6, "Parola en az 6 karakter olmali"),
    passwordConfirm: z.string().min(6, "Parola tekrarini girin"),
    terms: z
      .boolean()
      .refine((value) => value === true, "Kosul ve politikalari kabul etmelisiniz"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        code: z.ZodIssueCode.custom,
        message: "Parolalar eslesmiyor",
      });
    }
  });

export const profileUpdateSchema = z.object({
  firstName: nullableField("Ad", { min: 2, max: 60 }).optional(),
  lastName: nullableField("Soyad", { min: 2, max: 60 }).optional(),
  username: nullableField("Kullanici adi", { min: 3, max: 32 })
    .refine(
      (value) =>
        value === null ||
        /^[a-z0-9_.-]+$/.test(value.toLowerCase()),
      "Kullanici adi harf, rakam ve ._- karakterlerini icerebilir"
    )
    .optional(),
  company: nullableField("Sirket", { min: 2, max: 120 }).optional(),
  phone: nullableField("Telefon", { min: 6, max: 24 })
    .refine(
      (value) =>
        value === null || value === "" || /^[0-9+()\-\s]+$/.test(value),
      "Telefon numarasi sadece rakam, +, -, () ve bosluk icerebilir"
    )
    .optional(),
  position: nullableField("Pozisyon", { min: 2, max: 120 }).optional(),
});

export type ZProduct = z.infer<typeof productSchema>;
export type ZProductOption = z.infer<typeof productOptionSchema>;
export type ZCategory = z.infer<typeof categorySchema>;
export type ZAuthUser = z.infer<typeof authUserSchema>;
export type LoginFormInput = z.infer<typeof loginFormSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export function parseOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  message: string
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `${message}: ${result.error.issues
        .map((issue) => issue.message)
        .join(", ")}`
    );
  }
  return result.data;
}
