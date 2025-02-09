import React, { useState, useEffect } from "react";
import { Form, Input, Toast } from "antd-mobile";
import { connect } from "react-redux";
import "./index.less";
import api from "@/api";
import _ from "@/assets/utils";
import MyNavBar from "./../../components/MyNavBar";
import MyButton from "@/components/MyButton";
import action from "@/store/action";

/* 自定义表单校验规则 */
const validate = {
  phone: (_, value) => {
    value = value.trim();
    if (!value) return Promise.reject(new Error("手机号不能为空"));
    const phoneReg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (!phoneReg.test(value))
      return Promise.reject(new Error("手机号格式错误"));
    return Promise.resolve();
  },
  code: (_, value) => {
    value = value.trim();
    if (!value) return Promise.reject(new Error("验证码是必填项"));
    const phoneReg = /^\d{6}$/;
    if (!phoneReg.test(value))
      return Promise.reject(new Error("验证码格式有误"));
    return Promise.resolve();
  },
};
const Login = function Login(props) {
  const [formIns] = Form.useForm();

  const [isDisabled, setIsDisabled] = useState(false);
  const [sendText, setSendText] = useState("发送验证码");
  const { queryUserInfoAsync, navigate, usp } = props;
  let timer = null;
  let num = 31;
  const countdown = () => {
    num--;
    if (num === 0) {
      clearInterval(timer);
      timer = null;
      setSendText("发送验证码");
      setIsDisabled(false);
      return;
    }
    setSendText(`${num}秒后重发`);
  };
  const submit = async () => {
    try {
      await formIns.validateFields();
      const { phone, code } = formIns.getFieldValue();
      const { code: codeHttp, token } = await api.login(phone, code);
      if (+codeHttp !== 0) {
        Toast.show({
          icon: "fail",
          content: "登录失败",
        });
        formIns.resetFields(["code"]);
        return;
      }
      _.storage.set("token", token);
      await queryUserInfoAsync();
      Toast.show({
        icon: "success",
        content: "登录成功",
      });
      const to = usp.get("to");
      to ? navigate(to, { replace: true }) : navigate(-1);
    } catch (e) {
      console.log(e);
    }
  };
  const send = async () => {
    try {
      await formIns.validateFields(["phone"]);
      const phone = formIns.getFieldValue("phone");
      const { code } = await api.sendPhoneCode(phone);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "发送失败",
        });
        return;
      }
      setIsDisabled(true);
      countdown();
      timer = setInterval(countdown, 1000);
    } catch (e) {}
  };
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return (
    <div className="login-box">
      <MyNavBar title="登录/注册" />
      <Form
        layout="horizontal"
        style={{ "--border-top": "none" }}
        initialValues={{ phone: "", code: "" }}
        form={formIns}
        footer={
          <MyButton color="primary" onClick={submit}>
            提交
          </MyButton>
        }
      >
        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ validator: validate.phone }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          rules={[{ validator: validate.code }]}
          extra={
            <MyButton
              size="small"
              color="primary"
              onClick={send}
              disabled={isDisabled}
            >
              {sendText}
            </MyButton>
          }
        >
          <Input placeholder="请输入验证码" />
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(null, action.base)(Login);
