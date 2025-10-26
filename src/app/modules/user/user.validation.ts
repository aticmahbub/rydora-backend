import z from 'zod';
import {IsActive, Role} from './user.interface';

export const geoPointZodSchema = z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()], {
        message: 'Coordinates must be an array of [longitude, latitude]',
    }),
    address: z.string().max(200).optional(),
    updatedAt: z.date().optional(),
});

export const createUserZodSchema = z.object({
    name: z
        .string({message: 'Name must be string'})
        .min(2, {message: 'Name must be at least 2 characters long'})
        .max(20, {message: 'Name cannot exceed 20 characters'}),
    email: z.string().email({message: 'Invalid email'}),
    password: z
        .string({message: 'Password must be string'})
        .min(8)
        .max(20)
        .regex(/^(?=.*[A-Z])/, {
            message: 'Password must contain at least 1 uppercase letter',
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: 'Password must contain at least one special character',
        })
        .regex(/^(?=.*\d)/, {
            message: 'Password must contain at least one number',
        }),
    phone: z
        .string({message: 'Phone number must be string'})
        .regex(/^(?:\+8801\d{9})$/)
        .optional(),
    NID: z.number(),
    age: z.number().optional(),
    isNIDVerified: z.boolean().optional(),
    currentLocation: geoPointZodSchema,
    role: z.enum(Object.values(Role)).optional(),
    isActive: z.enum(Object.values(IsActive)).optional(),
    isVerified: z.boolean().optional(),
});

export const updateUserZodSchema = z.object({
    name: z
        .string()
        .min(2, {message: 'Name must be at least 2 characters long'})
        .max(20, {message: 'Name cannot exceed 20 characters'})
        .optional(),
    password: z
        .string()
        .min(8)
        .max(20)
        .regex(/^(?=.*[A-Z])/, {
            message: 'Password must contain at least 1 uppercase letter',
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: 'Password must contain at least one special character',
        })
        .regex(/^(?=.*\d)/, {
            message: 'Password must contain at least one number',
        })
        .optional(),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9})$/)
        .optional(),
    NID: z.number().optional(),
    age: z.number().optional(),
    isNIDVerified: z.boolean().optional(),
    currentLocation: geoPointZodSchema.optional(),
    role: z.enum(Object.values(Role)).optional(),
    isDeleted: z.boolean().optional(),
    isActive: z.enum(Object.values(IsActive)).optional(),
    isVerified: z.boolean().optional(),
});
