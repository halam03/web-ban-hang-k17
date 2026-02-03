import Swal from 'sweetalert2';

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
});

export const notifySuccess = (title) =>
    toast.fire({
        icon: 'success',
        title,
    });

export const notifyError = (title) =>
    toast.fire({
        icon: 'error',
        title,
    });

export const notifyInfo = (title) =>
    toast.fire({
        icon: 'info',
        title,
    });

export const confirmDelete = async (message) => {
    const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: message || 'Bạn chắc chắn muốn xóa mục này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        reverseButtons: true,
        focusCancel: true,
    });
    return result.isConfirmed;
};
