import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role === "USER") {
    return NextResponse.error();
  }

  const body = await request.json();
  //   const { id, name, description, price, brand, category, inStock, images } =
  //     body;

  console.log("boddyyy", body);

  //   if (
  //     name !== null &&
  //     name !== undefined &&
  //     description !== null &&
  //     description !== undefined
  //   ) {
  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      brand: body.brand,
      category: body.category,
      inStock: body.inStock,
      images: body.images,
    },
  });
  return NextResponse.json(product);
  //   }
}
