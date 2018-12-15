export function Return(ret) {
    return  'return '+ret+';\n';

}

export function Else() {
    return  'else {\n';
}

export function ElseIf(condition) {
    return 'else if ('+condition +') {\n';

}

export function If(condition) {
    return 'if ('+condition +') {\n';
}

export function While(condition) {
    return 'while ('+condition+') {\n';

}

export function Assignment(name, value) {
    return name + ' = '+ value + ' ;\n';

}

export function Function(name,args)
{
    var final = '';
    final += 'function ';
    final += name +' (';
    for (var i=0;i<args.length;i++)
    {
        if (i===args.length-1)
            final += args[i]+') ';
        else
            final += args[i]+', ';
    }
    final += '{\n';
    return final;
}

export function Closer() {
    return ' }\n';
}

