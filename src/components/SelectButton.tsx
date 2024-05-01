
interface Props {
  children: string,
  selected?: boolean,
  onClick?: React.MouseEventHandler
}

export default function SelectButton({ children, selected, onClick }: Props) {

  return (
    <span 
      onClick={onClick}
      className="px-3 py-[6px] rounded-lg cursor-pointer text-center text-[#9eb0c7] hover:text-[#dfe5ec]"
      style={{
        fontFamily: "Montserrat",
        backgroundColor: selected ? "#0d1217" : "transparent",
        color: selected ? "#dfe5ec" : "",
        fontWeight: selected ? 700 : 500,
      }}
    >{ children }</span>
  )
}
