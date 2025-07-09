import { StyledHeaderAlertDark } from './index.styled';

const NotificationBar=()=> {
  const onClose = () => {
    console.log('I was closed.');
  };

  return (
    <StyledHeaderAlertDark
      message=' Get flat 60% off on your first purchase'
      type='warning'
      closable
      onClose={onClose}
    />
  );
}
export default NotificationBar;
