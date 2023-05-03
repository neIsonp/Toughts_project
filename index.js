const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

const conn = require('./db/conn.js');

//models
const Tought = require('./models/Tought.js');
const User = require('./models/User.js');

//import routes

const toughtsRoutes = require('./routes/toughtsRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

//import controller
const ToughtController = require('./controllers/ToughtController.js');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use(
    session({
        name: 'session',
        secret: 'our_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 36000000,
            expires: new Date(Date.now() + 36000000),
            httpOnly: true,
        }
    })
)

app.use(flash());

app.use((req, res, next) => {

    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next();
});

//routes
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.use('/', ToughtController.showToughts);

conn.sync()
    .then(() => app.listen(3000))
    .catch((err) => console.log(err));