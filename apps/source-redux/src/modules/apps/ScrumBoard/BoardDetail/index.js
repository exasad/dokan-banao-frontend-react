import React, { useEffect } from 'react';
import AppsContainer from '@crema/components/AppsContainer';
import BoardDetailView from './BoardDetailView';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledScrumBoardDetailTitle } from './index.styled';
import {
  onGetBoardDetail,
  onNullifyBoardDetail,
} from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const BoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const boardDetail = useSelector(
    ({ scrumboardApp }) => scrumboardApp.boardDetail,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetBoardDetail(id));
    return () => {
      dispatch(onNullifyBoardDetail());
    };
  }, [dispatch, id]);

  const onGoToBoardList = () => {
    navigate(-1);
  };

  if (!boardDetail) {
    return null;
  }

  return (
    <AppsContainer
      fullView
      noContentAnimation
      title={
        <>
          <StyledScrumBoardDetailTitle onClick={onGoToBoardList}>
            Scrum Board
          </StyledScrumBoardDetailTitle>
          &gt; {boardDetail?.name}
        </>
      }
    >
      <BoardDetailView boardDetail={boardDetail} />
    </AppsContainer>
  );
};

export default BoardDetail;
