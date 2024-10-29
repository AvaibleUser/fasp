export const webServices = {
  credit: {
    url: process.env.CREDIT,
    endpoints: {
      link: {
        uri: '/api/token-linked-api/link-account',
        body: {
          pin: '1234',
        },
      },
    },
  },
  bank: {
    url: process.env.DEBIT,
    endpoints: {
      link: {
        uri: '/api/tarjetas/vincular',
        body: {
          pin: '1122',
        },
      },
    },
  },
  store: [process.env.STORE1, process.env.STORE2] as [string, string],
};
