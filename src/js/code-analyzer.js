import * as esprima from 'esprima';
import * as StringCreator from './Part2';

export {
    parseCode,ParseDataToTable,ParseDataToTableBig
};

var converter;
var SeenFinal = [];
var VarDic = {};
var RealVals = {};
var ArgsDic = {};
var ArgsBefore = [];
var Do = true;
var elseDo = true;

function ParseDataToTableBig(codeToParse,args) {
    Do = true;
    elseDo = true;
    let Code = parseCode(codeToParse);
    ArgsBefore = args;
    let FinalCode = ParseDataToTable(Code);
    return FinalCode;
}

const parseCode = (codeToParse) => {
    VarDic = {};
    RealVals = {};
    SeenFinal = [];
    Do = true;
    ArgsBefore = [];
    CreateConverter();
    var ep = esprima.parseScript(codeToParse);
    return ep;
};

function CreateConverter()
{
    converter = new Map();
    converter.set('FunctionDeclaration','function Declaration');
    converter.set('Identifier','variable declaration');
    converter.set('VariableDeclarator','variable declaration');
    converter.set('AssignmentExpression', 'assignment expression');
    converter.set('WhileStatement', 'while statement');
    converter.set('IfStatement', 'if statement');
    converter.set('ElseIfStatement', 'else if statement');
    converter.set('ElseStatement','else statement');
    converter.set('ReturnStatement','return statement');
    converter.set('ForStatement','for statement');
}

function CotinueSwitchCase4(expression) {
    switch (expression.type) {
    case('UnaryExpression'):
        return ParseUnaryExpression(expression);

    }
}

function CotinueSwitchCase3(expression) {
    switch (expression.type)
    {
    case('MemberExpression'):
        return ParseMemberExpression(expression);
    case('ElseIfStatement'):
        ParseIfStatement(expression);
        break;
    case('ReturnStatement'):
        ParseReturnStatement(expression);
        break;
    default:
        return CotinueSwitchCase4(expression);}
}

function CotinueSwitchCase2(expression) {
    switch (expression.type)
    {
    case('Literal'):
        return ParseLiteral(expression);
    case('BinaryExpression'):
        return ParseBinaryExpression(expression);
    case('WhileStatement'):
        ParseWhileStatement(expression);
        break;
    case('IfStatement'):
        ParseIfStatement(expression);
        break;
    default:
        return CotinueSwitchCase3(expression);}
}

function CotinueSwitchCase(expression) {
    switch (expression.type)
    {
    case('VariableDeclarator'):
        ParseVariableDeclarator(expression);
        break;
    case('ExpressionStatement'):
        ParseExpressionStatement(expression);
        break;
    case('AssignmentExpression'):
        ParseAssignmentExpression(expression);
        break;
    case('Identifier'):
        return ParseIdentifier(expression);
    default:
        return CotinueSwitchCase2(expression);}
}


function ParseDataToTable(expression)
{
    switch (expression.type)
    {
    case ('Program'):
        return ParseProgram(expression);
    case ('FunctionDeclaration'):
        ParseFunction(expression);
        break;
    case('BlockStatement'):
        ParseBlockStatement(expression);
        break;
    case('VariableDeclaration'):
        ParseVariableDeclaration(expression);
        break;
    default:
        return CotinueSwitchCase(expression);}

}


function ParseProgram(expression)
{
    ParseDataToTable(expression.body[0]);
    return SeenFinal;
}


function ParseFunction(expression) {
    let args = [];
    for (var i = 0;i<ArgsBefore.length;i++) {
        let splited = ArgsBefore[i].split('=');args[i] = splited[0];
        if (splited[1].includes('[')) {
            let mySubString = splited[1].substring(splited[1].lastIndexOf('[') + 1, splited[1].lastIndexOf(']'));
            let splited_array = mySubString.split(',');
            for (var j=0;j<splited_array.length;j++)
            {
                ArgsDic[splited[0]+'['+j+']'] = splited_array[j];
                RealVals[splited[0]+'['+j+']'] = splited_array[j];}}
        else {
            ArgsDic[splited[0]] = splited[1];RealVals[splited[0]] = splited[1];}
    }

    var name = expression.id.name;
    SeenFinal.push({text:StringCreator.Function(name,args),type:'Function'});
    ParseDataToTable(expression.body);
    SeenFinal.push({text:StringCreator.Closer(),type:'Closer'});
}

function ParseBlockStatement(expression)
{
    for (var i=0;i<expression.body.length;i++)
    {
        ParseDataToTable(expression.body[i]);
    }
}

function ParseVariableDeclaration(expression)
{
    for (var i=0;i<expression.declarations.length;i++)
    {
        ParseDataToTable(expression.declarations[i]);
    }
}

function KindOfOpearion(name, operator, value) {
    if (operator == '!=')
        return name != value;
    return name == value;
}

function CheckIfOpeatorIsEq(operator) {
    return (operator == '==' || operator == '===' || operator == '!=');
}

function WhatToReturn(name, operator, value) {
    if (Number.isInteger(name) && Number.isInteger(value))
        return eval(name+operator+value);
    if (CheckIfOpeatorIsEq(operator))
        return KindOfOpearion(name,operator,value);
    //return name +operator+ value; options to show
}

