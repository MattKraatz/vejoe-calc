interface Props {
  title: string;
  body: string;
}

function Card({ title, body }: Props) {
  return (
    <div className='w-full md:w-1/2'>
      <div className='rounded overflow-hidden shadow-inner mx-2 mb-3 md:mb-0'>
        <div className='px-6 py-4 bg-gray-100'>
          <div className='font-bold text-gray-600 mb-0'>{title}</div>
          <p className='text-xl'>{body}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
