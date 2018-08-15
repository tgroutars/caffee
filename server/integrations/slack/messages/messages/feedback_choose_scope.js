module.exports = ({
  productId,
  files,
  defaultFeedback,
  defaultAuthorId,
  defaultAuthorName,
  scopes,
  level = 0,
  defaultScopeId = null,
}) => {
  const pretext = `What ${
    level > 0 ? 'sub' : ''
  }scope does your feedback concern?`;
  const scopesOptions = scopes.map(scope => ({
    text: scope.name,
    value: scope.id,
  }));
  const options = [{ value: 'default', text: `Other` }, ...scopesOptions];

  const actions = [
    {
      type: 'select',
      text: 'Scope',
      name: {
        productId,
        files,
        defaultAuthorId,
        defaultAuthorName,
        defaultFeedback,
        defaultScopeId,
        level,
        type: 'feedback_choose_scope',
      },
      options,
    },
  ];

  return {
    attachments: [
      {
        pretext,
        actions,
        callback_id: 'feedback_choose_scope',
      },
    ],
  };
};