function GetBinary(expression) {
    if (expression.left.type=='BinaryExpression')
        expression.left = ParseForReal(expression.left);
    if (expression.right.type=='BinaryExpression')
        expression.right = ParseForReal(expression.right);
    let name = ParseMeAVar(expression.left);
    let operator = expression.operator;
    let value = ParseMeAVar(expression.right);
    if (!isNaN(name)){ name = parseInt(name);} else {name = name.replace(/'|"|`/g,'');}
    if (!isNaN(value)){ value = parseInt(value);} else {value = value.replace(/'|"|`/g,'');}
    return WhatToReturn(name,operator,value);
}

/*
function GetForCondition(expression) {
    if (expression.left.type=='BinaryExpression')
        expression.left = ParseForReal(expression.left);
    if (expression.right.type=='BinaryExpression')
        expression.right = ParseForReal(expression.right);
    let name = ParseMeAVar(expression.left);
    let operator = expression.operator;
    let value = ParseMeAVar(expression.right);
    if (!isNaN(name)){ name = parseInt(name);} else {name = name.replace(/'|"|`/g,'');}
    if (!isNaN(value)){ value = parseInt(value);} else {value = value.replace(/'|"|`/g,'');}
    return '"'+name+'"'+operator+'"'+value+'"';
}
*/
function ParseForReal(x) {
    if (x.type=='BinaryExpression')
    {
        return  GetBinary(x);
    }
    else
        return ParseMeAVar(x);
}

function ParseVariableDeclarator(expression)
{

    var real = ParseForReal(expression.init);
    var x = ParseDataToTable(expression.init);
    VarDic[expression.id.name] = x;
    if (Do)
        RealVals[expression.id.name] = real;

}

function ParseExpressionStatement(expression)
{
    ParseDataToTable(expression.expression);
}

function GetOriginalName(expression) {
    switch (expression.type) {
    case('Identifier'):
        return expression.name;
    case ('MemberExpression'):
        return GetOriginalName(expression.object) + '[' + GetOriginalName(expression.property) + ']';
    case('Literal'):
        return expression.value;
    }
}

function ParseAssignmentExpression(expression)
{

    var left = GetOriginalName(expression.left);
    if (VarDic.hasOwnProperty(left)) {
        VarDic[left] = ParseDataToTable(expression.right);
        if(Do)
            RealVals[left] = ParseForReal(expression.right);
    }
    else {
        var right2 = ParseDataToTable(expression.right);
        if (Do)
            RealVals[left] = ParseForReal(expression.right);
        SeenFinal.push({text: StringCreator.Assignment(left, right2), type: 'Assignment'});
    }

}

function ParseIdentifier(expression)
{
    if (VarDic.hasOwnProperty(expression.name))
        return VarDic[expression.name];
    else
        return expression.name;
}


function ParseLiteral(expression)
{
    return expression.value;
}

function ParseMeAVar(name)
{
    if (name.type=='MemberExpression') {
        let member = ParseDataToTable(name);
        return RealVals[member];
    }
    if (name.name != null)
        name = name.name;
    if (name.value != null)
        name =   name.value;
    if (RealVals.hasOwnProperty(name))
        return RealVals[name];
    return name;
}

function ParseBinaryExpression(expression)
{
    var name = (ParseDataToTable(expression.left));
    var operator = expression.operator;
    var value = (ParseDataToTable(expression.right));
    if (operator == '*' || operator=='/')
    {
        name = '('+name+')';
        value = '('+value+')';
    }
    if (Number.isInteger(name) && Number.isInteger(value))
        return eval(name+operator+value);
    return name+operator+value;
}

function ParseWhileStatement(expression)
{
    Do = CheckForCondition(expression.test);
    var condition = ParseDataToTable(expression.test);
    SeenFinal.push({text:StringCreator.While(condition),type:'While'});
    ParseDataToTable(expression.body);
    SeenFinal.push({text:StringCreator.Closer(SeenFinal),type:'Closer'});
}

function CheckForCondition(condition) {
    return ParseForReal(condition);
}

function ParseIfStatement(expression)
{
    var condition = ParseDataToTable(expression.test);
    //var condition_str = GetForCondition(expression.test);
    Do = CheckForCondition(expression.test);elseDo = Do;
    if (converter.get(expression.type)==='if statement')
        SeenFinal.push({text:StringCreator.If(condition),type:'If',IsGreen:Do});
    if (converter.get(expression.type)==='else if statement')
        SeenFinal.push({text:StringCreator.ElseIf(condition),type:'ElseIf',IsGreen:Do});
    ParseDataToTable(expression.consequent); Do=false;
    SeenFinal.push({text:StringCreator.Closer(),type:'Closer'});
    if (expression.alternate != null) {
        if (expression.alternate.type==='IfStatement') {
            expression.alternate.type= 'ElseIfStatement';
            ParseDataToTable(expression.alternate);Do=false;}
        else {
            SeenFinal.push({text:StringCreator.Else(),type:'Else',IsGreen:!elseDo});
            ParseDataToTable(expression.alternate);Do=false;
            SeenFinal.push({text:StringCreator.Closer(),type:'Closer'});
        }}}

function ParseMemberExpression(expression)
{
    return ParseDataToTable(expression.object) +'[' + ParseDataToTable(expression.property) + ']';
}

function ParseReturnStatement(expression)
{
    var ret;
    if (expression.argument!=null)
        ret = ParseDataToTable(expression.argument);
    else
        ret = '';
    SeenFinal.push({text:StringCreator.Return(ret,SeenFinal),type:'Return'});
}

function ParseUnaryExpression(expression)
{
    return expression.operator + ParseDataToTable(expression.argument);
}
