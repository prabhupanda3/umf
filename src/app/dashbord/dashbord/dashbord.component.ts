import { PercentPipe } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import * as Highcharts from 'highcharts';
import { error } from 'jquery';
import { DashboardService } from 'src/app/service/Dashboard/dashboard.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent {

  today: Date = new Date();
  hierarchyKeys!: number[];
  username!: string | null;
  levels: string[] = ['Region', 'Circle', 'Division', 'Zone', 'Substation'];
  hirarchyArray!: { key: number; value: string; }[];
  keyHolder!: Map<string, any>;
  hid!: number;
  leveId!: string;
  lid!: number;
  selectedValue!: string | null;
  selectedLevelId!: string | null;
  hierarchyName: string = '';
  lastSevenDaysMap!: Map<String, string[]>;

  constructor(private dashboardService: DashboardService,
    private renderer: Renderer2, private el: ElementRef) { }
  ngOnInit() {
    this.getAvailableUserHirarchy();
    this.getReport();
  }
  hierarchyHolder!: Map<string, Map<number, string>>;
  hload: { username: string | null, hierarchyId: number, hirarchyLevel: string, date: string, hierarchyName: string | null } = {
    username: sessionStorage.getItem('username'),
    hierarchyId: this.hid,
    hirarchyLevel: this.leveId,
    date: new Date().toISOString().split('T')[0],
    hierarchyName: this.hierarchyName,

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
            this.hload.hirarchyLevel = this.selectedLevelId;
            const selectEl = event.target as HTMLSelectElement;
            this.hload.hierarchyName = selectEl.options[selectEl.selectedIndex].text;
            console.log(this.hload.hierarchyId + "======" + this.hload.hirarchyLevel + "  ===== " + this.hload.hierarchyName);

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
        //Assign date
        // Listen for date selection
        this.renderer.listen(calender, 'change', (event) => {
          this.hload.date = (event.target as HTMLInputElement).value;
        });
      },
      (error: string) => {
        console.log("DATA  :" + error)
      }
    );
  }

  public getReport() {
    this.getDayLiveCommunicationSummary();
    this.getLastSevenDaysCommunicationStatus();
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
    this.dashboardService.getDayCommunicationSummary(this.hload).subscribe((response) => {
      const options: Highcharts.Options = {
        chart: {
          renderTo: 'cs-container',
          type: 'pie',
          backgroundColor: '#ffffff',
          height: 200,
          animation: false,
          events: {
            load: function () {
              const chart = this as Highcharts.Chart;

              // --- Top Labels ---
              chart.renderer.text(`AG (${response.AgCommunicating}/${response.AgTotal})`,
                chart.plotLeft + chart.chartWidth * 0.17, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`NON-AG (${response.NonAgCommunicating}/${response.NonAgTotal})`,
                chart.plotLeft + chart.chartWidth * 0.3, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`33KV (${response.kvComm33}/${response.kvtotal33})`,
                chart.plotLeft + chart.chartWidth * 0.5, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`Total (${response.GrandToalCommunicating}/${response.GrandTotal})`,
                chart.plotLeft + chart.chartWidth * 0.7, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              // --- Center Percentages ---
              chart.series.forEach((series) => {
                if (series.type === 'pie') {
                  const center = series.center as [number, number, number, number];
                  const cx = chart.plotLeft + center[0];
                  const cy = chart.plotTop + center[1];

                  let total = series.data.reduce((sum, p) => sum + (p.y || 0), 0);
                  let firstValue = series.data[0]?.y || 0;
                  let percent = total > 0 ? ((firstValue / total) * 100).toFixed(1) + '%' : '0%';

                  chart.renderer.text(percent, cx, cy + 5)
                    .css({ color: '#000', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' })
                    .attr({ zIndex: 5, 'text-anchor': 'middle' })
                    .add();
                }
              });
            }
          }
        },
        title: {
          text: 'Live Communication',
          align: 'center',
          margin: 20,
          style: {
            color: '#4a88c7ff',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
          }
        },
        tooltip: { enabled: true },
        plotOptions: {
          pie: {
            innerSize: '90%',
            size: '50%',
            startAngle: 270,
            allowPointSelect: false,
            dataLabels: { enabled: false },
            borderWidth: 0 // removes the tiny gap line
          }
        },
        series: [
          {
            type: 'pie',
            name: 'AG',
            center: ['20%', '50%'],
            size: 90,
            data: [
              { y: response.AgCommunicating, color: '#52A3F2' },
              { y: response.AgTotal - response.AgCommunicating, color: '#cccbcb' }
            ]
          },
          {
            type: 'pie',
            name: 'NON-AG',
            center: ['40%', '50%'],
            size: 90,
            data: [
              { y: response.NonAgCommunicating, color: '#72E8DA' },
              { y: response.NonAgTotal - response.NonAgCommunicating, color: '#cccbcb' }
            ]
          },
          {
            type: 'pie',
            name: '33KV',
            center: ['60%', '50%'],
            size: 90,
            data: [
              { y: response.kvComm33, color: '#72E8DA' },
              { y: response.kvtotal33 - response.kvComm33, color: '#cccbcb' }
            ]
          },
          {
            type: 'pie',
            name: 'Total',
            center: ['80%', '50%'],
            size: 90,
            data: [
              { y: response.GrandToalCommunicating, color: '#fd520e9d' },
              { y: response.GrandTotal - response.GrandToalCommunicating, color: '#cccbcb' }
            ]
          }
        ],
        credits: { enabled: false }
      };

      Highcharts.chart(options);
    });
  }


  //Last seven days bar
  getLastSevenDaysCommunicationStatus() {
    this.dashboardService.getSevenDaysCommunication(this.hload).subscribe(
      (response) => {
        this.lastSevenDaysMap = response;
        console.log("Total count"+this.lastSevenDaysMap.get('TotalCount'));
        const key = Object.keys(response);
        const value = Object.values(response);
        console.log("Keys :" + key)
        Highcharts.chart('lastSevendaysCommunication', {
          chart: {
            type: 'bar',
            animation: false,
            height: 200,
            backgroundColor: '#ffffff',
            spacing: [0, 20, 40, 0],
            margin: [0, 35, 230, 20],
          },
          title: {
            text: '7 Days Status',
            align: 'center',
            margin: 20,
            style: {
              color: '#4a88c7ff',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif'
            }
          },
          xAxis: {
            categories: key,
             title: { text: 'Date' },
          },
          yAxis: {
            title: {
            text: 'Value',
          },
          },
          series: [
            {
              name: 'Status',
              type: 'bar',
              data: value.map((v: any) => Number(v)), // ensure numeric values
            },
          ],
          credits: { enabled: false }

        });
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


}