import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as auth from "./controllers/auth.controller.js";

export default function initializePassport(passport) {
    let opciones = {};
    opciones.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opciones.secretOrKey = process.env.secretOrKey;

    passport.use(new JwtStrategy(opciones, (jwt_payload, done) => {

        auth.findById(jwt_payload.id, (err, usuario) => {

            if (err) {
                return done(err, false);
            }
            if (usuario) {
                return done(null,usuario);
            } else {
                return done(null, false);
            }

        });

    }));
}