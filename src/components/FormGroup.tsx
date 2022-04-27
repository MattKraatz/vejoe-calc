interface Props {
  label: string;
}

function FormGroup({ label, children }: React.PropsWithChildren<Props>) {
  return (
    <>
      <div className='flex items-center mx-2 py-4'>
        <div className='flex-grow bg bg-gray-300 h-0.5'></div>
        <div className='flex-grow-0 mx-5 font-bold dark:text-white'>{label}</div>
        <div className='flex-grow bg bg-gray-300 h-0.5'></div>
      </div>
      <div className='flex flex-wrap mb-4'>{children}</div>
    </>
  );
}

export default FormGroup;
