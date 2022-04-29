interface Props {
  label: string;
}

function SectionHeader({ label }: Props) {
  return (
    <div className='basis-full flex items-center mb-1 pt-4'>
      <div className='flex-grow bg bg-zinc-300 h-0.5'></div>
      <div className='flex-grow-0 mx-5 font-bold dark:text-white text-zinc-600'>{label}</div>
      <div className='flex-grow bg bg-zinc-300 h-0.5'></div>
    </div>
  );
}

export default SectionHeader;
