export const manageFeedback = ({ productId, inbox, feedbackId }) =>
  `/manage/${productId}/inbox${inbox ? `/${inbox}` : ''}/${feedbackId}`;
