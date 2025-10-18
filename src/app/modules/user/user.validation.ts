import z from 'zod';
import {Role} from './user.interface';

export const createUserZodSchema = z.object({
    name: z
        .string({error: 'Name must be string'})
        .min(2, {error: 'Name must be 2 characters long'})
        .max(20, {error: 'Name can not exceed 20 characters'}),
    email: z.email({error: 'Invalid email'}),
    password: z
        .string({error: 'Password must be string'})
        .min(8)
        .max(20)
        .regex(/^(?=.*[A-Z])/, {
            message: 'Password must contain at least 1 uppercase letter.',
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: 'Password must contain at least one special character',
        })
        .regex(/^(?=.*\d)/, {
            message: 'Password must contain at least one number',
        }),
    phone: z
        .string({error: 'Phone number must be string'})
        .regex(/^(?:\+8801\d{9})$/)
        .optional(),
    address: z
        .string({message: 'Address must string'})
        .max(200, {message: 'Address can not exceed 200 characters'})
        .optional(),
    NID: z.number(),
});
export const updateUserZodSchema = z.object({
    name: z
        .string({error: 'Name must be string'})
        .min(2, {error: 'Name must be 2 characters long'})
        .max(20, {error: 'Name can not exceed 20 characters'})
        .optional(),
    password: z
        .string({error: 'Password must be string'})
        .min(8)
        .max(20)
        .regex(/^(?=.*[A-Z])/, {
            message: 'Password must contain at least 1 uppercase letter.',
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: 'Password must contain at least one special character',
        })
        .regex(/^(?=.*\d)/, {
            message: 'Password must contain at least one number',
        })
        .optional(),
    role: z.enum(Object.values(Role)),
    phone: z
        .string({error: 'Phone number must be string'})
        .regex(/^(?:\+8801\d{9})$/)
        .optional(),
    address: z
        .string({message: 'Address must string'})
        .max(200, {message: 'Address can not exceed 200 characters'})
        .optional(),
    isDeleted: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    isNIDVerified: z.boolean().optional(),
});
