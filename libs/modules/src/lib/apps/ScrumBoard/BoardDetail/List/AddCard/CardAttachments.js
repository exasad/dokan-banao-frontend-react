import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import moment from 'moment';
import PropTypes from 'prop-types';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiCloudDownload } from 'react-icons/bi';
import AppIconButton from '@crema/components/AppIconButton';
import {
  StyledScrumBoardAttachment,
  StyledScrumBoardAttachmentAction,
  StyledScrumBoardAttachmentCard,
  StyledScrumBoardAttachmentContent,
  StyledScrumBoardAttachmentFileName,
  StyledScrumBoardAttachmentFileTime,
  StyledScrumBoardAttachmentImg,
  StyledScrumBoardAttachmentItems,
  StyledScrumBoardAttachmenTitle,
} from './index.styled';

const CardAttachments = (props) => {
  const { attachments, onDeleteAttachment } = props;

  return (
    <>
      {attachments && attachments.length > 0 ? (
        <>
          <StyledScrumBoardAttachmenTitle>
            <IntlMessages id='common.attachments' />
          </StyledScrumBoardAttachmenTitle>

          {attachments ? (
            <StyledScrumBoardAttachment>
              {attachments.map((attachment) => {
                const { file } = attachment;
                return (
                  <StyledScrumBoardAttachmentItems key={attachment.id}>
                    <StyledScrumBoardAttachmentCard>
                      <StyledScrumBoardAttachmentImg>
                        <img src={attachment.preview} alt='attachment' />

                        <StyledScrumBoardAttachmentAction className='scrum-board-attachment-items-action'>
                          <AppIconButton icon={<BiCloudDownload />} />
                          <AppIconButton
                            icon={<AiOutlineDelete />}
                            onClick={() => onDeleteAttachment(attachment.id)}
                          />
                        </StyledScrumBoardAttachmentAction>
                      </StyledScrumBoardAttachmentImg>

                      <StyledScrumBoardAttachmentContent>
                        <StyledScrumBoardAttachmentFileName className='text-truncate'>
                          {file.name}
                        </StyledScrumBoardAttachmentFileName>
                        <StyledScrumBoardAttachmentFileTime>
                          <span>
                            {
                              moment(file.lastModified)
                                .format('ll')
                                .split(',')[0]
                            }
                          </span>
                          <span>
                            <IntlMessages id='common.at' />
                          </span>
                          <span>{moment(file.lastModified).format('LT')}</span>
                        </StyledScrumBoardAttachmentFileTime>
                      </StyledScrumBoardAttachmentContent>
                    </StyledScrumBoardAttachmentCard>
                  </StyledScrumBoardAttachmentItems>
                );
              })}
            </StyledScrumBoardAttachment>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default CardAttachments;

CardAttachments.defaultProps = {
  attachments: [],
};

CardAttachments.propTypes = {
  attachments: PropTypes.array,
  onDeleteAttachment: PropTypes.func,
};
