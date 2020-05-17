const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const dum=require('./models/users_schema');
// const routes = require('./routes/index');
const app = express();
require('./config/views-helper')(app);
//express does not create session by itself  express-session(it is a middleware)does that
const layouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const mongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
//setup the chat sever to be used with socket.io
const chatServer = require('http').Server(app);
const chatSocket = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');
//************all the app.use i.e all middlewares are used when a request comes */
app.use(cookieParser());

app.use(express.urlencoded());
if (env.name == 'development') {
    app.use(sassMiddleware({

        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}
console.log(process.env.CODIAL_ASSET_PATH, "hhh", path.join(__dirname, env.asset_path));
app.use(express.static(path.join(__dirname, env.asset_path)));

app.use(layouts);
//make the uploads path available to the browser

// because the img tag searches for the /uploads/users/avatars/avtar-... path so we need to amke this path avialable

// the above static is telling that if there is requirement of any static File,look in assests
// but second one tells tha if you require any static fiel within the /uploads rote look in uploads

app.use('/uploads', express.static('./uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');
// here we are setting up the cookie for the session created
app.use(session({
        name: 'codial',
        secret: env.session_cookie_key,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 60 * 100)
        },
        store: new mongoStore({
            mongooseConnection: db,
            autoRemove: 'disbaled'
        })
    },

));

app.use(passport.initialize());
console.log(passport.session.toString());
app.use(passport.session()); //to enable serializers and deserializers to access the cookies

app.use(passport.setAuthenticatedUser);
app.use(flash()); //should be used after passport.session as it uses session cookies
app.use(customMware.setFlash);
// routes should be placed after the setAutheticatedUser middleware as it contains next(),otherwise res.user wont get set 

app.use('/', require('./routes'));
const port = 8000;

app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running in the server:${err}`);
    }

});