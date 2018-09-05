import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import moment from 'moment';

const FeedbackCommentDiv = styled.div`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.05);
  white-space: pre-wrap;
`;
const Author = styled.div`
  font-size: 16px;
  font-weight: bold;
  .ant-avatar {
    margin-right: 6px;
  }
`;
const Description = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;
const Attachments = styled.div`
  display: flex;
  overflow-x: scroll;
  height: 100px;
  margin-top: 8px;
`;
const Attachment = styled.a`
  display: block;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  margin: 0 10px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  img {
    height: 100%;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;
const AttachmentText = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  line-height: 100px;
`;
const Timestamp = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`;

const FeedbackComments = ({ feedback }) => {
  if (!feedback || !feedback.comments) {
    return null;
  }

  return feedback.comments.map(
    ({ id, author, text, attachments, createdAt }) => (
      <FeedbackCommentDiv key={id}>
        <Author>
          <Avatar size="small" src={author.image} />
          {author.name}
          <Timestamp> - {moment(createdAt).fromNow()}</Timestamp>
        </Author>
        <Description>{text}</Description>
        {attachments.length ? (
          <Attachments>
            {attachments.map(({ key, url, mimetype }) => (
              <Attachment key={key} href={url} target="blank">
                {mimetype && mimetype.startsWith('image/') ? (
                  <img src={url} alt="" />
                ) : (
                  <AttachmentText>No preview</AttachmentText>
                )}
              </Attachment>
            ))}
          </Attachments>
        ) : null}
      </FeedbackCommentDiv>
    ),
  );
};

export default FeedbackComments;
