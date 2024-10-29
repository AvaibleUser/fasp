export const webServices = {
  credit: {
    host: process.env.BANK,
    endpoints: {
      link: {
        uri: '/api/token-linked-api/link-account',
        body: {
          pin: '1234',
        },
      },
      reduce: '/api/bank-account/update-balance',
      add: '/api/bank-account/update-balance',
    },
  },
  bank: {
    host: process.env.CREDIT,
    endpoints: {
      link: {
        uri: '/api/tarjetas/vincular',
        body: {
          pin: '1122',
        },
      },
      reduce: '/api/saldo/reducir-saldo',
      add: '/api/saldo/agregar-saldo',
    },
  },
  store: [process.env.STORE1, process.env.STORE2] as [string, string],
};
