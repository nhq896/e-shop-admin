import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

const Login = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect(`/`);
  }

  return (
    <Container>
      <FormWrap custom="h-[80vh]">
        <LoginForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

export default Login;
