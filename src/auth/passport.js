const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/UserService');
const bcrypt = require('bcrypt');
const { SALT_BCRYPT } = require("../config/app");

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        UserService.findAccount(username, password)
        .then((user)=>{
            if (!user || !user.f_permission) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            validPassword(user, password)
            .then(result=>{
                if(result){
                    return done(null, user);
                }
                else{
                    return done(null, false, { message: 'Incorrect password.' });
                }
            })
        })
        .catch(err=>{
            return done(err); 
        })
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.f_ID);
});
  
passport.deserializeUser(function(id, done) {
    UserService.findByID(id)
    .then(user=>{
        done(null ,user);
    })
    .catch(err=>{
        done(err);
    })
});
function validPassword(user, password){
    return bcrypt.compare(password, user.f_password);
}


module.exports = passport;