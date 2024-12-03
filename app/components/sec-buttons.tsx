import { Button } from "./ui/button";

export const SecButtons = () => {
  return (
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
      <Button size={"lg"} className="py-2">
        Mi perfil
      </Button>
    </div>
  );
};
