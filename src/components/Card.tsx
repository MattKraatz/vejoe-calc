interface Props {
  title: string;
  body: string;
}

function Card({ title, body }: Props) {
  return (
    <div className='w-full md:w-1/2 px-0 md:px-2'>
      <div className='rounded overflow-hidden shadow-inner mx-2 mt-3'>
        <div className='px-6 py-4 bg-zinc-100'>
          <div className='font-bold text-zinc-500 mb-0'>{title}</div>
          <p className='text-xl'>{body}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
