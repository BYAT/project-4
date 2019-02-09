# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install express with --save flag to enable using express endpoit
```
npm install express --save
```
- Install body-parser with --save flag
```
npm install body-parser --save
```
- Install bitcoinjs-lib with --save flag
```
npm install bitcoinjs-lib --save
```
- Install bitcoinjs-message with --save flag
```
npm install bitcoinjs-message --save
```
- Install hex2ascii with --save flag
```
npm install hex2ascii --save
```
## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).

3: Run app.js file to get block and post new block
```
node app.js then it will run the server on port 8000
```
4: To test the request Validation in post method on postman set the method to POST then write the url
```
url: localhost:8000/requestValidation
```
5: On body tab in Postman write the body content that wanted to request Validation address
```
it should be written in json form
ex:{ "address":"1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc"}
```
the response will be in this json form like this
{
    "walletAddress": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTcL",
    "requestTimeStamp": "1544451269",
    "message": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc:1544451269:starRegistry",
    "validationWindow": 300
}
```
6:  To test the Validation of the signature in post method on postman set the method to POST then write the url
```
url: localhost:8000/message-signature/validate
```
7: On body tab in Postman write the address and signature contents
```
it should be written in json form
ex:{ "address":"1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc",
    "signature":"H8UNPtjh4ztqJMS8VERIMfQAY7LfNbfjDAgExnVkibpDd+HBygDdGFjBaKu/a7n12s4E8DJTaobRqJnqc68kFTQ="}
```
the response will be in this json form like this
{
    "registerStar": true,
    "status": {
        "address": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc",
        "requestTimeStamp": "1544454641",
        "message": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc:1546339149602:starRegistry",
        "validationWindow": 193,
        "messageSignature": true
    }
}
```
8: To submits the Star information to be saved in the Blockchain use the post method on postman set the method to POST then write the url
```
url: localhost:8000/block
```
9: On body tab in Postman write the address and star object information(dec, re, story) contents
```
it should be written in json form
ex:{ "address":"1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc",
    "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
}
```
the response will be in this json form like this
{
    "hash": "325fc737a39a1ab9903ebc74951a129c384cdd7deee997748cfb916acc52aa7c",
    "height": 1,
    "body": {
        "address": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1547065620",
    "previousBlockHash": "11745effcef02c593f59274081bbcca13bf1bec226835806700f79d84624c1cb"
}
10: To Get Star block by hash with JSON response open postman to test the get by writting the url with setting the GET method
```
url: localhost:8000/stars/hash:[HASH]
ex: localhost:8000/stars/hash:325fc737a39a1ab9903ebc74951a129c384cdd7deee997748cfb916acc52aa7c
```
the response will be in this json form like this
{
    "hash": "325fc737a39a1ab9903ebc74951a129c384cdd7deee997748cfb916acc52aa7c",
    "height": 1,
    "body": {
        "address": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1547065620",
    "previousBlockHash": "11745effcef02c593f59274081bbcca13bf1bec226835806700f79d84624c1cb"
}
```
11: To Get Star block by wallet address with JSON response open postman to test the get by writting the url with setting the GET method
```
url: localhost:8000/stars/address:[ADDRESS]
ex: localhost:8000/stars/address:1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc
```
the response will be in this json form like this
{
    "hash": "325fc737a39a1ab9903ebc74951a129c384cdd7deee997748cfb916acc52aa7c",
    "height": 1,
    "body": {
        "address": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1547065620",
    "previousBlockHash": "11745effcef02c593f59274081bbcca13bf1bec226835806700f79d84624c1cb"
}
```
12: To Get Star block by height with JSON response open postman to test the get by writting the url with setting the GET method
```
url: localhost:8000/stars/block/[HEIGHT]
ex: localhost:8000/stars/block/1
```
the response will be in this json form like this
{
    "hash": "325fc737a39a1ab9903ebc74951a129c384cdd7deee997748cfb916acc52aa7c",
    "height": 1,
    "body": {
        "address": "1Nd91gHCzHMiCUnSFPkZGrpeBSBCXLxTTc",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1547065620",
    "previousBlockHash": "11745effcef02c593f59274081bbcca13bf1bec226835806700f79d84624c1cb"
}
```