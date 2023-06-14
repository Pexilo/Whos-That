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
      response: string;
    };
  };
  events: {
    ready: Object;
  };
}
