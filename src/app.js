require('dotenv').config();
const { initializeApp } = require('firebase/app'); 
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars  = require('express-handlebars');
const methodOverride = require('method-override');
const route = require('./routes');
const app = express();
const port = 3006;


// view engine setup
app.engine('.hbs', 
	handlebars({
		extname: '.hbs',
		helpers:{
			section: function(name, options){
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			},
			isBigger: function(v1, v2, options) {
				if(v1 > v2) {
				  return options.fn(this);
				}
				return options.inverse(this);
			},
			isEqual: function(v1, v2, options) {
				if(v1 === v2) {
				  return options.fn(this);
				}
				return options.inverse(this);
			},
			sum: function(a,b){
				return a + b;
			}
		}
	
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Middleware

//Dùng để in mấy cái connect lên terminal 
//app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const firebaseConfig = { 
	apiKey : "AIzaSyBH-Q9MlxIYoDzTrU7k3HgiIXmOwVRy6Q8" , 
	authDomain : "inductive-seat-298508.firebaseapp.com" , 
	databaseURL : "https://inductive-seat-298508-default-rtdb.firebaseio.com" , 
	projectId : "inductive-seat-298508" , 
	storageBucket : "inductive-seat-298508.appspot.com" , 
	messagingSenderId : "859304203589" , 
	appId : "1: 859304203589: web: 417caf017424f42b661a2c" , 
	measurementId : "G-655D9CR7BB" 
};
app.use(methodOverride('_method'));
const appFirebase = initializeApp ( firebaseConfig );
route(app);

app.listen(process.env.PORT || port, () => {
	console.log(`Example app listening at http://localhost:${process.env.PORT || port}`);
});
