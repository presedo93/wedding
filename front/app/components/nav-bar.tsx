import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { NavLink } from '@remix-run/react'
import { motion, useScroll, useTransform } from 'framer-motion'

export const NavBar = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.1], [-100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <motion.div
      className="fixed top-6 z-20 flex w-full justify-center"
      style={{ opacity, y }}
    >
      <nav className="flex w-11/12 flex-row items-center justify-between rounded-full bg-gray-300 p-2">
        <NavLink to={'/'}>
          <div className="flex flex-row items-baseline gap-1">
            <h1 className="font-mono text-2xl font-bold italic">L</h1>
            <p className="font-mono text-lg italic">&</p>
            <h1 className="font-mono text-2xl font-bold italic">R</h1>
          </div>
        </NavLink>
        <Dropdown className="bg-gray-300">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="user">
              <p className="font-semibold">Hola, Laura Martin!</p>
            </DropdownItem>
            <DropdownItem key="profile">
              {/* TODO: Add profile page */}
              <NavLink to={'/'}>Perfil</NavLink>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </nav>
    </motion.div>
  )
}
