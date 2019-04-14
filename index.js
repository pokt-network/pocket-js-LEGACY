module.exports = Object.assign(
                                module.exports, 
                                {
                                    PocketJSCore: require('pocket-js-core')
                                },
                                {
                                    PocketJSEth: require('pocket-js-eth')
                                },
                                {
                                    PocketJSAion: require('pocket-js-aion')
                                },
                                {
                                    PocketJSWeb3Provider: require('pocket-js-web3-provider')
                                }
                            );
