import { Request, Response } from "express";

import prisma from "../config/prisma";

type CompanyParams = {
  id: string;
};

type CompanyType = "VENDOR" | "PRINCIPAL";

function normalizeBrands(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .filter((brand): brand is string => typeof brand === "string")
        .map((brand) => brand.trim())
        .filter(Boolean)
    ),
  ];
}

export async function getCompanies(req: Request, res: Response) {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        principalBrands: {
          include: {
            brand: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },

        _count: {
          select: {
            contacts: true,
            products: true,
          },
        },
        products: {
          select: {
            principalId: true,
          },
        },
      },
    });

    const data = companies.map((company) => {
      const uniquePrincipalIds = new Set(
        company.products
          .map((product) => product.principalId)
          .filter(
            (principalId): principalId is string =>
              Boolean(principalId)
          )
      );

      return {
        ...company,
      
        products: undefined,

        brands: company.principalBrands.map(
          (principalBrand) => principalBrand.brand
        ),

        productCount: company._count.products,
        principalCount: uniquePrincipalIds.size,
      };
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get companies error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function getCompanyById(
  req: Request<CompanyParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        contacts: true,
        products: true,
        principalBrands: {
          include: {
            brand: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company tidak ditemukan",
      });
    }

    const data = {
      ...company,
      brands: company.principalBrands.map(
        (principalBrand) => principalBrand.brand
      ),
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get company error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function createCompany(req: Request, res: Response) {
  try {
    const {
      name,
      type,
      phone,
      email,
      address,
      website,
      description,
      createdById,
      brands,
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Nama company dan tipe wajib diisi",
      });
    }

    if (type !== "VENDOR" && type !== "PRINCIPAL") {
      return res.status(400).json({
        success: false,
        message: "Tipe company harus VENDOR atau PRINCIPAL",
      });
    }

    const normalizedBrands = normalizeBrands(brands);

    if (type === "PRINCIPAL" && normalizedBrands.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal satu brand wajib diisi untuk Principal",
      });
    }

    if (type === "VENDOR" && normalizedBrands.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Brand hanya dapat diberikan untuk Principal",
      });
    }

    const company = await prisma.$transaction(async (tx) => {
      const createdCompany = await tx.company.create({
        data: {
          name: String(name).trim(),
          type: type as CompanyType,
          phone: phone ? String(phone).trim() : null,
          email: email
            ? String(email).trim().toLowerCase()
            : null,
          address: address ? String(address).trim() : null,
          website: website ? String(website).trim() : null,
          description: description
            ? String(description).trim()
            : null,
          createdById: createdById
            ? String(createdById)
            : null,
        },
      });

      if (type === "PRINCIPAL") {
        for (const brandName of normalizedBrands) {
          const brand = await tx.brand.upsert({
            where: {
              name: brandName,
            },
            update: {},
            create: {
              name: brandName,
            },
          });

          await tx.principalBrand.create({
            data: {
              principalId: createdCompany.id,
              brandId: brand.id,
            },
          });
        }
      }

      return tx.company.findUniqueOrThrow({
        where: {
          id: createdCompany.id,
        },
        include: {
          principalBrands: {
            include: {
              brand: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    });

    const data = {
      ...company,
      brands: company.principalBrands.map(
        (principalBrand) => principalBrand.brand
      ),
    };

    return res.status(201).json({
      success: true,
      message: "Company berhasil ditambahkan",
      data,
    });
  } catch (error) {
    console.error("Create company error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function updateCompany(
  req: Request<CompanyParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      name,
      type,
      phone,
      email,
      address,
      website,
      description,
      brands,
    } = req.body;

    const existingCompany = await prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        principalBrands: true,
      },
    });

    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: "Company tidak ditemukan",
      });
    }

    if (
      type !== undefined &&
      type !== "VENDOR" &&
      type !== "PRINCIPAL"
    ) {
      return res.status(400).json({
        success: false,
        message: "Tipe company harus VENDOR atau PRINCIPAL",
      });
    }

    const finalType = (type ??
      existingCompany.type) as CompanyType;

    const normalizedBrands = normalizeBrands(brands);

    if (finalType === "PRINCIPAL") {
      if (
        brands !== undefined &&
        normalizedBrands.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Minimal satu brand wajib diisi untuk Principal",
        });
      }
    }

    if (
      finalType === "VENDOR" &&
      normalizedBrands.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Brand hanya dapat diberikan untuk Principal",
      });
    }

    const company = await prisma.$transaction(async (tx) => {
      const updatedCompany = await tx.company.update({
        where: {
          id,
        },
        data: {
          ...(name !== undefined && {
            name: String(name).trim(),
          }),

          ...(type !== undefined && {
            type: finalType,
          }),

          ...(phone !== undefined && {
            phone: phone ? String(phone).trim() : null,
          }),

          ...(email !== undefined && {
            email: email
              ? String(email).trim().toLowerCase()
              : null,
          }),

          ...(address !== undefined && {
            address: address
              ? String(address).trim()
              : null,
          }),

          ...(website !== undefined && {
            website: website
              ? String(website).trim()
              : null,
          }),

          ...(description !== undefined && {
            description: description
              ? String(description).trim()
              : null,
          }),
        },
      });
      if (
        finalType === "PRINCIPAL" &&
        brands !== undefined
      ) {
        await tx.principalBrand.deleteMany({
          where: {
            principalId: id,
          },
        });

        for (const brandName of normalizedBrands) {
          const brand = await tx.brand.upsert({
            where: {
              name: brandName,
            },
            update: {},
            create: {
              name: brandName,
            },
          });

          await tx.principalBrand.create({
            data: {
              principalId: id,
              brandId: brand.id,
            },
          });
        }
      }

      if (
        existingCompany.type === "PRINCIPAL" &&
        finalType === "VENDOR"
      ) {
        await tx.principalBrand.deleteMany({
          where: {
            principalId: id,
          },
        });
      }

      return tx.company.findUniqueOrThrow({
        where: {
          id: updatedCompany.id,
        },
        include: {
          principalBrands: {
            include: {
              brand: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    });

    const data = {
      ...company,
      brands: company.principalBrands.map(
        (principalBrand) => principalBrand.brand
      ),
    };

    return res.status(200).json({
      success: true,
      message: "Company berhasil diperbarui",
      data,
    });
  } catch (error) {
    console.error("Update company error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function deleteCompany(
  req: Request<CompanyParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            contacts: true,
            products: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company tidak ditemukan",
      });
    }

    if (
      company._count.contacts > 0 ||
      company._count.products > 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company tidak bisa dihapus karena masih memiliki contact atau product",
      });
    }

    await prisma.company.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Company berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete company error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}