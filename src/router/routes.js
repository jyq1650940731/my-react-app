import Home from '../views/Home'
import { lazy } from 'react';
import Detail from '../views/Detail'
import Login from '../views/Login/index.jsx'
import { withKeepAlive } from 'keepalive-react-component/lib/index.js';
const routes = [
    {
        path: '/',
        name: 'home',
        component: withKeepAlive(Home, { cacheId: 'home', scroll: true }),
        mate: {
            title: '首页'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        mate: {
            title: '登录'
        }
    },
    {
        path: '/store',
        name: 'store',
        component: lazy(() => import('../views/Store')),
        meta: {
            title: '我的收藏-知乎日报'
        }
    },
    {
        path: '/update',
        name: 'update',
        component: lazy(() => import('../views/Update')),
        meta: {
            title: '修改个人信息-知乎日报'
        }
    },
    {
        path: '/personal',
        name: 'personal',
        component: lazy(() => import('@/views/Personal')),
        meta: {
            title: '个人中心-知乎日报'
        }
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: Detail,
        mate: {
            title: '详情页'
        }
    }
]
export default routes