import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

// Show success alert with react-hot-toast
function goodAlert(title, text) {
  toast.success(`${title}: ${text}`, {
    duration: 4000,
    position: 'top-right',
    style: {
      zIndex: 2000,
    },
  });
}


// Show error alert with react-hot-toast
function badAlert(title, text) {
  toast.error(`${title}: ${text}`, {
    duration: 4000,
    position: 'top-right',
    style: {
      zIndex: 2000,
    },
  });
}

async function deleteConfirm(title, text) {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true,
    didOpen: () => {
      const swalContainer = document.querySelector('.swal2-container');
      if (swalContainer) {
        swalContainer.style.zIndex = '2000'; 
      }
    }
  });

  return result.isConfirmed;
}

// Ensure Toaster is rendered at the top level of your app
export { goodAlert, badAlert, deleteConfirm, Toaster };
