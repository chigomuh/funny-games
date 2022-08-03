import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return <main>{children}</main>;
};

export default Layout;
