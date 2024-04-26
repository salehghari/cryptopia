
interface Props {
  children: string,
  selected?: boolean,
  onClick?: React.MouseEventHandler
}

export default function SelectButton({ children, selected, onClick }: Props) {



  return (
    <span 
      onClick={onClick}
      className="w-[24%] max-sm:w-full p-2 rounded cursor-pointer text-center"
      style={{
        fontFamily: "Montserrat",
        backgroundColor: selected ? "#256ab4" : "",
        color: selected ? "black" : "",
        fontWeight: selected ? 700 : 500,
        border: selected ? "2px solid transparent" : "2px solid #003566",
      }}
    >{ children }</span>
  )
}
