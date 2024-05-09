import { getCurrentUser } from "@/actions/getCurrentUser";
import FormWrap from "@/app/components/FormWrap";
import NullData from "@/app/components/NullData";
import { Container } from "@mui/material";
import React from "react";
import EditProductForm from "./EditProductForm";
import getProductById from "@/actions/getProductById";
import toast from "react-hot-toast";
import { colors } from "@/utils/Colors";

interface IParams {
  productId?: string;
}

const EditProduct = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role === "USER") {
    return <NullData title="Oop! Access denied" />;
  }

  const product = await getProductById(params);

  if (!product) {
    toast.error("Something went wrong");
    return <NullData title="Oops! Product with the given id does not exist" />;
  }

  // console.log(params);
  let existedColors: any[] = colors;

  const resetColors = async () => {
    if (product.images !== null && product.images !== undefined) {
      for (let index in existedColors) {
        if (
          product.images.filter(
            (img: any) => img.color === existedColors[index].color
          )[0] !== null &&
          product.images.filter(
            (img: any) => img.color === existedColors[index].color
          )[0] !== undefined
        ) {
          existedColors[index] = product.images.filter(
            (img: any) => img.color === existedColors[index].color
          )[0];
        }
      }
    }
  };

  await resetColors();

  return (
    <div className="p-8">
      <Container>
        <FormWrap custom="pt-5">
          <EditProductForm product={product} existedColors={existedColors} />
        </FormWrap>
      </Container>
    </div>
  );
};

export default EditProduct;
