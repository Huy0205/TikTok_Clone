import config from '~/config';
import Home from '~/pages/Home';
import Explore from '~/pages/Explore';
import Following from '~/pages/Following';
import Friends from '~/pages/Friends';
import Live from '~/pages/Live';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';
import { HeaderOnly } from '~/layouts';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.explore, component: Explore },
    { path: config.routes.following, component: Following },
    { path: config.routes.friends, component: Friends },
    { path: config.routes.live, component: Live },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
