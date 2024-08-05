import { memo } from 'react';
import classNames from 'classnames';

import styles from './SearchResult.module.scss';
import AccountItem from '~/components/AccountItem';
import Button from '~/components/Button';

function Accounts({ accounts }) {
    return (
        <div className={classNames(styles['wrapper-accounts'])}>
            {accounts.map((account) => (
                <Button
                    key={account.tiktokId}
                    size="large"
                    noneStyleButton
                    className={classNames(styles['account-item'])}
                    to={`/@${account.nickname}`}
                >
                    <AccountItem account={account} />
                </Button>
            ))}
        </div>
    );
}

export default memo(Accounts);
