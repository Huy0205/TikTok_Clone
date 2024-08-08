import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './DefaultLayout.module.scss';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function DefaultLayout({ children }) {
    return (
        <div className={classNames(styles.wrapper)}>
            <Header />
            <div className={classNames(styles.container)}>
                <Sidebar />
                <div className={classNames(styles.content)}>{children}</div>
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
