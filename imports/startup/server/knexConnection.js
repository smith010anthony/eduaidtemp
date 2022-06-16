// const config = {
//   client: 'pg',
//   connection: {
//     host: 'eduaid-prod-playstore.cmzvhbahry6x.ap-south-1.rds.amazonaws.com',
//     port: 30011,
//     database: 'eduaidplay',
//     user: 'postgresmastereduaid',
//     password: 'YDSbGLzrD0GS2cKMRtNdMD5ZuzjtE34AAthdLc3X54mXlMJSS',
//   },
// };

const config = {
  client: 'pg',
  connection: {
    host: 'eduaid-prod-playstore.cmzvhbahry6x.ap-south-1.rds.amazonaws.com',
    port: 30011,
    database: 'eduaidplay',
    user: 'postgresmastereduaid',
    password: 'YDSbGLzrD0GS2cKMRtNdMD5ZuzjtE34AAthdLc3X54mXlMJSS',
  },
};

// const config = {
//   client: 'pg',
//   connection: {
//     host: 'localhost',
//     port: 5433,
//     database: 'postgres',
//     user: 'liveclass',
//     password: 'adminpk',
//   },
// };

const KnexConnection = require('knex')(config);

export default KnexConnection;
