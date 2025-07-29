"use server";
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma'; // You need to create this file

type createMenu = {
    errors: {
        name?: string[];
        description?: string[];
        category?: string[];
        price?: string[];
        image?: string[];
        formError?: string[];
    };
    success?: boolean;
    data?: any;
};

const formSchema = z.object({
    name: z.string().min(2).max(100).nonempty(),
    description: z.string().max(500).nonempty(),
    category: z.string().min(2, { message: "Select an appropriate category" }).max(100).nonempty(),
    price: z.number().min(1, { message: "Price must have a minimum value of 1" }),
    image: z.string().url({ message: "Invalid image URL" }).optional().or(z.literal('')),
});

export const createMenuItem = async (initialState: any, formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries());

    // Prepare data for validation
    const dataForValidation = {
        ...rawData,
        price: rawData.price ? Number(rawData.price) : undefined,
    };

    const result = formSchema.safeParse(dataForValidation);
    const errors: createMenu['errors'] = {};

    if (!result.success) {
        result.error.issues.forEach((error) => {
            if (error.path.length > 0) {
                const field = error.path[0] as keyof createMenu['errors'];
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field]!.push(error.message);
            } else {
                errors.formError = errors.formError || [];
                errors.formError.push(error.message);
            }
        });

        return { errors };
    }

    // Save to database using Prisma
    try {
        const validatedData = result.data;

        const menuItem = await prisma.menuItem.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                category: validatedData.category,
                price: validatedData.price,
                image: validatedData.image || null,
            },
        });

        // Revalidate pages to show new data
        revalidatePath('/admin/menu');
        revalidatePath('/menu');

        return { 
            success: true, 
            data: menuItem,
            message: "Menu item created successfully!"
        };

    } catch (error) {
        console.error('Database error:', error);
        return {
            errors: {
                formError: ['Failed to create menu item. Please try again.']
            }
        };
    }
};

// Get all menu items
export const getMenuItems = async () => {
    try {
        const menuItems = await prisma.menuItem.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: menuItems };

    } catch (error) {
        console.error('Error fetching menu items:', error);
        return { 
            success: false, 
            error: 'Failed to fetch menu items' 
        };
    }
};

// Update menu item
export const updateMenuItem = async (id: string, formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries());

    const dataForValidation = {
        ...rawData,
        price: rawData.price ? Number(rawData.price) : undefined,
    };


    const result = formSchema.safeParse(dataForValidation);

    if (!result.success) {
        const errors: createMenu['errors'] = {};
        result.error.issues.forEach((error) => {
            if (error.path.length > 0) {
                const field = error.path[0] as keyof createMenu['errors'];
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field]!.push(error.message);
            }
        });
        return { errors };
    }
    const previousImageValue = rawData.image || null; // Handle previous image value if needed

    try {
        const validatedData = result.data;

        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                category: validatedData.category,
                price: validatedData.price,
                image: typeof validatedData.image === 'string' && validatedData.image !== '' 
                    ? validatedData.image 
                    : (typeof previousImageValue === 'string' ? previousImageValue : null), // Ensure image is string or null
            },
        });

        revalidatePath('/admin/menu');
        revalidatePath('/menu');

        return { 
            success: true, 
            data: updatedItem,
            message: "Menu item updated successfully!"
        };

    } catch (error) {
        console.error('Database error:', error);
        return {
            errors: {
                formError: ['Failed to update menu item. Please try again.']
            }
        };
    }
};

// Delete menu item
export const deleteMenuItem = async (id: string) => {
    try {
        await prisma.menuItem.delete({
            where: { id }
        });

        revalidatePath('/admin/menu');
        revalidatePath('/menu');

        return { 
            success: true,
            message: "Menu item deleted successfully!"
        };

    } catch (error) {
        console.error('Database error:', error);
        return { 
            success: false, 
            error: 'Failed to delete menu item' 
        };
    }
};




// https://ik.imagekit.io/bh4z8zgzod/azure-cocktail-table_2O0FRUj_f.jpg?updatedAt=1753778753983

// https://ik.imagekit.io/bh4z8zgzod/azure-cocktail-table_2O0FRUj_f.jpg?updatedAt=1753778753983