const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const extract_jwt = require('passport-jwt').ExtractJwt;
const { sign } = require('jsonwebtoken');
const {config} = require('./config');
const {Admin} = require('./models');

exports.local = passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

exports.getToken = (user) => {
    return sign(user, config.secretKey, {expiresIn: 3600});
}

const opts = {jwtFromRequest : extract_jwt.fromAuthHeaderAsBearerToken(), secretOrKey: config.secretKey};

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        Admin.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err){
                return done(err, false);
            }
            else if(user){
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session:false});    