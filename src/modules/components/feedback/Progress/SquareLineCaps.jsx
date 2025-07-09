import { Progress } from 'antd';

const SquareLineCaps = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Progress strokeLinecap='square' percent={75} />
      <Progress strokeLinecap='square' type='circle' percent={75} />
      <Progress strokeLinecap='square' type='dashboard' percent={75} />
    </div>
  );
};

export default SquareLineCaps;
