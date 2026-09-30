import { Request, Response } from "express";

import prisma from "../config/prisma";

type ContactParams = {
  id: string;
};

export async function getContacts(req: Request, res: Response) {
  try {
    const { companyId } = req.query;

    const contacts = await prisma.contact.findMany({
      where: companyId
        ? {
            companyId: String(companyId),
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        company: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function getContactById(
  req: Request<ContactParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        products: true,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function createContact(req: Request, res: Response) {
  try {
    const {
      name,
      phone,
      email,
      position,
      companyId,
      createdById,
    } = req.body;

    if (!name || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Nama contact dan perusahaan wajib diisi",
      });
    }

    const company = await prisma.company.findUnique({
      where: {
        id: String(companyId),
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company tidak ditemukan",
      });
    }

    const contact = await prisma.contact.create({
      data: {
        name: String(name).trim(),
        phone: phone ? String(phone).trim() : null,
        email: email ? String(email).trim().toLowerCase() : null,
        position: position ? String(position).trim() : null,
        companyId: String(companyId),
        createdById: createdById ? String(createdById) : null,
      },
      include: {
        company: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Contact berhasil ditambahkan",
      data: contact,
    });
  } catch (error) {
    console.error("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function updateContact(
  req: Request<ContactParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      position,
      companyId,
    } = req.body;

    const existingContact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: "Contact tidak ditemukan",
      });
    }

    if (companyId !== undefined) {
      const company = await prisma.company.findUnique({
        where: {
          id: String(companyId),
        },
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company tidak ditemukan",
        });
      }
    }

    const contact = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && {
          name: String(name).trim(),
        }),

        ...(phone !== undefined && {
          phone: phone ? String(phone).trim() : null,
        }),

        ...(email !== undefined && {
          email: email
            ? String(email).trim().toLowerCase()
            : null,
        }),

        ...(position !== undefined && {
          position: position ? String(position).trim() : null,
        }),

        ...(companyId !== undefined && {
          companyId: String(companyId),
        }),
      },
      include: {
        company: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contact berhasil diperbarui",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function deleteContact(
  req: Request<ContactParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact tidak ditemukan",
      });
    }

    if (contact._count.products > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Contact tidak bisa dihapus karena masih digunakan oleh product",
      });
    }

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contact berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}