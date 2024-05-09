import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")
  ) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { name, description, price, brand, category, inStock, images } = body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      brand,
      category,
      inStock,
      images,
    },
  });

  return NextResponse.json(product);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role === "USER") {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, inStock, color, quantity } = body;
  const { name, description, price, brand, category, images } = body;

  console.log("boddyyy", body);

  if (
    name !== null &&
    name !== undefined &&
    description !== null &&
    description !== undefined
  ) {
    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price: parseFloat(price),
        brand,
        category,
        inStock,
        images,
      },
    });
    return NextResponse.json(product);
  }

  if (
    color !== null &&
    color !== undefined &&
    quantity != null &&
    quantity !== undefined
  ) {
    const product = await prisma.product.update({
      where: { id: id },
      data: {
        images: {
          updateMany: {
            where: {
              color: color,
            },
            data: {
              quantity,
            },
          },
        },
      },
    });

    return NextResponse.json(product);
  }

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  // console.log(product);

  if (product !== null && product !== undefined) {
    const allOutOfStock = product.images.every((image) => {
      return image.quantity === 0;
    });

    if (allOutOfStock) {
      const updatedProduct = await prisma.product.update({
        where: { id: id },
        data: { inStock: false },
      });
      return NextResponse.json(updatedProduct);
    }
  }

  if (inStock != null && inStock != undefined) {
    const product = await prisma.product.update({
      where: { id: id },
      data: { inStock },
    });

    return NextResponse.json(product);
  }
  return NextResponse.json(product);
}
