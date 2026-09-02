import { Response } from "express";

import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function createRequest(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.division !== "SALES") {
      return res.status(403).json({
        success: false,
        message: "Hanya Sales yang dapat membuat request",
      });
    }

    const {
      requestFor,
      priority,
      request,
      description,
    } = req.body;

    if (!requestFor || !request || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Request For, request, dan description wajib diisi",
      });
    }

    if (!["CUSTOMER", "COMPANY"].includes(requestFor)) {
      return res.status(400).json({
        success: false,
        message: "Request For harus CUSTOMER atau COMPANY",
      });
    }

    const selectedPriority = priority || "NORMAL";

    if (
      !["NORMAL", "MEDIUM", "HIGH"].includes(
        selectedPriority
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Priority harus NORMAL, MEDIUM, atau HIGH",
      });
    }

    const newRequest = await prisma.salesRequest.create({
      data: {
        requestFor,
        priority: selectedPriority,
        request: request.trim(),
        description: description.trim(),
        requestedById: req.user.userId,
      },
      include: {
        requestedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            division: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Request berhasil dibuat",
      request: newRequest,
    });
  } catch (error) {
    console.error("Create request error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat request",
    });
  }
}

export async function getRequests(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { division, userId } = req.user;

    let where = {};

    if (division === "SALES") {
      where = {
        requestedById: userId,
      };
    } else if (
      division === "RND" ||
      division === "ADMIN"
    ) {
      where = {};
    } else {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    const requests =
      await prisma.salesRequest.findMany({
        where,
        include: {
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              division: true,
            },
          },

          handledBy: {
            select: {
              id: true,
              name: true,
              email: true,
              division: true,
            },
          },

          followUps: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  division: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil request",
    });
  }
}

export async function getRequestById(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requestId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const request =
      await prisma.salesRequest.findUnique({
        where: {
          id: requestId,
        },

        include: {
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              division: true,
            },
          },

          handledBy: {
            select: {
              id: true,
              name: true,
              email: true,
              division: true,
            },
          },

          followUps: {
            orderBy: {
              createdAt: "desc",
            },

            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  division: true,
                },
              },
            },
          },
        },
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request tidak ditemukan",
      });
    }

    if (
      req.user.division === "SALES" &&
      request.requestedById !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Anda tidak memiliki akses ke request ini",
      });
    }

    if (
      !["SALES", "RND", "ADMIN"].includes(
        req.user.division
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses",
      });
    }

    return res.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error(
      "Get request detail error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail request",
    });
  }
}

export async function updateRequest(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      req.user.division !== "RND" &&
      req.user.division !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Hanya RnD atau Admin yang dapat mengubah request",
      });
    }

    const requestId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const existingRequest =
      await prisma.salesRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Request tidak ditemukan",
      });
    }

    const {
      status,
      priority,
      request,
      description,
    } = req.body;

    if (
      status &&
      !["PENDING", "ON_PROGRESS", "DONE"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status harus PENDING, ON_PROGRESS, atau DONE",
      });
    }

    if (
      priority &&
      !["NORMAL", "MEDIUM", "HIGH"].includes(
        priority
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Priority harus NORMAL, MEDIUM, atau HIGH",
      });
    }

    const updatedRequest =
      await prisma.salesRequest.update({
        where: {
          id: requestId,
        },

        data: {
          ...(status
            ? {
                status,
              }
            : {}),

          ...(priority
            ? {
                priority,
              }
            : {}),

          ...(request
            ? {
                request: request.trim(),
              }
            : {}),

          ...(description
            ? {
                description: description.trim(),
              }
            : {}),

          ...(req.user.division === "RND"
            ? {
                handledById: req.user.userId,
              }
            : {}),
        },

        include: {
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              division: true,
            },
          },

          handledBy: {
            select: {
              id: true,
              name: true,
              email: true,
              division: true,
            },
          },
        },
      });

    return res.json({
      success: true,
      message: "Request berhasil diperbarui",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update request error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui request",
    });
  }
}

export async function addFollowUp(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      req.user.division !== "RND" &&
      req.user.division !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Hanya RnD atau Admin yang dapat melakukan follow-up",
      });
    }

    const requestId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pesan follow-up wajib diisi",
      });
    }

    const existingRequest =
      await prisma.salesRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Request tidak ditemukan",
      });
    }

    const followUp =
      await prisma.requestFollowUp.create({
        data: {
          requestId,
          userId: req.user.userId,
          message: message.trim(),
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              division: true,
            },
          },
        },
      });

    if (existingRequest.status === "PENDING") {
      await prisma.salesRequest.update({
        where: {
          id: requestId,
        },

        data: {
          status: "ON_PROGRESS",
          handledById: req.user.userId,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Follow-up berhasil ditambahkan",
      followUp,
    });
  } catch (error) {
    console.error("Add follow-up error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan follow-up",
    });
  }
}
