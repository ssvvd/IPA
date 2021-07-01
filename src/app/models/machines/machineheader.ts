export class Machineheader {
    public Sec:number;
    public MachineID:number;
    public MachineIDBase:number;
    public MachineType:string;
    public MachineType1:string;
    public MachineName:string;    
    public CostPerHour:number;
    public Currency:string;
    public SpindleSpeed:number;
    public Power:number;
    public Torque:number;      
    public AdaptationType:string;
    public AdaptationSize:string;

    public SpindleSpeed1:number;
    public Power1:number;
    public Torque1:number;      
    public AdaptationType1:string;
    public AdaptationSize1:string;
    
    public ExtMQL:boolean;
    public IntMQL:boolean;

    public DescSelect:string="Select";    
    public isFavorite:boolean = false;
    public IsMostRecommended:boolean = false;
    public SpindleType:string;
    public SpindleTypeDefault:string
    public IsSelected:boolean=false;
    public NameNumber:string='';
    constructor( )
    {
        this.DescSelect="Select";
    }
}
