import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntlMessages from '@crema/helpers/IntlMessages';
import AppInfoView from '@crema/components/AppInfoView';
import { Col } from 'antd';
import {
  StyledScrumBoardContainer,
  StyledScrumBoardHeader,
  StyledScrumBoardWrap,
} from './index.styled';

import {
  AddBoardButton,
  AddNewBoard,
  BoardItem,
} from '@crema/modules/apps/ScrumBoard';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAddNewBoard,
  onEditBoardDetail,
  onGetBoardList,
} from '../../../../toolkit/actions';

const BoardList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boardList = useSelector(({ scrumboardApp }) => scrumboardApp.boardList);

  const [selectedBoard, setSelectedBoard] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(onGetBoardList());
  }, [dispatch]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const onEditButtonClick = (board) => {
    setSelectedBoard(board);
    setIsModalVisible(true);
  };

  const onAddBoard = (name) => {
    if (selectedBoard) {
      const board = { ...selectedBoard, name };
      dispatch(onEditBoardDetail(board));
    } else {
      dispatch(onAddNewBoard({ name }));
    }
  };

  const onViewBoardDetail = (board) => {
    navigate(`/apps/scrum-board/${board.id}`);
  };

  const showModal = () => {
    setSelectedBoard(null);
    setIsModalVisible(true);
  };

  return (
    <>
      <StyledScrumBoardWrap>
        <StyledScrumBoardHeader>
          <h2>
            <IntlMessages id='scrumboard.scrumboardApp' />
          </h2>
        </StyledScrumBoardHeader>
        <StyledScrumBoardContainer>
          {boardList && boardList.length > 0
            ? boardList.map((board) => {
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
                    <BoardItem
                      board={board}
                      onEditButtonClick={onEditButtonClick}
                      onViewBoardDetail={onViewBoardDetail}
                    />
                  </Col>
                );
              })
            : null}
          <Col xs={24} sm={12} md={8} lg={6}>
            <AddBoardButton onAddButtonClick={showModal} />
          </Col>
        </StyledScrumBoardContainer>
      </StyledScrumBoardWrap>

      {isModalVisible ? (
        <AddNewBoard
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          onAddBoard={onAddBoard}
          handleOk={handleOk}
          selectedBoard={selectedBoard}
        />
      ) : null}
      <AppInfoView />
    </>
  );
};

export default BoardList;
