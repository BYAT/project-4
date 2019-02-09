const { Block,
    Blockchain } = require('./simpleChain');
const { validation } = require('./validation');
"use strict";
const express = require('express')
const hex2ascii = require('hex2ascii')
let app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/requestValidation", async function (req, res) {
    /// address 
    if (req.body.address) {
        let validate = await new validation(req);
        try {
            res.setHeader('Content-type', 'application/json')

            /// Requested Validation

            let requestObject = await validate.RequestedAddress(req.body.address);

            res.send(requestObject);
        } catch (error) {


            let requestObject1 = await validate.AddRequestValidation(req.body.address);

            res.send(requestObject1);

        }


    } else {
        res.status(400)
            .json({ code: 400, message: 'Address not found' }).end();
    }
})
app.post("/message-signature/validate", async function (req, res) {
    /// address && signature

    if (req.body.address && req.body.signature) {

        res.setHeader('Content-type', 'application/json')

        let signature = await new validation(req);

        /// addRequestValidation
        let validateRequest = await signature.validateRequestByWallet(req.body.address, req.body.signature);
        if (validateRequest == 'error') {
            res.status(400)
                .json({ code: 400, message: 'Address is not requested' })
        } else {
            
            if (validateRequest.registerStar) {

                res.send(validateRequest);
            } else {

                res.send(validateRequest);
            }
        }
    } else {
        res.status(400)
            .json({ code: 400, message: 'Address or signature not found' }).end();
    }
})

app.post("/block", async function (req, res) {
    if (req.body.address && req.body.star && req.body.star.dec && req.body.star.ra && req.body.star.story) {
        res.setHeader('Content-type', 'application/json')
        let validate = await new validation(req);
        let block1 = await new Blockchain();
        
        let requestObject = await validate.starData(req.body.address, req.body.star);
        if (requestObject) {
            req.body.star.story = new Buffer.from(req.body.star.story).toString('hex')
            let body = {
                address: req.body.address,
                star: {
                    ra: req.body.star.ra,
                    dec: req.body.star.dec,
                    story: req.body.star.story,
                    storyDecoded: hex2ascii(req.body.star.story)
                }
            };

            let x = await block1.addBlock(await new Block(body));
            let bh = await block1.getBlockHeight();
            let n2 = await block1.getBlock(bh);
            res.send(n2);
            validate.unableMultyAddBlock(req.body.address)
        } else {
            res.status(400)
            .json({ code: 400, message: requestObject +', register only one star per validation ' })
        }

    } else {
        res.status(400)
            .json({ code: 400, message: 'Address or Star object not found' }).end();
    }
});
// get block by height
app.get("/block/:index", async function (req, res) {
    res.setHeader('Content-type', 'application/json')

    //get Block height from url 
    let blc = req.params.index;
    // to use Blockchain class methods
    let block1 = await new Blockchain();
    let bh = await block1.getBlockHeight();
    if (blc > bh - 1 || blc < 0) {
        res.status(400)
            .json({ code: 400, message: 'Block not found' }).end();
    } else {
        let n = await block1.getBlock(blc);
        res.send(n)
        res.end();
    }
});

// get block by hash
app.get("/stars/hash:hash", async function (req, res) {
    //get Block hash from url 

    let blc = req.params.hash.slice(1);

    // to use Blockchain class methods
    let block1 = await new Blockchain();
    let bh = await block1.getBlockByHash(blc);

    if (!bh) {
        res.status(400)
            .json({ code: 400, message: 'Block not found' }).end();
    } else {
        res.send(bh)
        res.end();
    }
});
//get block by address 
app.get("/stars/address:address", async function (req, res) {
    //get Block hash from url 
    let address = req.params.address.slice(1);
    // to use Blockchain class methods
    let block1 = await new Blockchain();
    let bh = await block1.getBlocksByAddress(address);
    if (!bh) {
        res.status(400)
            .json({ code: 400, message: 'Block not found' }).end();
    } else {
        res.send(bh)
        res.end();
    }
});

app.listen(8000, () => console.log('Example app listening on port 8000!'))
