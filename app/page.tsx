import getProducts from "@/actions/getProducts";
import getOrders from "@/actions/getOrders";
import getUsers from "@/actions/getUsers";
import getGraphData from "@/actions/getGraphData";
import Container from "@/app/components/Container";
import Summary from "./summary/Summary";
import BarGraph from "./summary/BarGraph";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/getCurrentUser";

const Admin = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect(`/login`);
  }
  const products = await getProducts({ category: null });
  const orders = await getOrders();
  const users = await getUsers();
  const graphData = await getGraphData();

  return (
    <div className="pt-8">
      <Container>
        <Summary products={products} orders={orders} users={users} />
        <div className="mt-4 mx-auto max-w-[1150px] flex justify-center">
          <BarGraph data={graphData} />
        </div>
      </Container>
    </div>
  );
};

export default Admin;
