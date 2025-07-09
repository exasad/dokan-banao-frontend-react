import {
  CheckCircleTwoTone,
  HeartTwoTone,
  SmileTwoTone,
} from '@ant-design/icons';

const TowToneIcon = () => {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <SmileTwoTone />
      <HeartTwoTone twoToneColor='#eb2f96' />
      <CheckCircleTwoTone twoToneColor='#52c41a' />
    </div>
  );
};

export default TowToneIcon;
