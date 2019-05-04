const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = {
    username: process.env.FTPUSERNAME,
    password: process.env.FTPPASS,
    host: process.env.FTPHOST,
    port: 21,
    localRoot: __dirname + '/../web/',
    remoteRoot: '/beta/',
    include: ['*'],
};

ftpDeploy.deploy(config, error => {
    if (error) {
        console.log('error', error);
        process.exit(1);
    } else {
        console.log('finished');
    }
});
