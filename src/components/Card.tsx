interface Props {
  title: string;
  body: string;
  footer?: React.ReactElement;
}

function Card({ title, body, footer }: Props) {
  return (
    <div className='w-1/2'>
      <div className='rounded overflow-hidden shadow-lg m-2'>
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2'>{title}</div>
          <p className='text-gray-700 text-base'>{body}</p>
        </div>
        <div className='px-6 pt-4 pb-2'>{footer}</div>
      </div>
    </div>
  );
}

export default Card;
