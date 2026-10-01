import { Request, Response } from "express";

import prisma from "../config/prisma";

type ProductSolutionParams = {
  id: string;
  documentId?: string;
};

type UploadedFile = Express.Multer.File;

async function findPrincipalByBrand(brand: string) {
  const normalizedBrand = String(brand).trim();

  if (!normalizedBrand) {
    return null;
  }

  const brandRecord = await prisma.brand.findFirst({
    where: {
      name: {
        equals: normalizedBrand,
        mode: "insensitive",
      },
    },
    include: {
      principals: {
        include: {
          principal: true,
        },
      },
    },
  });

  if (!brandRecord) {
    return null;
  }

  const principalRelation = brandRecord.principals.find(
    (relation) => relation.principal.type === "PRINCIPAL"
  );

  return principalRelation?.principal ?? null;
}

async function findPrincipalsByBrand(brand: string) {
  const normalizedBrand = String(brand).trim();

  if (!normalizedBrand) {
    return [];
  }

  const brandRecord = await prisma.brand.findFirst({
    where: {
      name: {
        equals: normalizedBrand,
        mode: "insensitive",
      },
    },
    include: {
      principals: {
        include: {
          principal: true,
        },
      },
    },
  });

  if (!brandRecord) {
    return [];
  }

  return brandRecord.principals
    .filter(
      (relation) => relation.principal.type === "PRINCIPAL"
    )
    .map((relation) => relation.principal);
}

