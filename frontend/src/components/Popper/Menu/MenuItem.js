import PropTypes from 'prop-types';
import Button from '~/components/Button';

function MenuItem({ item, onClick, className }) {
    const { icon, title, hasSwitchButton } = item;

    let props = {};
    if (hasSwitchButton) {
        props.hasSwitchButton = hasSwitchButton;
    }

    return (
        <Button className={className} size="large" leftIcon={icon} noneStyleButton {...props} onClick={onClick}>
            {title}
        </Button>
    );
}

MenuItem.propTypes = {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default MenuItem;
