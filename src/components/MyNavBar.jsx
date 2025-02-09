import "./MyNavBar.less";
import { NavBar } from "antd-mobile";
import PropTypes from "prop-types";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const MyNavBar = function (props) {
  const { title } = props;
  const navigate = useNavigate(),
    location = useLocation(),
    [usp] = useSearchParams();
  const handleBlack = () => {
    // 特殊:登录页 & to的值是/deatil/xxx
    let to = usp.get("to");
    if (location.pathname === "/login" && /^\/detail\/\d+$/.test(to)) {
      navigate(to, { replace: true });
      return;
    }
    navigate(-1);
  };
  return <NavBar onBack={handleBlack}>{title}</NavBar>;
};
MyNavBar.defaultProps = {
  title: "个人中心",
};
MyNavBar.propTypes = {
  title: PropTypes.string,
};
export default MyNavBar;
