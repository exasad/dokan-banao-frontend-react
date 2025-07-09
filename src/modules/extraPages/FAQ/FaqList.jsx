import PropTypes from "prop-types";

import { Collapse } from "antd";
import { StyledFaqList } from "./index.styled";

const callback=(key)=> {
  console.log(key);
}

const FaqList = ({ faqList }) => {
  return (
    <StyledFaqList>
      <Collapse
        defaultActiveKey={faqList[0].id}
        onChange={callback}
        items={faqList.map((item) => {
          return {
            key: item.id,
            label: item.ques,
            children: <p>{item.ans}</p>,
          };
        })}
      />
    </StyledFaqList>
  );
};

export default FaqList;

FaqList.propTypes = {
  faqList: PropTypes.array.isRequired,
};
