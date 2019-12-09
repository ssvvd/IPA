export class Machineheader {
    public MachineID:number;
    public MachineType:string;
    public MachineName:string;    
    public CostPerHour:number;
    public Currency:string;
    public SpindleSpeed:number;
    public Power:number;
    public Torque:number;
    public IsSelected:boolean=false;  

    public DescSelect:string="Select";
    constructor( )
        {
            this.DescSelect="Select";
        }
}
