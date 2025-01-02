import { Link } from "react-router";
import { Button } from "./ui";

interface Props {
  isAuth: boolean;
}

export const SecButtons = ({ isAuth }: Props) => {
  return (
    <div className="flex w-10/12 flex-col items-center justify-center gap-y-3 font-playwrite font-thin">
      <p>Pero antes del gran día, queremos que</p>
      <h2 className="text-3xl font-normal">Interactúes</h2>
      <p>con nosotros, asi que...</p>
      {isAuth ? <LoggedButtons /> : <UnloggedButtons />}
    </div>
  );
};

export const UnloggedButtons = () => (
  <div className="flex flex-row items-center justify-around">
    <Link to="/auth/sign-in" className="mr-4">
      <Button size={"lg"}>Inicia sesión</Button>
    </Link>
  </div>
);

export const LoggedButtons = () => (
  <div className="grid w-11/12 grid-cols-2 gap-4 md:flex md:flex-row md:justify-center">
    <Button size={"lg"} className="py-2">
      Musica
    </Button>
    <Button size={"lg"} className="py-2">
      Fotos
    </Button>
    <Button size={"lg"} className="py-2">
      Chat
    </Button>
    <Link to="/profile">
      <Button size={"lg"} className="w-full py-2">
        Mi perfil
      </Button>
    </Link>
  </div>
);