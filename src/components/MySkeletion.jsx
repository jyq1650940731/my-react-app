import { Skeleton } from "antd-mobile";
const MySkeletion = function () {
  return (
    <div className="my-skeletion">
      <Skeleton.Title animated></Skeleton.Title>;
      <Skeleton.Paragraph lineCount={5} animated></Skeleton.Paragraph>
    </div>
  );
};
export default MySkeletion;
