import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';
import images from '~/assets/images';

const cx = classNames.bind(styles);

const Image = forwardRef(({ src, alt, size, customFallBack = images.error, className }, ref) => {
    const [fallBack, setFallBack] = useState('');

    const handleError = () => {
        setFallBack(customFallBack);
    };

    return (
        <img
            ref={ref}
            src={fallBack || src}
            alt={alt}
            className={cx('image', className)}
            width={size}
            height={size}
            onError={handleError}
        />
    );
});

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    customFallBack: PropTypes.string,
    className: PropTypes.string,
};

export default Image;
