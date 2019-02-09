class Block {
    constructor(data) {
        this.hash = '',
            this.height = '',
            this.body = data,
            this.time = '',
            this.previousBlockHash = ''
    }
}

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindataB';
let db = level(chainDB, { valueEncoding: 'json' });
class Blockchain {
    constructor() {
        try {
            let asyncWrapperForSuper = async () => {
              
                await this.getBlockHeight().then(async (initHeight) => {
                    if (initHeight <= 0) {
                        this.addBlock(await new Block("First block in the chain - Genesis block"));
                    }
                }).catch((error) => { console.log(error + " in blockchain constructor") });

            }
            asyncWrapperForSuper();
        } catch (error) { }

    }

    // Add new block
    async addBlock(newBlock) {
        try {
            let height = parseInt(await this.getBlockHeight());
            newBlock.height = height;
            newBlock.time = new Date().getTime().toString().slice(0, -3);

            if (newBlock.height > 0) {

                let previousBlockHeight = newBlock.height - 1;
                let previousBlock = JSON.parse(await this.getBlock(previousBlockHeight));
                newBlock.previousBlockHash = previousBlock.hash;
            }
            else newBlock.previousBlockHash = "";
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            // console.log("The Block  " + JSON.stringify(newBlock) + " is added");
            db.put(newBlock.height, JSON.stringify(newBlock));
            return 'done';
        } catch (error) {
            //console.log(error + " in add block");
        }
    }
    // Get block height
    async getBlockHeight() {
        try {
            let h = await this.getBlockHeight1();
            return h;
        } catch (error) {

        }
    }
    getBlockHeight1() {
        
        return new Promise(function (resolve, reject) {
            let height = 0;
            db.createReadStream().on('data', function (data) {

                height++
            })
                .on('error', function (err) {

                    console.log('Ops! Error found! ', err);
                    reject(err);
                })
                .on('end', function () {

                    resolve(parseInt(height));
                });
        });
    }

    async getBlock(blockHeight) {
        try {
            let nb = await this.getBlock1(blockHeight);
            return nb;
        } catch (error) {
            // console.log(error + " in getblock");
        }
    }
    async getBlock2(blockHeight) {
        try {
            let nb = await this.getBlock1(blockHeight);
            return '';
        } catch (error) {
            //console.log(error + " get block2");
        }
    }
    getBlock1(blockHeight) {

        let key = blockHeight;
       
        return new Promise((resolve, reject) => {
            db.get(key, (error, value) => {
                if (error) {
                    reject(error)
                }
                resolve(value)
            });
        })
    }
    async getBlockHeight2() {
        try {
            let h = await this.getBlockHeight1();
            return '';
        } catch (error) {
            // console.log(error + " in get block height 2");
        }
    }

    async validateBlock(blockHeight) {
        try {
            // get block object
            let gb = await this.getBlock(blockHeight);
            let gb1 = await this.validateBlock1(gb);

        } catch (error) {
            // console.log(error + " error in validateBlock");
        }
    }

    validateBlock1(value) {
        return new Promise((resolve, reject) => {
            // get block hash
            let block1 = JSON.parse(value);
            let blockHash = block1.hash;
            let blockHeight = block1.height;
            // remove block hash to test block integrity
            block1.hash = '';
            // generate block hash
            let validBlockHash = SHA256(JSON.stringify(block1)).toString();
            // Compare
            if (blockHash === validBlockHash) {
                return true;
            } else {
                return false;
            }
        }
        ).catch((error) => {
            return reject(error, 'Promise error');
        });
    }
    // Validate blockchain
    async  validateChain() {
        try {
            let errorLog = [];
            let height = parseInt(await this.getBlockHeight());
            for (let i = 0; i < height - 1; i++) {
                // validate block
                if (!this.validateBlock(i)) errorLog.push(i);
                // compare blocks hash link
                let gb = await this.getBlock(i);
                let block1 = JSON.parse(gb);
                let blockHash = block1.hash;

                let gb2 = await this.getBlock(i + 1);
                let block2 = JSON.parse(gb2);

                let previousHash = block2.previousBlockHash;
                if (blockHash !== previousHash) {
                    errorLog.push(i);
                }
            }
            if (errorLog.length > 0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: ' + errorLog);
            } else {
                console.log('No errors detected');
            }
        } catch (error) {
            //console.log(error + " in validatechain")
        }
    }
    // Get block by hash
    async getBlockByHash(hash) {
        let block
        return new Promise((resolve, reject) => {
            db.createReadStream().on('data', (data) => {
                block = JSON.parse(data.value)

                if (block.hash === hash) {
                    return resolve(block)
                }
            }).on('error', (error) => {
                return reject(error)
            }).on('close', () => {
                return reject('Not found')
            })
        }).catch((error) => {
            return reject(error, 'Promise error');
        });
    }
    // get block by address 
    async getBlocksByAddress(address) {
        let block
        let blockArray = []
        return new Promise((resolve, reject) => {
            db.createReadStream().on('data', (data) => {
                block = JSON.parse(data.value)
                if (block.body.address === address) {
                    blockArray.push(block)
                }

            }).on('error', (error) => {
                return reject(error)
            }).on('close', () => {
                return resolve(blockArray)
            })
        })
    }

}
module.exports = {
    Block: Block,
    Blockchain: Blockchain

}