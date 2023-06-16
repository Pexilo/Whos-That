export default interface ITranslations {
  commands: {
    language: {
      response: string;
    };
    setup: {
      processed: string;
      done: string;
    };
    ping: {
      title: string;
      fields: [
        {
          name: string;
          value: string;
        }
      ];
    };
    whosthat: {
      noPickableUsers: string;
      response: string;
    };
  };
  events: {
    clientMissingPermissions: {
      response: string;
    };
    userMissingPermissions: {
      response: string;
    };
  };
  interactions: {
    whosThatMsgBtns: {
      refreshResponse: string;
      fetchMsgErr: string;
      fetchWTCErr: string;
      title: string;
      placeholder: string;
      label: string;
      response: string;
    };
    whosThatSelect: {
      fetchSourceErr: string;
      fetchMsgErr: string;
      alreadyResponded: string;
      rightAnswerRes: string;
      wrongAnswerRes: string;
    };
  };
  utils: {
    fetchMessages: {
      pocessing: string;
    };
    generateImage: {
      user: string;
      dateSpace: number;
    };
    generateLeaderboard: {
      fetchUserErr: string;
      st: string;
      nd: string;
      rd: string;
      th: string;
      point: string;
      points: string;
      author: string;
      footer: string;
    };
    generateSelectUsers: {
      placeholder: string;
      response: string;
    };
    sender: {
      noDataErr: string;
      fetchChannelErr: string;
      title: string;
      description: string;
      footer: string;
    };
  };
}
