import { NavLink } from "@remix-run/react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const NavBar = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.1], [-100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <motion.div
      className="fixed top-6 z-20 flex w-full justify-center"
      style={{ opacity, y }}
    >
      <nav className="flex w-11/12 flex-row items-center justify-between rounded-full bg-gray-300 p-2">
        <NavLink to={"/"}>
          <Logo />
        </NavLink>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <NavLink to={"/profile"}>Profile</NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </motion.div>
  );
};

const Logo = () => (
  <div className="flex flex-row items-baseline gap-1">
    <h1 className="font-mono text-2xl font-bold italic">L</h1>
    <p className="font-mono text-lg italic">&</p>
    <h1 className="font-mono text-2xl font-bold italic">R</h1>
  </div>
);
