import React, { useState } from "react";
import { Button } from "antd-mobile";

const MyButton = function (props) {
  console.log({ props });
  const options = { ...props };
  const { children, onClick: handle } = props;

  /* 状态 */
  let [loading, setLoading] = useState(false);

  const clickHandle = async () => {
    try {
      setLoading(true);
      await handle();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  if (handle) {
    options.onClick = clickHandle;
  }

  return (
    <Button {...options} loading={loading}>
      {children}
    </Button>
  );
};
export default MyButton;
