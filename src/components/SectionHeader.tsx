interface Props {
  label: string;
}

function SectionHeader({ label }: Props) {
  return (
    <div className='basis-full flex items-center mx-2 pt-6'>
      <div className='flex-grow bg bg-gray-300 h-0.5'></div>
      <div className='flex-grow-0 mx-5 font-bold dark:text-white'>{label}</div>
      <div className='flex-grow bg bg-gray-300 h-0.5'></div>
    </div>
  );
}

export default SectionHeader;
