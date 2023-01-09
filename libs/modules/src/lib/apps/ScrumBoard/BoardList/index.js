import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddNewBoard from './AddNewBoard';
import IntlMessages from '@crema/helpers/IntlMessages';
import BoardItem from './BoardItem';
import AddBoardButton from './AddBoardButton';
import AppInfoView from '@crema/components/AppInfoView';
import { Col } from 'antd';
import {
  StyledScrumBoardContainer,
  StyledScrumBoardHeader,
  StyledScrumBoardWrap,
} from './index.styled';
import { postDataApi, putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/InfoViewContextProvider';

const BoardList = () => {
  const navigate = useNavigate();
  const infoViewActionsContext = useInfoViewActionsContext();

  const [{ apiData: boardList }, { setData }] = useGetDataApi(
    '/api/scrumboard/board/list',
    [],
  );

  const [selectedBoard, setSelectedBoard] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

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
      putDataApi('/api/scrumboard/edit/board', infoViewActionsContext, {
        board,
      })
        .then(() => {
          infoViewActionsContext.showMessage('Board Edited Successfully!');
        })
        .catch((error) => {
          infoViewActionsContext.fetchError(error.message);
        });
    } else {
      postDataApi('/api/scrumboard/add/board', infoViewActionsContext, {
        board: { name },
      })
        .then((data) => {
          setData(data);
          infoViewActionsContext.showMessage('Board Added Successfully!');
        })
        .catch((error) => {
          infoViewActionsContext.fetchError(error.message);
        });
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
