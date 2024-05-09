"use client";

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import {
  MdAccessTimeFilled,
  MdDeliveryDining,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";

interface ManageOrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders }) => {
  const router = useRouter();
  let rows: any = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount),
        paymentStatus: order.status,
        date: moment(order.createdDate).fromNow(),
        deliveryStatus: order.deliveryStatus,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "customer", headerName: "Customer Name", width: 130 },
    {
      field: "amount",
      headerName: "Amount(USD)",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.amount}</div>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="h-full flex items-center">
            {params.row.paymentStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.paymentStatus === "complete" ? (
              <Status
                text="completed"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="h-full flex items-center">
            {params.row.deliveryStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.deliveryStatus === "dispatched" ? (
              <Status
                text="dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : params.row.deliveryStatus === "delivered" ? (
              <Status
                text="delivered"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="w-full h-full flex items-center justify-between gap-4">
            <ActionBtn
              icon={MdDeliveryDining}
              onClick={() => {
                handleDispatch(params.row.id, params.row.deliveryStatus);
              }}
              disabled={
                params.row.paymentStatus === "pending" ||
                params.row.deliveryStatus === "delivered"
              }
            />
            <ActionBtn
              icon={MdDone}
              onClick={() => {
                handleDeliver(params.row.id, params.row.deliveryStatus);
              }}
              disabled={params.row.deliveryStatus === "pending"}
            />
            <Link
              href={`/order/${params.row.id}`}
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

  const handleDispatch = useCallback((id: string, status: string) => {
    toast("Changing order status...");

    axios
      .put("/api/order", {
        id,
        deliveryStatus: status === "pending" ? "dispatched" : "pending",
      })
      .then((res) => {
        toast.success("Delivery Status Updated");
        router.refresh();
      })
      .catch((err: any) => {
        toast.error("Something went wrong");
        console.log("Error", err);
      });
  }, []);

  const handleDeliver = useCallback(async (id: string, status: string) => {
    toast("Changing order status...");

    axios
      .put("/api/order", {
        id,
        deliveryStatus: status === "dispatched" ? "delivered" : "dispatched",
      })
      .then((res) => {
        toast.success("Delivery Status Updated");
        router.refresh();
      })
      .catch((err: any) => {
        toast.error("Something went wrong");
        console.log("Error", err);
      });
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl flex flex-col items-center">
      <div className="mb-4 mt-8">
        <Heading title="Manage Orders" center />
      </div>
      <div style={{ height: 500, width: "95%" }}>
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

export default ManageOrdersClient;
