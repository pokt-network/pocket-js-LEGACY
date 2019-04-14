module.exports = Object.assign(
                                module.exports, 
                                {
                                    PocketJSCore: require('./packages/core')
                                },
                                {
                                    PocketJSEth: require('./packages/eth')
                                },
                                {
                                    PocketJSAion: require('./packages/aion')
                                },
                                {
                                    PocketJSWeb3Provider: require('./packages/web3-provider')
                                }
                            );
