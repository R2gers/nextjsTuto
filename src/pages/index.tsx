import Player from '@/components/Player';
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react';


const Home: NextPage = () => {
  const [players, playersSet] = useState<any[]>();
  const [dragId, setDragId] = useState();
  const [submited, setSubmited] = useState(false);
  const [answer, setAnswer] = useState<any[]>();
  const [accuracy, setAccuracy] = useState(0);

  const { data, isLoading } = trpc.useQuery(['getPlayers']);

  useEffect(() => {
    playersSet(data?.players);

    const ans = [];
    data?.players.sort((a, b) => b.wr - a.wr).forEach((p, i) => {
      ans.push({id:p.id, order:i+1, wr:p.wr})
    })
    setAnswer(ans);
    console.log(data);
  }, [data])


  if (isLoading) return (
    <div className="w-screen h-screen flex items-center justify-center">
      <img className="h-30 w-30" src="/img/svgs/rings.svg" />
    </div>
  )

  const onSubmit = (players, answer) => {
    let accurate = 0;
    players?.map(p=>{
      let correctOrder = answer?.find(a => a.id === p.id).order;
      if(p.order === correctOrder)
      {
        accurate = accurate +1;
      }
    });

    setAccuracy(((accurate/players?.length).toFixed(0))*100)
    setSubmited(true);
  }

  const handleDrag = (ev) => {
    setDragId(ev?.currentTarget?.id);
  }

  const handleDrop = (ev) => {
    const dragPlayer = players.find(p => p.id.toString() === dragId);
    const dropPlayer = players.find(p => p.id.toString() === ev.currentTarget.id);
    const dragPlayerOrder = dragPlayer.order;
    const dropPlayerOrder = dropPlayer.order;

    const newPlayerState = players.map((p) => {
      if (p.id.toString() === dragId) {
        p.order = dropPlayerOrder;
      }
      if (p.id.toString() === ev.currentTarget.id) {
        p.order = dragPlayerOrder;
      }
      return p;
    });

    playersSet(newPlayerState);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div>Re-order according to highest winrate</div>
      <div className="p-2" />
      <div className="flex">
        {
          players?.sort((a, b) => a.order - b.order).map(p => <Player key={p.id} answer={answer} player={p} handleDrag={handleDrag} handleDrop={handleDrop} submited={submited} />)
        }
      </div>
      <div className="p-2" />
      <button
        className="w-30 rounded-full border p-2 bg-green-300 hover:bg-green-700 text-black border-gray-900"
        onClick={() =>onSubmit(players, answer)}
      >
        Submit
      </button>

      {
        submited?
        <div className={`${accuracy > 50? 'text-green-400':'text-red-400'} p-2`}>
        Results: {accuracy}%
        </div>
        :
        null
      }
    </div>
  )
}

export default Home
