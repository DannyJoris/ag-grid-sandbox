import { broadcastInfoId } from '@/utils/openfin';

const InfoButton = ({ id }: { id: string }) => {
  const handleClick = () => {
    console.log(id);
    broadcastInfoId(id);
  };

  return (
    <div className="">
      <button 
        onClick={handleClick}
        title="Information"
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer"
      >
        Info
      </button>
    </div>
  );
};

export default InfoButton;