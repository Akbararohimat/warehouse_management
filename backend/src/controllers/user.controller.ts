import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        division: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        division: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password, division } = req.body;

    if (!name || !email || !password || !division) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, password, dan division wajib diisi",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedDivision = String(division).toUpperCase();

    if (!["RND", "SALES"].includes(normalizedDivision)) {
      return res.status(400).json({
        success: false,
        message: "Division hanya boleh RND atau SALES",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);

    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        role: "EMPLOYEE",
        division: normalizedDivision as any,
        isActive: true,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        division: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Akun berhasil dibuat",
      user,
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const { name, email, password, division } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (existingUser.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Akun ADMIN tidak dapat diedit melalui fitur ini",
      });
    }

    if (
      division !== undefined &&
      !["RND", "SALES"].includes(String(division).toUpperCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Division hanya boleh RND atau SALES",
      });
    }

    let normalizedEmail = existingUser.email;

    if (email !== undefined) {
      normalizedEmail = String(email).toLowerCase().trim();

      if (normalizedEmail !== existingUser.email) {
        const emailUsed = await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

        if (emailUsed) {
          return res.status(409).json({
            success: false,
            message: "Email sudah digunakan",
          });
        }
      }
    }

    const data: {
      name?: string;
      email?: string;
      passwordHash?: string;
      division?: any;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      data.name = String(name).trim();
    }

    if (email !== undefined) {
      data.email = normalizedEmail;
    }

    if (password !== undefined && password !== "") {
      data.passwordHash = await bcrypt.hash(String(password), 12);
    }

    if (division !== undefined) {
      data.division = String(division).toUpperCase() as any;
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        division: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User berhasil diperbarui",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function updateUserStatus(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive harus berupa true atau false",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (existingUser.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Status akun ADMIN tidak dapat diubah melalui fitur ini",
      });
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        division: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: isActive
        ? "User berhasil diaktifkan"
        : "User berhasil dinonaktifkan",
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (existingUser.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Akun ADMIN tidak dapat dihapus melalui fitur ini",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}