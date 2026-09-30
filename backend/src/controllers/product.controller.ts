import { Request, Response } from "express";

import prisma from "../config/prisma";

import fs from "fs";

import path from "path";
import { text } from "stream/consumers";

type ProductParams = {
  id: string;
};

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
      (relation) =>
        relation.principal.type === "PRINCIPAL"
    )
    .map((relation) => relation.principal);
}

export async function getProducts(
  req: Request,
  res: Response
) {
  try {
    const { companyId, contactId, status } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(companyId && {
          companyId: String(companyId),
        }),

        ...(contactId && {
          contactId: String(contactId),
        }),

        ...(status && {
          status: String(status) as
            | "ACTIVE"
            | "INACTIVE",
        }),
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        company: true,
        contact: true,
        principal: true,

        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const productsWithPrincipals = await Promise.all(
      products.map(async (product) => {
        const principals = await findPrincipalsByBrand(
          product.brand
        );

        return {
          ...product,
          principals,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: productsWithPrincipals,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function getProductById(
  req: Request<ProductParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        company: true,
        contact: true,
        principal: true,

        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    const principals = await findPrincipalsByBrand(
      product.brand
    );

    return res.status(200).json({
      success: true,
      data: {
        ...product,
        principals,
      },
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function createProduct(
  req: Request,
  res: Response
) {
  try {
    const {
      code,
      name,
      category,
      brand,
      price,
      status,
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
      price === undefined ||
      price === null ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code, nama, kategori, brand, price, dan perusahaan wajib diisi",
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

    if (
      status !== undefined &&
      status !== "ACTIVE" &&
      status !== "INACTIVE"
    ) {
      return res.status(400).json({
        success: false,
        message: "Status harus ACTIVE atau INACTIVE",
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

    const product = await prisma.product.create({
      data: {
        code: String(code).trim(),

        name: String(name).trim(),

        category: String(category).trim(),

        brand: String(brand).trim(),

        price: Number(price),

        status: status || "ACTIVE",

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

        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const principals = await findPrincipalsByBrand(
      product.brand
    );

    return res.status(201).json({
      success: true,
      message: "Product berhasil ditambahkan",

      data: {
        ...product,
        principals,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function updateProduct(
  req: Request<ProductParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      code,
      name,
      category,
      brand,
      price,
      status,
      description,
      specification,
      companyId,
      contactId,
    } = req.body;

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    const finalCompanyId =
      companyId !== undefined
        ? String(companyId)
        : existingProduct.companyId;

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

    if (
      status !== undefined &&
      status !== "ACTIVE" &&
      status !== "INACTIVE"
    ) {
      return res.status(400).json({
        success: false,
        message: "Status harus ACTIVE atau INACTIVE",
      });
    }

    const finalBrand =
      brand !== undefined
        ? String(brand).trim()
        : existingProduct.brand;

    const principal = await findPrincipalByBrand(
      finalBrand
    );

    if (!principal) {
      return res.status(400).json({
        success: false,
        message: `Brand "${finalBrand}" belum terdaftar pada Principal`,
      });
    }

    const product = await prisma.product.update({
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

        ...(price !== undefined && {
          price: Number(price),
        }),

        ...(status !== undefined && {
          status,
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

        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const principals = await findPrincipalsByBrand(
      product.brand
    );

    return res.status(200).json({
      success: true,
      message: "Product berhasil diperbarui",

      data: {
        ...product,
        principals,
      },
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function uploadProductsPdf(
  req: Request<ProductParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File PDF wajib diupload",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    const pdfUrl = `/uploads/products/${req.file.filename}`;

    const updatedProduct =
      await prisma.product.update({
        where: {
          id,
        },

        data: {
          pdfUrl,
        },

        include: {
          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      message: "PDF berhasil diupload",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Upload product PDF error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function uploadProductImages(
  req: Request<ProductParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal 1 gambar wajib diupload",
      });
    }

    const currentImageCount =
      await prisma.productImage.count({
        where: {
          productId: id,
        },
      });

    if (currentImageCount + files.length > 5) {
      return res.status(400).json({
        success: false,
        message:
          `Product hanya boleh memiliki maksimal 5 gambar. ` +
          `Saat ini sudah ada ${currentImageCount} gambar.`,
      });
    }

    const createdImages =
      await prisma.productImage.createMany({
        data: files.map((file) => ({
          productId: id,
          imageUrl: `/uploads/products/${file.filename}`,
        })),
      });

    const productWithImages =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          company: true,
          contact: true,
          principal: true,

          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return res.status(201).json({
      success: true,
      message: `${createdImages.count} gambar berhasil diupload`,
      data: productWithImages,
    });
  } catch (error) {
    console.error(
      "Upload product images error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function deleteProduct(
  req: Request<ProductParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}

export async function replaceProductImages(
  req: Request<ProductParams>,
  res: Response
) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal 1 gambar wajib di upload",
      });
    }

    if (files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Product Maksimal memiliki 5 gambar",
      });
    }

    const oldImages = product.images;
    const newImages = files.map((file) => ({
      productId: id,
      imageUrl: `/uploads/products/${file.filename}`,
    }));

    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({
        where: {
          productId: id,
        },
      });
      await tx.productImage.createMany({
        data: newImages,
      });
    });

    for (const oldImage of oldImages) {
      const oldFilePath = path.join(
        process.cwd(),
        oldImage.imageUrl.replace(
          /^\/uploads\//,
          "uploads"
        )
      );

      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (fileError) {
        console.error(
          "Gagal menghapus file gambar lama:",
          fileError
        );
      }
    }

    const updatedProduct = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        contact: true,
        principal: true,
        images: {
          orderBy: {
            createdAt: "asc"
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `${files.length} gambar berhasil diganti`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Replace product images error:",
      error
    );

    return res.status(500).json({
      success:false,
      message: "Terjadi kesalahan pada server",
    });
  }
}