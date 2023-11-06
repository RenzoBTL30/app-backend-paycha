'use strict'

import jwt from "jsonwebtoken";

export const auth = (req,res,next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'NoHeadersError'})
    }

    let token = req.headers.authorization.replace(/['"]+/g,'');

    let segment = token.split('.');

    if (segment.length != 3) {
        return res.status(403).send({message: 'InvalidToken'});
    } else {
        try {
            //let payload = jwt.decode(token,secretOrKey);
        } catch (error) {
            return res.status(403).send({message: 'InvalidToken'});
        }
    }

    next();

}
