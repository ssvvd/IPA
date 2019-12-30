
 enum parametertype
{
    string=0,
    number=1,
    boolean=2,
} 
export class InputParameterItem {
    public name:string;
    public type:parametertype;
    public value:object;
    public valuedefault:object;
    public valuemin:object;
    public valuemax:object;

    constructor()
    {
        
    }
}

