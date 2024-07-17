import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { NavLink } from '@remix-run/react'

import { BarsIcon } from '~/icons'

export const NavBar = () => (
  <div className="relative z-10 mt-6 flex w-11/12 flex-row items-center justify-between rounded-xl bg-gray-400 px-4 py-2">
    <NavLink to={'/'}>
      <div className="flex flex-row items-baseline gap-1">
        <h1 className="font-mono text-4xl font-bold italic">L</h1>
        <p className="font-mono text-2xl italic">&</p>
        <h1 className="font-mono text-4xl font-bold italic">R</h1>
      </div>
    </NavLink>
    <Dropdown className="bg-gray-200">
      <DropdownTrigger>
        <Button isIconOnly className="bg-transparent">
          <BarsIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="photos">
          <NavLink to={'/pictures'}>Imagenes</NavLink>
        </DropdownItem>
        <DropdownItem key="news">
          <NavLink to={'/news'}>Noticias</NavLink>
        </DropdownItem>
        <DropdownItem key="guests">
          <NavLink to={'/guests'}>Invitados</NavLink>
        </DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          <NavLink to={'/others'}>Otros</NavLink>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
)
