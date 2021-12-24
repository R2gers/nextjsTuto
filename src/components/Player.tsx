


function Players({ player, handleDrag, handleDrop, submited, answer }): JSX.Element {

  const correctOder = answer.find(a => a.id === player.id).order;

  return (

    <div className="flex flex-col items-center justify-center border p-2"
      id={player.id}
      draggable={submited? false: true}
      onDragOver={(ev) => ev.preventDefault()}
      onDragStart={handleDrag}
      onDrop={handleDrop}
    >
      <div className="p-2">{player.order}</div>
      <img draggable={false} src={player.img} />
      <div className="p-2">
        {player?.name}
      </div>
      {
        submited ?
          <div className={`${correctOder === player.order? 'bg-green-700': 'bg-red-700'} p-2`}>
            {player?.wr}
          </div>
          : null
      }
    </div>

  )
}
export default Players
