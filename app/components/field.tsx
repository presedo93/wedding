export const Field = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>
}

export const FieldError = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-md bg-red-600 px-1 py-2 text-center text-sm font-semibold text-white">
      {children}
    </div>
  )
}