export async function getProductSolutions(
  req: Request,
  res: Response
) {
  try {
    const {
      companyId,
      contactId,
      principalId,
    } = req.query;

    const productSolutions =
      await prisma.productSolution.findMany({
        where: {
          ...(companyId && {
            companyId: String(companyId),
          }),

          ...(contactId && {
            contactId: String(contactId),
          }),

          ...(principalId && {
            principalId: String(principalId),
          }),
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          company: true,
          contact: true,
          principal: true,
          documents: true,
        },
      });

    const data = await Promise.all(
      productSolutions.map(async (productSolution) => {
        const principals = await findPrincipalsByBrand(
          productSolution.brand
        );

        return {
          ...productSolution,
          principals,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Get product solutions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function getProductSolutionById(
  req: Request<ProductSolutionParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const productSolution =
      await prisma.productSolution.findUnique({
        where: {
          id,
        },

        include: {
          company: true,
          contact: true,
          principal: true,
          documents: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    if (!productSolution) {
      return res.status(404).json({
        success: false,
        message: "Product Solution tidak ditemukan",
      });
    }

    const principals = await findPrincipalsByBrand(
      productSolution.brand
    );

    return res.status(200).json({
      success: true,
      data: {
        ...productSolution,
        principals,
      },
    });
  } catch (error) {
    console.error(
      "Get product solution error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function createProductSolution(
  req: Request,
  res: Response
) {
  try {
    const {
      code,
      name,
      category,
      brand,
      imageUrl,
      description,
      specification,
      companyId,
      contactId,
      createdById,
    } = req.body;

    if (
      !code ||
      !name ||
      !category ||
      !brand ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code, nama, kategori, brand, dan perusahaan wajib diisi",
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

    if (contactId) {
      const contact = await prisma.contact.findUnique({
        where: {
          id: String(contactId),
        },
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact tidak ditemukan",
        });
      }

      if (contact.companyId !== String(companyId)) {
        return res.status(400).json({
          success: false,
          message:
            "Contact tidak berasal dari company yang dipilih",
        });
      }
    }

    const existingCode =
      await prisma.productSolution.findUnique({
        where: {
          code: String(code).trim(),
        },
      });

    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Code Product Solution sudah digunakan",
      });
    }

    const principal = await findPrincipalByBrand(
      String(brand)
    );

    if (!principal) {
      return res.status(400).json({
        success: false,
        message: `Brand "${String(
          brand
        ).trim()}" belum terdaftar pada Principal`,
      });
    }

    const productSolution =
      await prisma.productSolution.create({
        data: {
          code: String(code).trim(),
          name: String(name).trim(),
          category: String(category).trim(),
          brand: String(brand).trim(),

          imageUrl: imageUrl
            ? String(imageUrl).trim()
            : null,

          description:
            description !== undefined &&
            description !== null
              ? String(description).trim()
              : null,

          specification:
            specification !== undefined &&
            specification !== null
              ? String(specification).trim()
              : null,

          companyId: String(companyId),

          contactId: contactId
            ? String(contactId)
            : null,

          principalId: principal.id,

          createdById: createdById
            ? String(createdById)
            : null,
        },

        include: {
          company: true,
          contact: true,
          principal: true,
          documents: true,
        },
      });

    const principals = await findPrincipalsByBrand(
      productSolution.brand
    );

    return res.status(201).json({
      success: true,
      message: "Product Solution berhasil ditambahkan",
      data: {
        ...productSolution,
        principals,
      },
    });
  } catch (error) {
    console.error(
      "Create product solution error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function updateProductSolution(
  req: Request<ProductSolutionParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      code,
      name,
      category,
      brand,
      imageUrl,
      description,
      specification,
      companyId,
      contactId,
    } = req.body;

    const existingProductSolution =
      await prisma.productSolution.findUnique({
        where: {
          id,
        },
      });

    if (!existingProductSolution) {
      return res.status(404).json({
        success: false,
        message: "Product Solution tidak ditemukan",
      });
    }

    const finalCompanyId =
      companyId !== undefined
        ? String(companyId)
        : existingProductSolution.companyId;

    const company = await prisma.company.findUnique({
      where: {
        id: finalCompanyId,
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company tidak ditemukan",
      });
    }

    if (
      contactId !== undefined &&
      contactId !== null &&
      contactId !== ""
    ) {
      const contact = await prisma.contact.findUnique({
        where: {
          id: String(contactId),
        },
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact tidak ditemukan",
        });
      }

      if (contact.companyId !== finalCompanyId) {
        return res.status(400).json({
          success: false,
          message:
            "Contact tidak berasal dari company yang dipilih",
        });
      }
    }

    const finalBrand =
      brand !== undefined
        ? String(brand).trim()
        : existingProductSolution.brand;

    const principal = await findPrincipalByBrand(
      finalBrand
    );

    if (!principal) {
      return res.status(400).json({
        success: false,
        message: `Brand "${finalBrand}" belum terdaftar pada Principal`,
      });
    }

    if (code !== undefined) {
      const duplicate =
        await prisma.productSolution.findFirst({
          where: {
            code: String(code).trim(),
            NOT: {
              id,
            },
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Code Product Solution sudah digunakan",
        });
      }
    }

    const productSolution =
      await prisma.productSolution.update({
        where: {
          id,
        },

        data: {
          ...(code !== undefined && {
            code: String(code).trim(),
          }),

          ...(name !== undefined && {
            name: String(name).trim(),
          }),

          ...(category !== undefined && {
            category: String(category).trim(),
          }),

          ...(brand !== undefined && {
            brand: finalBrand,
          }),

          ...(imageUrl !== undefined && {
            imageUrl: imageUrl
              ? String(imageUrl).trim()
              : null,
          }),

          ...(description !== undefined && {
            description:
              description === null
                ? null
                : String(description).trim(),
          }),

          ...(specification !== undefined && {
            specification:
              specification === null
                ? null
                : String(specification).trim(),
          }),

          ...(companyId !== undefined && {
            companyId: String(companyId),
          }),

          ...(contactId !== undefined && {
            contactId: contactId
              ? String(contactId)
              : null,
          }),

          principalId: principal.id,
        },

        include: {
          company: true,
          contact: true,
          principal: true,
          documents: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    const principals = await findPrincipalsByBrand(
      productSolution.brand
    );

    return res.status(200).json({
      success: true,
      message: "Product Solution berhasil diperbarui",
      data: {
        ...productSolution,
        principals,
      },
    });
  } catch (error) {
    console.error(
      "Update product solution error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function uploadProductSolutionImage(
  req: Request<ProductSolutionParams>,
  res: Response
) {
  try {
    const { id } = req.params;
    const file = req.file as UploadedFile | undefined;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File gambar wajib diupload",
      });
    }

    const productSolution =
      await prisma.productSolution.findUnique({
        where: { id },
      });

    if (!productSolution) {
      return res.status(404).json({
        success: false,
        message: "Product Solution tidak ditemukan",
      });
    }

    const imageUrl = `/uploads/products/${file.filename}`;

    const updatedProductSolution =
      await prisma.productSolution.update({
        where: { id },
        data: { imageUrl },
        include: {
          company: true,
          contact: true,
          principal: true,
          documents: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

    const principals = await findPrincipalsByBrand(
      updatedProductSolution.brand
    );

    return res.status(200).json({
      success: true,
      message: "Foto Product Solution berhasil diupload",
      data: {
        ...updatedProductSolution,
        principals,
      },
    });
  } catch (error) {
    console.error(
      "Upload product solution image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function uploadProductSolutionDocuments(
  req: Request<ProductSolutionParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const files = req.files as UploadedFile[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal satu file PDF wajib diupload",
      });
    }

    const productSolution =
      await prisma.productSolution.findUnique({
        where: {
          id,
        },
      });

    if (!productSolution) {
      return res.status(404).json({
        success: false,
        message: "Product Solution tidak ditemukan",
      });
    }

    const documents =
      await prisma.productSolutionDocument.createMany({
        data: files.map((file) => ({
          name: file.originalname,
          fileUrl: `/uploads/products/${file.filename}`,
          productSolutionId: id,
        })),
      });

    const updatedProductSolution =
      await prisma.productSolution.findUnique({
        where: {
          id,
        },
        include: {
          company: true,
          contact: true,
          principal: true,
          documents: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    return res.status(201).json({
      success: true,
      message: `${documents.count} PDF berhasil diupload`,
      data: updatedProductSolution,
    });
  } catch (error) {
    console.error(
      "Upload product solution documents error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function deleteProductSolutionDocument(
  req: Request<ProductSolutionParams>,
  res: Response
) {
  try {
    const { id, documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID wajib diisi",
      });
    }

    const document =
      await prisma.productSolutionDocument.findUnique({
        where: {
          id: documentId,
        },
      });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan",
      });
    }

    if (document.productSolutionId !== id) {
      return res.status(400).json({
        success: false,
        message:
          "Dokumen tidak berasal dari Product Solution tersebut",
      });
    }

    await prisma.productSolutionDocument.delete({
      where: {
        id: documentId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Dokumen berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "Delete product solution document error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function deleteProductSolution(
  req: Request<ProductSolutionParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const productSolution =
      await prisma.productSolution.findUnique({
        where: {
          id,
        },
      });

    if (!productSolution) {
      return res.status(404).json({
        success: false,
        message: "Product Solution tidak ditemukan",
      });
    }

    await prisma.productSolution.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product Solution berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "Delete product solution error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}
