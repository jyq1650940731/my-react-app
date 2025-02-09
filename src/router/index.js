import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Mask, DotLoading, Toast } from 'antd-mobile';
import routes from "./routes";
import _ from "@/assets/utils";
import store from '@/store';
import action from "../store/action";

const isChackLogin = (path) => {
    let { base: { info } } = store.getState(),
        checkList = ['/personal', '/store', '/update'];
    return !info && checkList.includes(path);
}
// 统一路由配置
const Element = function (props) {
    const { component: Component, meta, path } = props
    const navigate = useNavigate(),
        location = useLocation(),
        params = useParams(),
        [usp] = useSearchParams();
    const [_, setRandom] = useState(0);
    const isShow = !isChackLogin(path);
    const { title = "Webapp" } = meta || {};
    document.title = title;

    useEffect(() => {
        console.log(isShow);

        if (isShow) return;

        (async () => {
            const infoAction = await action.base.queryUserInfoAsync();
            const info = infoAction.info;
            if (!info) {
                // 如果获取后还是不存在:没有登录
                Toast.show({
                    icon: 'fail',
                    content: '请先登录'
                })
                // 跳转到登录页
                navigate({
                    pathname: '/login',
                    search: `?to=${path}`
                }, { replace: true });
                return
            }
            store.dispatch(infoAction);
            setRandom(+new Date())
        })()
    })


    return <>{
        isShow ?
            <Component navigate={navigate} location={location} params={params} usp={usp}></Component>
            : <Mask visible={true}>
                <DotLoading color="white" />
            </Mask>
    }</>
}
export default function RouterView() {
    return <Suspense fallback={<Mask visible={true} opacity="thick"></Mask>}>
        <Routes>
            {routes.map((item => {
                return <Route key={item.name} path={item.path} element={
                    <Element {...item}></Element>
                }></Route>
            }))}
        </Routes>
    </Suspense>
}