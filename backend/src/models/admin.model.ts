// admin.model.ts
import prisma from "../config/prisma";
import bcrypt from 'bcrypt';

class Admin {
    async findByEmail(email: string) {
        const admin = await prisma.getClient().admin.findUnique({
            where: {
                email: email,
            },
        });
        return admin;
    }

    async findById(id: string) {
        const admin = await prisma.getClient().admin.findUnique({
            where: {
                id: id,
            },
        });
        return admin;
    }

}

export default Admin;