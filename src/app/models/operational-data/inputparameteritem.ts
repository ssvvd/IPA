
 enum parametertype
{
    string=0,
    number=1,
    boolean=2,
} 
export class InputParameterItem {
    public name:string;
    public type:string;
    public value:object;
    public valuedefault:string;
    public valuemin:string;
    public valuemax:string;

    constructor()
    {
        
    }
}

