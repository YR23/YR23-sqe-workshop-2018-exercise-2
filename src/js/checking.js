var x = 8;
t();
s();
function s () {console.log('S: '+x);}
x=4;
function t () {console.log('T: '+x);}

t();
s();