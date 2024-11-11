

const Box = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white shadow-xl p-2">
        {children}
    </div>
  )
}

export default Box