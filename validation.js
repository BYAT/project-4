const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './object/stars';
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
let timeB4FiveMin = Date.now() - (5 * 60 * 1000);
const db = level(chainDB, { valueEncoding: 'json' });
class validation {
    constructor(req) {
        
        this.req = req;
    }
    RequestedAddress(address) {
        return new Promise((resolve, reject)  => {
            db.get(address, (error, value) => {
                if (value === undefined) {
                    return reject(new Error('undefind'))
                } else if (error) {
                    return reject(error)
                }
                
                timeB4FiveMin = Date.now() - (5 * 60 * 1000);
                value = JSON.parse(value)
                let TimeoutRequestsWindowTime = timeB4FiveMin
                let isTimeFinshed = value.requestTimeStamp < TimeoutRequestsWindowTime

                let asyncWrapperForSuper = async () => {
                    if (isTimeFinshed) {
                        
                        return resolve(await this.AddRequestValidation(address))

                    } else {
                        

                        let object = await this.genrateReqObj(address, value)
                        
                        return resolve(object)
                    }
                    
                }
                asyncWrapperForSuper();
            })

        }).catch((error) => {
            return reject(error, 'Promise error');
        });
    }

    genrateReqObj(walletAddress, value) {
        timeB4FiveMin = Date.now() - (5 * 60 * 1000);
        let address = walletAddress
        let timestamp = value.requestTimeStamp
        let message = value.message
        let validationWindow = Math.floor((value.requestTimeStamp - timeB4FiveMin) / 1000)
        const object = {
            address: address,
            message: message,
            requestTimeStamp: timestamp,
            validationWindow: validationWindow
        }
        
        return object
    }
    AddRequestValidation(walletAddress) {
        try {
            
            let address = walletAddress
            let timestamp = Date.now()
            let message = walletAddress + ':' + timestamp + ':starRegistry'
            let validationWindow = 300
            const object = {
                address: address,
                message: message,
                requestTimeStamp: timestamp,
                validationWindow: validationWindow
            }  
            
            db.put(object.address, JSON.stringify(object))
            
            return object
        } catch (error) {
            return 'error'
        }
    }

    validateRequestByWallet(address, signature) {
        return new Promise((resolve, reject) => {
            db.get(address, (error, value) => {
                if (value === undefined) {
                    return reject(new Error('undefind'))
                } else if (error) {
                    return reject(error)
                }
               // let objAdd = await this.getObjectByAddress(address);
                        let objectaddress = JSON.parse(value);
                
                try {
                    let asyncWrapperForSuper = async () => {
                        
                        if (objectaddress.messageSignature === 'valid') {
                            
                            return resolve({
                                registerStar: true,
                                status: objectaddress
                            })
                            
                        } else {
                           let time_5 = Date.now() - (5 * 60 * 1000)
                            let isTimeFinshed = objectaddress.requestTimeStamp < time_5
                            let validated = false
                           if (isTimeFinshed) {
                                objectaddress.validationWindow = 0
                                objectaddress.messageSignature = 'validation expired'

                            } else {
                                
                                objectaddress.validationWindow = Math.floor((objectaddress.requestTimeStamp - time_5) / 1000)
                                try{
                                    //validated = bitcoinMessage.verify(objectaddress.message, address, signature)
                                     validated = async (message, address, signature) => {
                                        try {
                                            return await bitcoinMessage.verify(message, address, signature);
                                        } catch (err) {
                                            return false;
                                        }
                                    }
                                }catch(err){
                                    validated=false
                                }
                                objectaddress.messageSignature = validated ? 'valid' : 'invalid'
                                
                            }
                            let r
                                if (validated){
                                    r=true
                                }else{
                                    r=false
                                }
                                db.put(address, JSON.stringify(objectaddress))
                               
                            return resolve({
                                registerStar: !isTimeFinshed && r,
                                status: objectaddress
                            })

                        }
                    }
                    asyncWrapperForSuper();
                } catch (error) { }

            }
            )
        }).catch((error) => {
            return 'error'
        });
    }

    unableMultyAddBlock(address){
        db.del(address)
    }
    async getObjectByAddress(address) {
        try {
            let nb = await this.getObjectByAddress1(address);
            return nb;
        } catch (error) {
            // console.log(error + " in getblock");
            return (error);
        }
    }

    getObjectByAddress1(address) {

        let key = address;
       
        return new Promise((resolve, reject) => {
            db.get(key, (error, value) => {
                if (error) {
                    resolve(false)
                }
                resolve(value)
            });
        })
    }
    async starData(address, star) {
        let isValidAddress = await this.validateAddress(address);
        
        if (isValidAddress === 'valid') {

            return true
        } else {

            return false
        }
    }

    async validateAddress(address) {
        let objAdd = await this.getObjectByAddress(address);
        let objectaddress = JSON.parse(objAdd);
        if (objectaddress) {

            objectaddress.messageSignature = 'valid'
            return objectaddress.messageSignature

        } else {
            return 'invalid'
        }

    }
}
module.exports = {
    validation: validation
}