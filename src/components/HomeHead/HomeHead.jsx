import timg from "@/assets/images/timg.jpg";
import "./HomeHead.less";
import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import action from "@/store/action";

const HomeHead = function (props) {
  const navigate = useNavigate();
  const { today, info, queryUserInfoAsync } = props;
  const time = useMemo(() => {
    let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/),
      area = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
    return {
      day,
      month: area[+month] + "月",
    };
  }, [today]);
  useEffect(() => {
    if (!info) queryUserInfoAsync();
  }, []);
  return (
    <header className="home-head-box">
      <div className="info">
        <div className="time">
          <span>{time.day}</span>
          <span>{time.month}</span>
        </div>
        <h2 className="title">知乎日报</h2>
      </div>

      <div
        className="picture"
        onClick={() => {
          navigate("/personal");
        }}
      >
        <img src={info ? info.pic : timg} alt="" />
      </div>
    </header>
  );
};

export default connect((state) => state.base, action.base)(HomeHead);
