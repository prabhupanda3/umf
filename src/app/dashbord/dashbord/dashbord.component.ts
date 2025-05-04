import { PercentPipe } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import * as Highcharts from 'highcharts';
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
  selectedDate: string = '';



  constructor(private dashboardService: DashboardService,
    private renderer: Renderer2, private el: ElementRef) { }
  ngOnInit() {
    this.getAvailableUserHirarchy();
    this.getReport();
  }
  hierarchyHolder!: Map<string, Map<number, string>>;
  hload: { username: string | null, hierarchyId: number, hirarchyLevel: number, date: string } = {
    username: sessionStorage.getItem('username'),
    hierarchyId: this.hid,
    hirarchyLevel: this.leveId,
    date: this.selectedDate,
  };

  chatRout(): void {
    try {
      window.location.href = '/chat';
    }
    catch (error) {
      console.error('Error log', error);
    }
  }

  //Hierarchy Selection
  public getAvailableUserHirarchy() {
    this.dashboardService.getAvailableUserHirarchyData(this.hload).subscribe(
      (data: Map<string, Map<number, string>>) => {
        this.hierarchyHolder = new Map(Object.entries(data));

        const div = this.el.nativeElement.querySelector('#hierarchySelector');

        // Apply styles to parent container
        this.renderer.setStyle(div, 'display', 'flex');
        this.renderer.setStyle(div, 'flex-wrap', 'wrap');
        this.renderer.setStyle(div, 'gap', '20px');
        this.renderer.setStyle(div, 'padding', '15px');
        this.renderer.setStyle(div, 'background', '#fff');
        this.renderer.setStyle(div, 'border-radius', '10px');
        this.renderer.setStyle(div, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.05)');

        this.levels.forEach((level, index) => {
          const label = this.renderer.createElement('label');
          const labelText = this.renderer.createText(level);
          this.renderer.appendChild(label, labelText);

          // Style label
          this.renderer.setStyle(label, 'display', 'block');
          this.renderer.setStyle(label, 'margin-bottom', '6px');
          this.renderer.setStyle(label, 'font-size', '14px');
          this.renderer.setStyle(label, 'font-weight', '600');
          this.renderer.setStyle(label, 'color', '#333');

          let select = this.renderer.createElement('select');
          this.renderer.setAttribute(select, 'id', `${index}`);

          // Default "--all--" option
          const defaultOption = this.renderer.createElement('option');
          this.renderer.setProperty(defaultOption, 'value', '--all--');
          this.renderer.setProperty(defaultOption, 'text', '--all--');
          this.renderer.appendChild(select, defaultOption);

          // Fill select options
          this.hierarchyHolder.forEach((key, value) => {
            if (`${value}` === level) {
              this.keyHolder = new Map(Object.entries(key));
              this.keyHolder.forEach((id, name) => {
                const option = this.renderer.createElement('option');
                this.renderer.setProperty(option, 'value', name);
                const optionText = this.renderer.createText(id);
                this.renderer.appendChild(option, optionText);
                this.renderer.appendChild(select, option);
              });
            }
          });

          // Style select dropdown
          this.renderer.setStyle(select, 'border-radius', '8px');
          this.renderer.setStyle(select, 'padding', '8px 12px');
          this.renderer.setStyle(select, 'height', '40px');
          this.renderer.setStyle(select, 'width', '220px');
          this.renderer.setStyle(select, 'border', '1px solid #a0a7e5');
          this.renderer.setStyle(select, 'background-color', '#f9f9ff');
          this.renderer.setStyle(select, 'font-size', '14px');
          this.renderer.setStyle(select, 'outline', 'none');
          this.renderer.setStyle(select, 'box-shadow', '0 2px 4px rgba(0, 0, 0, 0.05)');
          this.renderer.setStyle(select, 'transition', 'border-color 0.2s ease-in-out');

          // On change event
          this.renderer.listen(select, 'change', (event) => {
            this.selectedValue = (event.target as HTMLSelectElement).value;
            this.hload.hierarchyId = Number(this.selectedValue);
            this.selectedLevelId = (event.target as HTMLSelectElement).id;
            this.hload.hirarchyLevel = Number(this.selectedLevelId);

            console.log(this.hload.hierarchyId + "======" + this.hload.hirarchyLevel);

            this.dashboardService.getAvailableUserHirarchyData(this.hload).subscribe(
              (recivedData: Map<string, Map<number, string>>) => {
                console.log(this.hload.hierarchyId + "==========" + this.hload.hirarchyLevel);

                this.hierarchyHolder = new Map(Object.entries(recivedData));
                const nextSelect = document.getElementById(`${this.hload.hirarchyLevel + 1}`) as HTMLSelectElement;
                this.lid = Number(this.selectedLevelId) + 1;

                this.hierarchyHolder.forEach((key, value) => {
                  if (value === `${this.levels[this.lid]}`) {
                    while (nextSelect.firstChild) {
                      nextSelect.removeChild(nextSelect.firstChild);
                    }

                    this.keyHolder = new Map(Object.entries(key));
                    this.keyHolder.forEach((name, id) => {
                      const option = this.renderer.createElement('option');
                      this.renderer.setProperty(option, 'value', id);
                      const optionText = this.renderer.createText(name);
                      this.renderer.appendChild(option, optionText);
                      this.renderer.appendChild(nextSelect, option);
                    });
                  }
                });

                select = nextSelect;
              });
          });

          // Append to the hierarchy container
          const wrapper = this.renderer.createElement('div');
          this.renderer.setStyle(wrapper, 'display', 'flex');
          this.renderer.setStyle(wrapper, 'flex-direction', 'column');

          this.renderer.appendChild(wrapper, label);
          this.renderer.appendChild(wrapper, select);
          this.renderer.appendChild(div, wrapper);
        });

        const calenderDiv = this.renderer.createElement('div');
        this.renderer.setStyle(calenderDiv, 'display', 'flex');
        this.renderer.setStyle(calenderDiv, 'flex-direction', 'column');

        // Create label
        const label = this.renderer.createElement('label');
        const labelText = this.renderer.createText('Select Date');
        this.renderer.appendChild(label, labelText);

        // Style label
        this.renderer.setStyle(label, 'display', 'block');
        this.renderer.setStyle(label, 'margin-bottom', '6px');
        this.renderer.setStyle(label, 'font-size', '14px');
        this.renderer.setStyle(label, 'font-weight', '600');
        this.renderer.setStyle(label, 'color', '#333');

        // Input wrapper (row layout)
        const inputWrapper = this.renderer.createElement('div');
        this.renderer.setStyle(inputWrapper, 'display', 'flex');
        this.renderer.setStyle(inputWrapper, 'flex-direction', 'row');
        this.renderer.setStyle(inputWrapper, 'align-items', 'center');
        this.renderer.setStyle(inputWrapper, 'gap', '10px'); // spacing between calendar and button

        // Create calendar input
        const calender = this.renderer.createElement('input');
        this.renderer.setAttribute(calender, 'type', 'date');
        this.renderer.setStyle(calender, 'border-radius', '8px');
        this.renderer.setStyle(calender, 'padding', '8px 12px');
        this.renderer.setStyle(calender, 'height', '40px');
        this.renderer.setStyle(calender, 'width', '220px');
        this.renderer.setStyle(calender, 'border', '1px solid #a0a7e5');
        this.renderer.setStyle(calender, 'background-color', '#f9f9ff');
        this.renderer.setStyle(calender, 'font-size', '14px');
        this.renderer.setStyle(calender, 'outline', 'none');
        this.renderer.setStyle(calender, 'box-shadow', '0 2px 4px rgba(0, 0, 0, 0.05)');
        this.renderer.setStyle(calender, 'transition', 'border-color 0.2s ease-in-out');

        // Create button
        const button = this.renderer.createElement('button');
        const buttonText = this.renderer.createText('Get');
        this.renderer.appendChild(button, buttonText);
        this.renderer.setAttribute(button, 'type', 'button');
        this.renderer.setStyle(button, 'padding', '8px 14px');
        this.renderer.setStyle(button, 'border', 'none');
        this.renderer.setStyle(button, 'border-radius', '6px');
        this.renderer.setStyle(button, 'background-color', '#4f46e5');
        this.renderer.setStyle(button, 'color', '#fff');
        this.renderer.setStyle(button, 'font-size', '13px');
        this.renderer.setStyle(button, 'font-weight', '600');
        this.renderer.setStyle(button, 'cursor', 'pointer');
        this.renderer.setStyle(button, 'box-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)');
        this.renderer.setStyle(button, 'transition', 'background-color 0.2s ease-in-out');

        // Hover effect
        this.renderer.listen(button, 'mouseenter', () => {
          this.renderer.setStyle(button, 'background-color', '#4338ca');
        });
        this.renderer.listen(button, 'mouseleave', () => {
          this.renderer.setStyle(button, 'background-color', '#4f46e5');
        });

        // Click handler
        this.renderer.listen(button, 'click', () => {
          console.log('Button clicked');
          //Call get Report
          this.getReport();
        });

        // Append elements
        this.renderer.appendChild(inputWrapper, calender);
        this.renderer.appendChild(inputWrapper, button);

        this.renderer.appendChild(calenderDiv, label);
        this.renderer.appendChild(calenderDiv, inputWrapper);
        this.renderer.appendChild(div, calenderDiv);


      },
      (error: string) => {
        console.log("DATA  :" + error)
      }
    );
  }

  public getReport() {
    this.getDayLiveCommunicationSummary();
  }
  //Communication Related Variable
  AgCommunicating!: number;
  AgTotal!: number;
  NonAgCommunicating!: number;
  NonAgTotal!: number;
  kvComm33!: number;
  kvtotal33!: number;
  GrandToalCommunicating!: number;
  GrandTotal!: number;


  public getDayLiveCommunicationSummary() {
    this.dashboardService.getDayCommunicationSummary(this.hload).subscribe(
      (response) => {
        Highcharts.chart('cs-container', {
          chart: {
            type: 'pie',
            animation: false,
            height: 350,
            width: 175,
            backgroundColor: '#ffffff',
            spacing: [0, 20, 40, 0],  // 40px at the top, 20px on the sides and bottom
            margin: [0, 35, 230, 20]
          },
          title: {
            text: 'AG (' + response.AgCommunicating + "/" + response.AgTotal + ")",
            align:'center',
            style: {
              font: 'blod',
              color: '#333333', // Title color
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily:'Trebuchet MS',
            }
          },

          plotOptions: {
            pie: {
              innerSize: '80%', // Makes it a donut chart
              size: '125%',
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
          pane: {

          },
          tooltip: {
            enabled: false,
            shadow: false, // Removes the tooltip shadow (and arrow)
            borderRadius: 0 // Removes the rounded borders, which could create an arrow effect
          },
          series: [
            {
              type: 'pie',

              data: [
                { y: response.AgCommunicating, color: '#fd520e9d' },
                { y: response.AgTotal - response.AgCommunicating, color: '#cccbcb' }
              ]
            }
          ],
          credits: {
            enabled: false // Disables the Highcharts branding
          }

        }
        );

        Highcharts.chart('nonagcomm', {
          chart: {
            type: 'pie',
            animation: false,
            height: 350,
            width: 200,
            backgroundColor: '#ffffff',

            spacing: [0, 20, 40, 0],  // 40px at the top, 20px on the sides and bottom
            margin: [0, 35, 230, 20]
          },
          title: {
            text: 'NON-AG (' + (response.NonAgCommunicating + response.kvComm33) + "/" + (response.kvtotal33 + response.NonAgTotal) + ")",
            style: {
              font: 'blod',
              color: '#333333', // Title color
              fontWeight: 'bold',
              fontSize: '12px'
            }
          },

          plotOptions: {
            pie: {
              innerSize: '80%', // Makes it a donut chart
              size: '125%',
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
          series: [
            {
              type: 'pie',

              data: [
                { y: response.AgCommunicating },
                { y: response.AgTotal - response.AgCommunicating, color: '#cccbcb' }
              ]
            }
          ],
          credits: {
            enabled: false // Disables the Highcharts branding
          }
        });
       
        Highcharts.chart('total-comm', {
          chart: {
            type: 'pie',
            animation: false,
            height: 350,
            width: 200,
            backgroundColor: '#ffffff',
            spacing: [0, 20, 40, 0],  // 40px at the top, 20px on the sides and bottom
            margin: [0, 35, 230, 20]
          },
          title: {
            text: 'Total (' + response.GrandToalCommunicating + "/" + response.GrandTotal + ")",
            style: {
              font: 'blod',

              color: '#333333', // Title color
              fontWeight: 'bold',
              fontSize: '12px'
            }
          },

          plotOptions: {
            pie: {
              innerSize: '80%', // Makes it a donut chart
              size: '125%',
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
          series: [
            {
              type: 'pie',
              name: 'Communication-Livestatus',
              data: [
                { y: response.GrandToalCommunicating },
                { y: response.GrandTotal, color: '#cccbcb' }
              ]
            }
          ],
          credits: {
            enabled: false // Disables the Highcharts branding
          }
        })
      },
      (error) => {

      }
    );
  }



}