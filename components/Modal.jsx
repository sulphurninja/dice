import { useState } from 'react';

const Modal = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleBackgroundClick = () => {
    if (!isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={`fixed z-50 inset-0 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={handleBackgroundClick}></div>
        <div className="relative bg-white w-80 rounded-md shadow-lg" onClick={handleModalClick}>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-2">User created successfully!</h2>
            <p className="text-2xl font-bold text-green-600">धन्यवाद !</p>
          </div>
          <div className="px-4 py-3 bg-gray-100 text-right">
            <button
              className="text-sm font-medium text-gray-500 hover:text-gray-600 transition duration-150 ease-in-out"
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  onClose();
                }, 300);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
