import classNames from 'classnames/bind';
import { useState } from 'react';

import images from '~/assets/images';
import styles from './Upload.module.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const guides = [
    {
        icon: images.videoSize,
        title: 'Dung lượng và thời lượng',
        description: 'Dung lượng tối đa: 30 GB, thời lượng video: 60 phút.',
    },
    {
        icon: images.fileFormat,
        title: 'Định dạng tập tin',
        description: 'Đề xuất: “.mp4”. Có hỗ trợ các định dạng chính khác.',
    },
    {
        icon: images.videoRes,
        title: 'Độ phân giải video',
        description: 'Độ phân giải cao khuyến nghị: 1080p, 1440p, 4K.',
    },
    {
        icon: images.aspectRatio,
        title: 'Tỷ lệ khung hình',
        description: 'Đề xuất: 16:9 cho chế độ ngang, 9:16 cho chế độ dọc.',
    },
];

function Upload() {
    const [title, setTitle] = useState('');

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleClearTitle = () => {
        setTitle('');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('upload-wrapper')}>
                <button className={cx('upload-container')}>
                    <img src={images.download} alt="Download" />
                    <h2 className={cx('upload-title')}>Chọn video để tải lên</h2>
                    <p className={cx('upload-subtitle')}>Hoặc kéo và thả vào đây</p>
                    <Button bgPrimary className={cx('btn-custiom')}>
                        Chọn video
                    </Button>
                </button>
                <div className={cx('guides')}>
                    {guides.map((guide, index) => (
                        <div key={index} className={cx('guide-wrapper')}>
                            <div>
                                <img src={guide.icon} alt="guide icon" />
                            </div>
                            <div>
                                <h4>{guide.title}</h4>
                                <p className={cx('description')}>{guide.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cx('action')}>
                <Button bgSecondary className={cx('btn-custom')}>
                    Thay thế
                </Button>
                <div className={cx('right-action')}>
                    <div className={cx('input-container')}>
                        <input value={title} placeholder="" onChange={handleChangeTitle} />
                        <button className={cx('btn-clear')} onClick={handleClearTitle}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <span className={cx('label')}>Tiêu đề</span>
                    </div>
                    <Button bgPrimary className={cx('btn-custom')}>
                        Đăng
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Upload;
