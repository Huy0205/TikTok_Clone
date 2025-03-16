import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import ReactLoading from 'react-loading';

import images from '~/assets/images';
import styles from './Upload.module.scss';
import Button from '~/components/Button';
import { VideoServices } from '~/services';
import { AuthContext, ModalContext } from '~/contexts';
import { useHLS } from '~/hooks';

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
    const { auth, isLoadingAuth } = useContext(AuthContext);
    const { isAuthenticated, user } = auth;
    const { openModal } = useContext(ModalContext);

    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoOrientation, setVideoOrientation] = useState('vertical');
    const [isUploading, setIsUploading] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const inputRef = useRef(null);
    const videoRef = useRef();

    useHLS(videoRef, videoUrl);

    useEffect(() => {
        if (!isAuthenticated && !isLoadingAuth) {
            openModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingAuth, isAuthenticated]);

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleClearTitle = () => {
        setTitle('');
    };

    const isValidVideo = (file) => {
        return file && file.type.startsWith('video/');
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const uploadVideo = async (videoFile) => {
        setIsUploading(true);

        const uploadRes = await VideoServices.uploadVideo(videoFile);

        if (uploadRes.code === 'OK') {
            const { data } = uploadRes;
            setVideoUrl(data.hls_url);
            const ratio = data.width / data.height;

            let orientation = 'square'; // Mặc định là vuông
            if (ratio >= 1.7) orientation = 'horizontal-wide'; // Rộng nhiều
            else if (ratio >= 1.3) orientation = 'horizontal-medium'; // Rộng vừa
            else if (ratio >= 0.8) orientation = 'square'; // Vuông
            else if (ratio >= 0.6) orientation = 'vertical-medium'; // Dọc vừa
            else orientation = 'vertical-wide'; // Dọc nhiều

            setVideoOrientation(orientation);
            setTitle(videoFile.name.split('.')[0]);
        } else {
        }

        setIsUploading(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            if (isValidVideo(files[0])) {
                uploadVideo(files[0]);
            } else {
                console.log('Vui lòng chọn một file video hợp lệ.');
            }
        }
    };

    const handleSelectFile = () => {
        inputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (isValidVideo(file)) {
            uploadVideo(file);
        } else {
            console.log('Vui lòng chọn một file video hợp lệ.');
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        const saveRes = await VideoServices.saveVideo({
            music: 'nhạc nền - ' + user.nickname,
            publisherId: user.tiktokId,
            title,
            url: videoUrl,
        });
        if (saveRes.code === 'OK') {
            setVideoUrl(null);
            setTitle('');
        } else {
            console.log('Có lỗi xảy ra');
        }
        setTimeout(() => {
            setPublishing(false);
        }, 3000);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('upload-wrapper')}>
                {isUploading ? (
                    <div className={cx('uploading-container')}>
                        <h3 className={cx('uploading-title')}>Đang tải video lên</h3>
                        <ReactLoading type="balls" color="gray" height={8} width={30} />
                    </div>
                ) : videoUrl ? (
                    <div className={cx('video-wrapper')}>
                        <div className={cx(videoOrientation)}>
                            <video controls width="100%" height="100%" ref={videoRef} />
                        </div>
                    </div>
                ) : (
                    <button
                        className={cx('upload-container')}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={handleSelectFile}
                    >
                        <img src={images.download} alt="Download" />
                        <h2 className={cx('upload-title')}>Chọn video để tải lên</h2>
                        <p className={cx('upload-subtitle')}>Hoặc kéo và thả vào đây</p>
                        <Button bgPrimary className={cx('btn-custom')}>
                            Chọn video
                        </Button>
                        <input
                            type="file"
                            accept="video/*"
                            ref={inputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </button>
                )}
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
            <div className={cx('action', (!videoUrl || publishing) && 'no-btn-change')}>
                {videoUrl && !publishing && (
                    <>
                        <Button bgSecondary className={cx('btn-custom')} onClick={handleSelectFile}>
                            Thay thế
                        </Button>
                        <input
                            type="file"
                            accept="video/*"
                            ref={inputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </>
                )}
                <div className={cx('right-action')}>
                    <div className={cx('input-container')}>
                        <input
                            value={title}
                            placeholder=""
                            disabled={!videoUrl || publishing}
                            onChange={handleChangeTitle}
                        />
                        <button className={cx('btn-clear')} onClick={handleClearTitle}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <label className={cx('label')}>Tiêu đề</label>
                    </div>
                    <Button
                        bgPrimary
                        disable={!videoUrl || publishing}
                        className={cx('btn-custom')}
                        onClick={handlePublish}
                    >
                        {!publishing ? 'Đăng' : <ReactLoading type="spin" color="gray" height={18} width={18} />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Upload;
