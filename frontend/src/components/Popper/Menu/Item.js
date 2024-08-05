import Button from '~/components/Button';

function Item({ item, onClick, className }) {
    const { icon, title, hasSwitchButton } = item;

    let props = {};
    if (hasSwitchButton) {
        props.hasSwitchButton = hasSwitchButton;
    }

    return (
        <Button className={className} leftIcon={icon} noneStyleButton {...props} onClick={onClick}>
            {title}
        </Button>
    );
}

export default Item;
