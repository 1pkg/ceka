module.exports = {
    compilers: {
        solc: {
            version: '0.5.7',
            docker: false, // Use a version obtained through docker
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1,
                },
            },
        },
    },
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
        },
    },
}
