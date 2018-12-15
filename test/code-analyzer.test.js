var assert = require('assert');
import * as parser from '../src/js/code-analyzer';

//* Helping Function */
function Count(arr,type)
{
    var counter = 0;
    for (var i=0;i<arr.length;i++)
    {
        if (type!=null) {
            if (arr[i].IsGreen === type)
                counter++;
        }
        else {
            if (!arr[i].hasOwnProperty('IsGreen')) {
                counter++;
            }
        }
    }
    return counter++;

/* End of Helping Functions*/

}


function ParseMyInput(val) {
    return val.split('|');
}

//** 1 **//
describe('cheking Regular IF & ELSE', () => {
    var TestedInput = 'function foo(x, y, z){if (x < y) {x=x+1} else {return x + y;}}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {         
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    }); 
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,6);
    });
});

//** 2 **//
describe('cheking Regular IF & ELSE now with locals', () => {
    var TestedInput = 'function foo(x, y, z){let a = x; let b=y; if (a < b) {a=a+1} else {return a + b;}}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,7);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 3 **//
describe('Adding IF ELSE now', () => {
    var TestedInput = 'function foo(x, y, z){let a = x; let b=y; if (a < b) {a=a+1}else if (b<a){b=b-1} else {return a + b;}}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,9);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,2);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,6);
    });
});

//** 4 **//
describe('Now Checking just while', () => {
    var TestedInput = 'function foo(x, y, z){ while(x<y){return a + b;}}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,5);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,0);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 5 **//
describe('Now Checking just array', () => {
    var TestedInput = 'function foo(x, y, z){let n = z[0]; while(x<y){return a + b;}}';
    var input = ParseMyInput('x=1|y=2|z=[1]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,5);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,0);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 6 **//
describe('Now Checking just Unary', () => {
    var TestedInput = 'function foo(x, y, z){let n = z[0]; while(x<y){return -1;}}';
    var input = ParseMyInput('x=1|y=2|z=[1]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,5);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,0);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 7 **//
describe('Now Checking just Binary equ', () => {
    var TestedInput = 'function foo(x, y, z){if(x+1==y+0){return -1;}}';
    var input = ParseMyInput('x=1|y=2|z=[1]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,5);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,4);
    });
});

//** 8 **//
describe('Now Checking just Strings ', () => {
    var TestedInput = 'function foo(x, y, z){let n=z;if(n=="hello"){return -1;}}';
    var input = ParseMyInput('x=1|y=2|z="hello"');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,5);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,4);
    });
});

//** 9 **//
describe('Now Checking declaratin inside false if ', () => {
    var TestedInput = 'function foo(x, y, z){var n=z;if(n!="hello1"){x=x+1;return -1;}}';
    var input = ParseMyInput('x=1|y=2|z="hello"');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,6);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 10 **//
describe('Now Checking declaratin inside true if ', () => {
    var TestedInput = 'function foo(x, y, z){var n=z;if(n=="hello"){x=x+1;return -1;}}';
    var input = ParseMyInput('x=1|y=2|z="hello"');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,6);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 11 **//
describe('Now Checking declaratin inside true if ', () => {
    var TestedInput = 'function foo(x, y, z){var n=z;if(n=="hello"){let b=x+1;return -1;}}';
    var input = ParseMyInput('x=1|y=2|z="hello"');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,5);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,4);
    });
});

//** 12 **//
describe('Now Checking declaratin inside false if ', () => {
    var TestedInput = 'function foo(x, y, z){var n=z;if(n!="hello"){let b=x+1;return -1;}else{let a=y;}}';
    var input = ParseMyInput('x=1|y=2|z="hello"');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,7);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 13 **//
describe('Now Checking Member 2 assignment ', () => {
    var TestedInput = 'function foo(x, y, z){let n=z[0];if(n!="hello"){let b=x+1;z[0]=1;}else{let a=y;}}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,7);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 14 **//
describe('Now Checking local to local assignment ', () => {
    var TestedInput = 'function foo(x, y, z){let n=z[0];let m=1+x;n=m;if(n!="hello"){let b=x+1;z[0]=1;}else{let a=y;}}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,7);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,5);
    });
});

//** 15 **//
describe('Now Checkin gother operators ', () => {
    var TestedInput = 'function foo(x, y, z){n=z[0];m=1+x;n=m;if(x*y == z[0]*2){let b=x+1;z[0]=1;}else{let a=y;}}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,10);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,8);
    });
});

//** 16 **//
describe('Now Checkin gother continue ', () => {
    var TestedInput = 'function foo(x, y, z){n=z[0];m=1+x;n=m;if(1+2 == 3+2){let b=x+1;z[0]=1;}else{let a=y;}}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,10);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,1);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,8);
    });
});

//** 17 **//
describe('Now Else IF with if and else ', () => {
    var TestedInput = 'function foo(x, y, z){n=z[0];m=1+x;n=m;if(1==1){}else if (2==2) {}else{let a=y;}}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,11);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,2);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,8);
    });
});

//** 18 **//
describe('Empty Return ', () => {
    var TestedInput = 'function foo(x, y, z){n=z[0];m=1+x;n=m;if(1==1){}else if (2==2) {}else{let a=y;}return ;}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,12);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,2);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,9);
    });
});

//** 19 **//
describe('if mekunan ', () => {
    var TestedInput = 'function foo(x, y, z){if(1==1){if (1==1){}else if(2==1){}else if (0==0){}else{}}else if (2==2) {}else{let a=y;}return ;}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,17);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,3);
    });
    it('count Regulars', () => {
        var counter = Count(result,null);
        assert.equal(counter,10);
    });
});
