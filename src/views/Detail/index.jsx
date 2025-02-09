import React, { useEffect, useMemo, useState } from "react";
import api from "@/api";
import "./index.less";
import {
  LeftOutline,
  MessageOutline,
  LikeOutline,
  StarOutline,
  MoreOutline,
} from "antd-mobile-icons";
import { Badge, Toast } from "antd-mobile";
import MySkeletion from "@/components/MySkeletion";
import { flushSync } from "react-dom";
import { connect } from "react-redux";
import action from "@/store/action";

const Detail = function (props) {
  const { navigate, params } = props;
  const [info, setInfo] = useState(null);
  const [extra, setExtra] = useState(null);
  const cssLabel = document.createElement("link");
  useEffect(() => {
    (async () => {
      const res = await api.queryStoryExtra(params.id);
      setExtra(res);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.queryNewsInfo(params.id);
        flushSync(() => {
          setInfo(res?.body);
          handlePageStyle(res);
        });
        handleImage(res);
      } catch (e) {}
    })();
    return () => {
      document.head.removeChild(cssLabel);
    };
  }, []);
  const handlePageStyle = (res) => {
    const { css } = res;
    if (!Array.isArray(css) || !css) return;
    const cssLink = css[0];
    cssLabel.rel = "stylesheet";
    cssLabel.href = cssLink;
    document.head.appendChild(cssLabel);
  };
  const handleImage = (res) => {
    const imgPlaceHolder = document.querySelector(".img-place-holder");
    if (!imgPlaceHolder) return;
    const { image } = res;
    const tempImg = new Image();
    tempImg.src = image;
    tempImg.onload = () => {
      imgPlaceHolder.appendChild(tempImg);
    };
    tempImg.onerror = () => {
      const parent = imgPlaceHolder.parentNode;
      parent.parentNode.removeChild(parent);
    };
  };
  let {
    base: { info: userInfo },
    queryUserInfoAsync,
    location,
    store: { list: storeList },
    queryStoreListAsync,
    removeStoreListById,
  } = props;
  useEffect(() => {
    (async () => {
      if (!userInfo) {
        let { info } = await queryUserInfoAsync();
        userInfo = info;
      }
      // 如果已经登录 && 没有收藏列表信息:派发任务同步收藏列表
      if (userInfo && !storeList) {
        queryStoreListAsync();
      }
    })();
  }, []);

  const isStore = useMemo(() => {
    if (!storeList) return false;
    return storeList.some((item) => +item.news.id === +params.id);
  }, [storeList, params]);
  const handleStore = async () => {
    if (!userInfo) {
      // 未登录
      Toast.show({
        icon: "fail",
        content: "请先登录",
      });
      navigate(`/login?to=${location.pathname}`, { replace: true });
      return;
    }
    // 移除
    if (isStore) {
      const item = storeList.find((item) => +item.news.id === +params.id);
      if (!item) return;
      let { code } = await api.storeRemove(item.id);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "操作失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "操作成功",
      });
      removeStoreListById(item.id); //告诉redux中也把这一项移除掉
      return;
    }
    //收藏
    try {
      const { code } = await api.store(params.id);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "收藏失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "收藏成功",
      });
      queryStoreListAsync(); //同步最新的收藏列表到redux容器中
    } catch (e) {}
  };
  return (
    <div className="detail-box">
      {!info ? (
        <MySkeletion></MySkeletion>
      ) : (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: info }}
        ></div>
      )}
      {/* 底部图标 */}
      <div className="tab-bar">
        <div
          className="back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <LeftOutline />
        </div>
        <div className="icons">
          <Badge content={extra ? extra.comments : 0}>
            <MessageOutline />
          </Badge>
          <Badge content={extra ? extra.popularity : 0}>
            <LikeOutline />
          </Badge>
          <span className={isStore ? "stored" : ""} onClick={handleStore}>
            <StarOutline />
          </span>
          <span>
            <MoreOutline />
          </span>
        </div>
      </div>
    </div>
  );
};
export default connect(
  (state) => {
    return { base: state.base, store: state.store };
  },
  { ...action.base, ...action.store }
)(Detail);
