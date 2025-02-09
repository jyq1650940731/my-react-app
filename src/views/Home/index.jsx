import { useState, useEffect, useRef } from "react";
import HomeHead from "@/components/HomeHead/HomeHead";
import NewsItem from "@/components/NewsItem";
import MySkeletion from "@/components/MySkeletion";
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import { Link } from "react-router-dom";
import api from "@/api";
import _ from "@/assets/utils";
import "./home.less";

const Home = function () {
  const [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}"));
  const [bannerData, setBannerData] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const loadMore = useRef();

  useEffect(() => {
    (async () => {
      try {
        const { date, stories, top_stories } = await api.queryNewsLatest();
        setToday(date);
        setBannerData(top_stories);
        newsList.push({
          date,
          stories,
        });
        setNewsList([...newsList]);
      } catch (err) {}
    })();
  }, []);
  //
  useEffect(() => {
    const ob = new IntersectionObserver(async (changes) => {
      const { isIntersecting } = changes[0];
      if (isIntersecting) {
        //触底显示
        try {
          const time = newsList[newsList.length - 1]["date"];
          const nextNewsList = await api.queryNewsBefore(time);
          newsList.push(nextNewsList);
          setNewsList([...newsList]);
        } catch (e) {}
      }
    });
    const loadMoreDom = loadMore.current;
    ob.observe(loadMore.current);
    return () => {
      ob.unobserve(loadMoreDom);
    };
  }, []);
  return (
    <div className="home-container">
      <HomeHead today={today}></HomeHead>
      {/* 轮播图 */}
      <div className="swiper-box">
        {bannerData.length > 0 ? (
          <Swiper autoplay={true} loop={true}>
            {bannerData.map((item) => {
              return (
                <Swiper.Item key={item.id}>
                  <Link
                    to={{
                      pathname: `/detail/${item.id}`,
                    }}
                  >
                    <Image src={item.image} lazy />
                    <div className="desc">
                      <h3 className="title">{item.title}</h3>
                      <p className="author">{item.hint}</p>
                    </div>
                  </Link>
                </Swiper.Item>
              );
            })}
          </Swiper>
        ) : null}
      </div>
      {/* 新闻列表 */}
      {newsList.length === 0 ? (
        <MySkeletion />
      ) : (
        <>
          {newsList.map((item, index) => {
            let { date, stories } = item;
            return (
              <div className="news-box" key={date}>
                {index !== 0 ? (
                  <Divider contentPosition="left">
                    {_.formatTime(date, "{1}月{2}日")}
                  </Divider>
                ) : null}
                <div className="list">
                  {stories.map((cur) => {
                    return <NewsItem key={cur.id} info={cur} />;
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
      {/* 加载更多 */}
      <div
        className="loadmore-box"
        ref={loadMore}
        style={{
          display: newsList.length === 0 ? "none" : "block",
        }}
      >
        <DotLoading />
        数据加载中
      </div>
    </div>
  );
};
export default Home;
