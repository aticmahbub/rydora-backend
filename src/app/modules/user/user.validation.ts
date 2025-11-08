import z from 'zod';
import {IsActive, Role} from './user.interface';

export const geoPointZodSchema = z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()], {
        error: 'Coordinates must be an array of [longitude, latitude]',
    }),
    address: z.string().max(200).optional(),
    updatedAt: z.date().optional(),
});

export const createUserZodSchema = z.object({
    name: z
        .string({error: 'Name must be string'})
        .min(2, {error: 'Name must be at least 2 characters long'})
        .max(20, {error: 'Name cannot exceed 20 characters'}),
    email: z.email({error: 'Invalid email'}),
    password: z
        .string({error: 'Password must be string'})
        .min(8, {error: 'Password must be at least 8 characters long'})
        .max(20, {error: 'Password can not exceed 20 characters'})
        .regex(/^(?=.*[A-Z])/, {
            error: 'Password must contain at least 1 uppercase letter',
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            error: 'Password must contain at least one special character',
        })
        .regex(/^(?=.*\d)/, {
            error: 'Password must contain at least one number',
        }),
    phone: z
        .string({error: 'Phone number must be string'})
        .regex(/^(?:\+8801\d{9})$/)
        .optional(),
    NID: z.number().optional(),
    age: z.number().min(18, {error: 'You have to'}).optional(),
    isNIDVerified: z.boolean().optional(),
    currentLocation: geoPointZodSchema.optional(),
    role: z.enum(Object.values(Role)).optional(),
    isActive: z.enum(Object.values(IsActive)).optional(),
    isVerified: z.boolean().optional(),
});

export const updateUserZodSchema = z.object({
    name: z
        .string()
        .min(2, {error: 'Name must be at least 2 characters long'})
        .max(20, {error: 'Name cannot exceed 20 characters'})
        .optional(),
    password: z
        .string()
        .min(8)
        .max(20)
        .regex(/^(?=.*[A-Z])/, {
            error: 'Password must contain at least 1 uppercase letter',
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            error: 'Password must contain at least one special character',
        })
        .regex(/^(?=.*\d)/, {
            error: 'Password must contain at least one number',
        })
        .optional(),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9})$/)
        .optional(),
    NID: z.number(),
    age: z.number().optional(),
    isNIDVerified: z.boolean().optional(),
    currentLocation: geoPointZodSchema.optional(),
    role: z.enum(Object.values(Role)).optional(),
    isDeleted: z.boolean().optional(),
    isActive: z.enum(Object.values(IsActive)).optional(),
    isVerified: z.boolean().optional(),
});
