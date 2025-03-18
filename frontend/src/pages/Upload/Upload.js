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
import { toast } from 'react-toastify';
import { getVideoOrientation } from '~/util/videoOrientation';

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

    const [dataVideo, setDataVideo] = useState(null);
    const [videoOrientation, setVideoOrientation] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const inputRef = useRef(null);
    const videoRef = useRef();

    useHLS(videoRef, dataVideo?.hls_url);

    useEffect(() => {
        if (!isAuthenticated && !isLoadingAuth) {
            openModal('/upload');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingAuth, isAuthenticated]);

    const handleChangeTitle = (e) => {
        setDataVideo((prev) => ({
            ...prev,
            title: e.target.value,
        }));
    };

    const handleClearTitle = () => {
        setDataVideo((prev) => ({
            ...prev,
            title: '',
        }));
    };

    const isValidVideo = (file) => {
        return file && file.type.startsWith('video/');
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const uploadVideo = async (videoFile) => {
        setIsUploading(true);

        if (videoFile.size <= 500 * 1024 * 1024) {
            const uploadRes = await VideoServices.uploadVideo(videoFile);

            if (uploadRes.code === 'OK' || uploadRes.code === 'NONE_UPLOAD') {
                const { data } = uploadRes;
                const orientation = getVideoOrientation(data.width, data.height);
                setVideoOrientation(orientation);
                setDataVideo((prev) => ({
                    ...prev,
                    ...data,
                    title: videoFile.name.split('.')[0],
                }));
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
            }
        } else {
            toast.error('Video không được vượt quá 500MB!');
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
                toast.error('Vui lòng chọn một file video hợp lệ.');
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
            toast.error('Vui lòng chọn một file video hợp lệ.');
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        const { music } = dataVideo;
        console.log(dataVideo);
        const saveRes = await VideoServices.saveVideo({
            ...dataVideo,
            publisherId: user.tiktokId,
            music: music || 'nhạc nền - ' + user.nickname,
        });
        if (saveRes.code === 'OK') {
            setDataVideo(null);
        } else if (saveRes.code === 'DUPLICATE_VIDEO') {
            toast.warning('Bạn đã đăng video này rồi!');
        } else {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
        }
        setPublishing(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('upload-wrapper')}>
                {isUploading ? (
                    <div className={cx('uploading-container')}>
                        <h3 className={cx('uploading-title')}>Đang tải video lên</h3>
                        <ReactLoading type="balls" color="gray" height={8} width={30} />
                    </div>
                ) : dataVideo?.hls_url ? (
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
            <div className={cx('action', (!dataVideo?.hls_url || publishing) && 'no-btn-change')}>
                {dataVideo?.hls_url && !publishing && (
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
                            value={dataVideo?.title || ''}
                            placeholder=""
                            disabled={!dataVideo?.hls_url || publishing}
                            onChange={handleChangeTitle}
                        />
                        <button className={cx('btn-clear')} onClick={handleClearTitle}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <label className={cx('label')}>Tiêu đề</label>
                    </div>
                    <Button
                        bgPrimary
                        disable={!dataVideo?.hls_url || publishing}
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
