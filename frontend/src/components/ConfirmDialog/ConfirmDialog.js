import Swal from 'sweetalert2';
import classNames from 'classnames/bind';
import styles from './ConfirmDialog.module.scss';

const cx = classNames.bind(styles);

export const showConfirmDialog = async ({
    title = 'Xác nhận hành động',
    text = '',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
}) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        customClass: {
            confirmButton: cx('swal-confirm-btn'),
            cancelButton: cx('swal-cancel-btn'),
            title: cx('swal-title'),
            htmlContainer: cx('swal-text'),
        },
    });

    return result.isConfirmed;
};
