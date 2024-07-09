import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'

import { BarsIcon } from '~/icons'

export const NavBar = () => (
  <div className="flex w-full flex-row items-center justify-between rounded-b-xl bg-gray-200 px-4 py-2">
    <div className="flex flex-row items-baseline gap-1">
      <h1 className="font-mono text-4xl font-bold italic">L</h1>
      <p className="font-mono text-2xl italic">&</p>
      <h1 className="font-mono text-4xl font-bold italic">R</h1>
    </div>
    <Dropdown className="bg-gray-200">
      <DropdownTrigger>
        <Button isIconOnly className="bg-transparent">
          <BarsIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="photos">Imagenes</DropdownItem>
        <DropdownItem key="news">Noticias</DropdownItem>
        <DropdownItem key="guests">Invitados</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Otros
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
)
