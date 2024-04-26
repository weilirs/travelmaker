const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0  z-50 flex justify-center items-center ">
      <div className=" bg-[#fefae0] p-6 rounded-lg shadow-lg w-2/3">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-[#d4a373] hover:bg-[#faedcd] text-gray font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
