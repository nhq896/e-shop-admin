"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdEdit,
  MdLibraryAdd,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import Link from "next/link";
import Button from "../components/Button";

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 190 },
    {
      field: "price",
      headerName: "Price(USD)",
      width: 110,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 110 },
    { field: "brand", headerName: "Brand", width: 110 },
    {
      field: "inStock",
      headerName: "In Stock",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="h-full flex items-center">
            {params.row.inStock ? (
              <Status
                text="in stock"
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="out of stock"
                icon={MdClose}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 225,
      renderCell: (params) => {
        return (
          <div className="w-full h-full flex items-center justify-between gap-4">
            <ActionBtn
              icon={MdCached}
              onClick={() => {
                handleToggleStock(params.row.id, params.row.inStock);
              }}
            />
            <Link href={`/edit-product/${params.row.id}`}>
              <ActionBtn icon={MdEdit} onClick={() => {}} />
            </Link>
            <ActionBtn
              icon={MdDelete}
              onClick={() => {
                handleDelete(params.row.id, params.row.images);
              }}
            />
            <Link
              href={`https://e-shop-orpin-iota.vercel.app/product/${params.row.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ActionBtn icon={MdRemoveRedEye} onClick={() => {}} />
            </Link>
          </div>
        );
      },
    },
  ];

  const handleToggleStock = useCallback((id: string, inStock: boolean) => {
    toast("Changing product status...");

    axios
      .put("/api/product", { id, inStock: !inStock })
      .then((res) => {
        toast.success("Product status changed");
        router.refresh();
      })
      .catch((err: any) => {
        toast.error("Oops! Something went wrong");
        console.log("Error toggle stock", err);
      });
  }, []);

  const handleDelete = useCallback(async (id: string, images: any[]) => {
    let text = "You want to delete this product?";
    if (confirm(text) == true) {
      toast("Deleting product...");

      const handleImageDelete = async () => {
        try {
          for (const item of images) {
            if (item.image) {
              const imageRef = ref(storage, item.image);
              await deleteObject(imageRef);
              console.log("image deleted", item.image);
            }
          }
        } catch (error) {
          return console.log("Delete images error", error);
        }
      };

      await handleImageDelete();

      axios
        .delete(`/api/product/${id}`)
        .then((res) => {
          toast.success("Product deleted");
          router.refresh();
        })
        .catch((err: any) => {
          toast.error("Failed to delete product");
          console.log("delete product error", err);
        });
    }
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl relative flex flex-col items-center">
      <div className="absolute h-14 flex items-center bottom-0 left-10 z-10">
        <Link
          className="flex items-center justify-center gap-1 px-2 py-1 text-base rounded-xl border-2 border-dashed text-slate-600 hover:text-slate-900 border-slate-600 hover:border-slate-900"
          href={"/add-products"}
        >
          <MdLibraryAdd size={18} />
          Add Products
        </Link>
      </div>
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>
      <div style={{ height: 500, width: "96%" }}>
        <DataGrid
          disableColumnResize
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20]}
          // checkboxSelection
        />
      </div>
    </div>
  );
};

export default ManageProductsClient;
