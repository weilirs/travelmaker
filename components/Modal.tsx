const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0  z-50 flex justify-center items-center ">
      <div className=" bg-[#ffb703] p-6 rounded-lg shadow-lg w-2/3">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-[#219ebc] hover:bg-[#8ecae6] text-[#023047] font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
