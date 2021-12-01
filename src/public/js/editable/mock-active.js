(function ($) {
    "use strict";
    //ajax mocks
       $.mockjaxSettings.responseTime = 500; 
       
       $.mockjax({
           url: '/post',
           response: function(settings) {
               log(settings, this);
           }
       });
   
       $.mockjax({
           url: '/error',
           status: 400,
           statusText: 'Bad Request',
           response: function(settings) {
               this.responseText = 'Please input correct value'; 
               log(settings, this);
           }        
       });
       
       $.mockjax({
           url: '/status',
           status: 500,
           response: function(settings) {
               this.responseText = 'Internal Server Error';
               log(settings, this);
           }        
       });
     
       $.mockjax({
           url: '/groups',
           response: function(settings) {
               this.responseText = [ 
                {value: 0, text: 'Guest'},
                {value: 1, text: 'Service'},
                {value: 2, text: 'Customer'},
                {value: 3, text: 'Operator'},
                {value: 4, text: 'Support'},
                {value: 5, text: 'Admin'}
              ];
              log(settings, this);
           }        
       });
   
       $.mockjax({
           url: '/periods',
           response: function(settings) {
               this.responseText = [ 
                {value: 0, text: 'Year'},
                {value: 1, text: 'Quarter'},
                {value: 2, text: 'Month'},
                {value: 3, text: 'Week'},
                {value: 4, text: 'Day'}
              ];
              log(settings, this);
           }        
       });
   
       $.mockjax({
           url: '/brands',
           response: function(settings) {
               this.responseText = [ 
                {value: 0, text: 'All'},
                {value: 1, text: 'Crazy Bunny'},
                {value: 2, text: 'Moustache Monster'},
                {value: 3, text: 'Crazy Rockpanda'},
                {value: 4, text: 'Zombie Popsicle'},
                {value: 5, text: 'Devil Monster'}
              ];
              log(settings, this);
           }        
       });
   
       $.mockjax({
           url: '/categories',
           response: function(settings) {
               this.responseText = [ 
                {value: 0, text: 'All'},
                {value: 1, text: 'T-shirt'},
                {value: 2, text: 'Backpack'},
                {value: 3, text: 'Cap'},
                {value: 4, text: 'Sneaker'}
              ];
              log(settings, this);
           }        
       });
   
       $.mockjax({
           url: '/genders',
           response: function(settings) {
               this.responseText = [ 
                {value: 0, text: 'All'},
                {value: 1, text: 'Male'},
                {value: 2, text: 'Female'},
                {value: 3, text: 'Unisex'}
              ];
              log(settings, this);
           }        
       });
       
       function log(settings, response) {
               var s = [], str;
               s.push(settings.type.toUpperCase() + ' url = "' + settings.url + '"');
               for(var a in settings.data) {
                   if(settings.data[a] && typeof settings.data[a] === 'object') {
                       str = [];
                       for(var j in settings.data[a]) {str.push(j+': "'+settings.data[a][j]+'"');}
                       str = '{ '+str.join(', ')+' }';
                   } else {
                       str = '"'+settings.data[a]+'"';
                   }
                   s.push(a + ' = ' + str);
               }
               s.push('RESPONSE: status = ' + response.status);
   
               if(response.responseText) {
                   if($.isArray(response.responseText)) {
                       s.push('[');
                       $.each(response.responseText, function(i, v){
                          s.push('{value: ' + v.value+', text: "'+v.text+'"}');
                       }); 
                       s.push(']');
                   } else {
                      s.push($.trim(response.responseText));
                   }
               }
               s.push('--------------------------------------\n');
               $('#console').val(s.join('\n') + $('#console').val());
       }                 
   
   })(jQuery); 