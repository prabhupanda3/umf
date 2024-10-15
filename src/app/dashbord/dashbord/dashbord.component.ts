import { PercentPipe } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import * as Highcharts from 'highcharts';
import { color } from 'highcharts';
import { DashboardService } from 'src/app/service/Dashboard/dashboard.service';
 
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent {
  hierarchyKeys!: number[];
  username!: string | null;
  levels: string[] = ['Region', 'Circle', 'Division', 'Zone', 'Substation'];
  hirarchyArray!: { key: number; value: string; }[];
  keyHolder!: Map<string, any>;
  hid!: number;
  leveId!: number;
  lid!: number;
  selectedValue!: string | null;
  selectedLevelId!: string | null;
  selectedDate:string='' ;
 


  constructor(private dashboardService: DashboardService,
     private renderer: Renderer2, private el: ElementRef){}
  ngOnInit() {
    this.getAvailableUserHirarchy()
    this.getReport()
  }
  hierarchyHolder!: Map<string, Map<number, string>>;
  hload: { username: string | null, hierarchyId: number, hirarchyLevel: number,date: string } = {
    username: sessionStorage.getItem('username'),
    hierarchyId: this.hid,
    hirarchyLevel: this.leveId,
    date:this.selectedDate,
  };

  chatRout(): void {
    try{
      window.location.href = '/chat';
  }
  catch(error){
    console.error('Error log',error);
      }
}


  
  public getAvailableUserHirarchy() {
    this.dashboardService.getAvailableUserHirarchyData(this.hload).subscribe(
      (data: Map<string, Map<number, string>>) => {  
        this.hierarchyHolder = new Map(Object.entries(data));
        this.levels.forEach((level, index) => {
          const lavelName = this.renderer.createElement('label');
          const text = this.renderer.createText(level);
          this.renderer.appendChild(lavelName, text);
          let select = this.renderer.createElement('select');
          this.renderer.setAttribute(select, 'id', `${index}`);
          const options = this.renderer.createElement('option');
          this.renderer.setProperty(options, 'value', "--all--");
          this.renderer.setProperty(options, 'text', "--all--");
          this.renderer.appendChild(select, options);
          this.hierarchyHolder.forEach((key, value) => {
            if (`${value}` == level) {
              this.keyHolder = new Map(Object.entries(key));
              this.keyHolder.forEach((id, name) => {
                const option1 = this.renderer.createElement('option');
                this.renderer.setProperty(option1, 'value', name);
                const option1Text = this.renderer.createText(id);
                this.renderer.appendChild(option1, option1Text);
                this.renderer.appendChild(select, option1);
              });
            }
          });
          this.renderer.listen(select, 'change', (event) => {
            this.selectedValue = (event.target as HTMLSelectElement).value;
            this.hload.hierarchyId = Number(this.selectedValue);
            this.selectedLevelId = (event.target as HTMLSelectElement).id;
            this.hload.hirarchyLevel = Number(this.selectedLevelId);
            console.log(this.hload.hierarchyId + "======" + this.hload.hirarchyLevel)
            this.dashboardService.getAvailableUserHirarchyData(this.hload).subscribe(
              (recivedData: Map<string, Map<number, string>>) => {
                console.log(this.hload.hierarchyId + "==========" + this.hload.hirarchyLevel)
                this.hierarchyHolder = new Map(Object.entries(recivedData));
                const nextselect = document.getElementById(`${this.hload.hirarchyLevel + 1}`) as HTMLSelectElement;
                this.lid = Number(this.selectedLevelId) + 1;
                this.hierarchyHolder.forEach((key, value) => {
                  console.log(value + "=====" + this.levels[this.lid])
                  if (value === `${this.levels[this.lid]}`) {
                    while (nextselect.firstChild) {
                      nextselect.removeChild(nextselect.firstChild);
                    }
                    this.keyHolder = new Map(Object.entries(key));
                    this.keyHolder.forEach((name, id) => {
                      const option = this.renderer.createElement('option');
                      this.renderer.setProperty(option, 'value', id);
                      const optionText = this.renderer.createText(name);
                      this.renderer.appendChild(option, optionText);
                      this.renderer.appendChild(nextselect, option);
                    });
                  }
                });
                select = nextselect;
              });
          });
          this.renderer.setStyle(lavelName,'color','red');
          this.renderer.setStyle(lavelName,'font-size','15px');
          this.renderer.setStyle(select, 'border-radius', '6px');
          this.renderer.setStyle(select, 'padding', '2%');
          this.renderer.setStyle(select, 'height', '0.02%');
          this.renderer.setStyle(select, 'width', '13%');
          this.renderer.setStyle(select, 'border-color', '#a0a7e5');
         const div = this.el.nativeElement.querySelector('#hirarchySelector');
         this.renderer.appendChild(div, lavelName);
          this.renderer.appendChild(div, select);

        });
        
      },
      (error: string) => {
        console.log("DATA  :" + error)
      }
    );
  }

  public getReport(){
   this.getDayLiveCommunicationSummary();
  }
  //Communication Related Variable
  AgCommunicating!:number;
  AgTotal!:number;
  NonAgCommunicating!:number;
  NonAgTotal!:number;
  kvComm33!:number;
  kvtotal33!:number;
  GrandToalCommunicating!:number;
  GrandTotal!:number;
  

public getDayLiveCommunicationSummary(){
  this.dashboardService.getDayCommunicationSummary(this.hload).subscribe(
    (response)=>{
      Highcharts.chart('cs-container', {
        chart: {
          type: 'pie',
          animation: false,
          height:350,
          width:200,
          backgroundColor:'#ffffff',
          spacing: [0,20,40,0],  // 40px at the top, 20px on the sides and bottom
          margin: [0, 45, 245, 0]   
        },
        title: {
          text: 'AG ('+response.AgCommunicating+"/"+response.AgTotal+")",
          style: {
            font:'blod',
            
            color: '#333333', // Title color
            fontWeight: 'bold',
            fontSize: '12px'
          }
        },
        
        plotOptions: {
          pie: {
            innerSize: '80%', // Makes it a donut chart
            size: '95%',
            allowPointSelect: false, 
            startAngle: 180, 
            dataLabels: {
              enabled: false,
            },
            states: {
              hover: {
                enabled: true // Disable hover effect
              }
            }

          },
          
        },
        pane:{
   
        },
        tooltip: {
          enabled: false,
          shadow: false, // Removes the tooltip shadow (and arrow)
          borderRadius: 0 // Removes the rounded borders, which could create an arrow effect
        },
       series:[
        {
          type: 'pie',
         
          data:[
            {  y:  response.AgCommunicating,color:'#fd520e9d'},
            {  y: response.AgTotal-response.AgCommunicating,color:'#cccbcb' }
          ]
        }
       ],
       credits: {
        enabled: false // Disables the Highcharts branding
      }

      }
     );

     Highcharts.chart('nonagcomm',{
      chart: {
        type: 'pie',
        animation: false,
        height:350,
        width:200,
        backgroundColor:'#ffffff',
       
        spacing: [0,20,40,0],  // 40px at the top, 20px on the sides and bottom
        margin: [0, 45, 245, 0]   
      },
      title: {
        text: 'NON-AG ('+(response.NonAgCommunicating+response.kvComm33)+"/"+(response.kvtotal33+response.NonAgTotal)+")",
        style: {
          font:'blod',
          
          color: '#333333', // Title color
          fontWeight: 'bold',
          fontSize: '12px'
        }
      },
      
      plotOptions: {
        pie: {
          innerSize: '80%', // Makes it a donut chart
          size: '95%',
          allowPointSelect: false, 
          startAngle: 180, 
          dataLabels: {
            enabled: false,
          },
          states: {
            hover: {
              enabled: true // Disable hover effect
            }
          }

        },
        
      },
      tooltip: {
        enabled: false,
        shadow: false, // Removes the tooltip shadow (and arrow)
        borderRadius: 0 // Removes the rounded borders, which could create an arrow effect
      },
     series:[
      {
        type: 'pie',
        
        data:[
          {  y:  response.AgCommunicating},
          {  y: response.AgTotal-response.AgCommunicating,color:'#cccbcb' }
        ]
      }
     ],
     credits: {
      enabled: false // Disables the Highcharts branding
    }
     });
Highcharts.chart('total-comm',{chart: {
  type: 'pie',
  animation: false,
  height:350,
  width:200,
  backgroundColor:'#ffffff',
 
  spacing: [0,20,40,0],  // 40px at the top, 20px on the sides and bottom
  margin: [0, 45, 245, 0]   
},
title: {
  text: 'Total ('+response.GrandToalCommunicating+"/"+response.GrandTotal+")",
  style: {
    font:'blod',
    
    color: '#333333', // Title color
    fontWeight: 'bold',
    fontSize: '12px'
  }
},

plotOptions: {
  pie: {
    innerSize: '80%', // Makes it a donut chart
          size: '95%',
    allowPointSelect: false, 
    startAngle: 180, 
    dataLabels: {
      enabled: false,
    },
    states: {
      hover: {
        enabled: true // Disable hover effect
      }
    }

  },
  
},
tooltip: {
  enabled: false,
  shadow: false, // Removes the tooltip shadow (and arrow)
  borderRadius: 0 // Removes the rounded borders, which could create an arrow effect
},
series:[
{
  type: 'pie',
  name: 'Communication-Livestatus',
  data:[
    {  y:  response.GrandToalCommunicating},
    {  y: response.GrandTotal, color:'#cccbcb'}
  ]
}
],
credits: {
enabled: false // Disables the Highcharts branding
}})
    },
    (error)=>{

    }
  );
}




}