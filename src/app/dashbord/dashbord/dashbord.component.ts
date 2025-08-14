import { Component, ElementRef, Renderer2 } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/service/Dashboard/dashboard.service';
import HC_3D from 'highcharts/highcharts-3d';
import HC_more from 'highcharts/highcharts-more';
import HC_cylinder from 'highcharts/modules/cylinder';



// Initialize 3D module
HC_3D(Highcharts);
HC_more(Highcharts);
HC_cylinder(Highcharts);

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

  constructor(private dashboardService: DashboardService,
    private renderer: Renderer2, private el: ElementRef) { }
  ngOnInit() {
    //this.getAvailableUserHirarchy();
    this.getDefaultDate();
    this.getHierarchyDetails();
    this.getReport();
  }
  hload: { username: string | null, hierarchyId: number, hirarchyLevel: string, date: string, hierarchyName: string | null } = {
    username: sessionStorage.getItem('username'),
    hierarchyId: this.hid,
    hirarchyLevel: this.leveId,
    date: new Date().toISOString().split('T')[0],
    hierarchyName: this.hierarchyName,

  };
  //Hierarchy Data
  hierarchyHolder = new Map<string, Map<number, string>>();
  selectedValues: { [key: number]: string } = {};
  reportDate: string = '';
  getHierarchyDetails() {
    this.dashboardService.getAvailableUserHirarchyData(this.hload).subscribe(
      (response: Map<string, Map<number, string>>) => {
        this.hierarchyHolder = new Map(Object.entries(response));
      },
      (error) => {
      }
    );
  }
  getOptionsForLevel(levelName: string): { id: number, name: string }[] {
    const options: { id: number, name: string }[] = [];
    this.hierarchyHolder.forEach((innerMap, outerKey) => {
      if (outerKey === levelName) {
        new Map(Object.entries(innerMap)).forEach((name, idStr) => {
          options.push({ id: Number(idStr), name });
        });
      }
    });
    return options;
  }
  onLevelChange(levelIndex: number, selectedId: string, levelName: string) {
    // Keep the selected value
    this.selectedValues[levelIndex] = selectedId;

    // Update the payload for backend
    this.hload.hierarchyId = Number(selectedId);
    this.hload.hirarchyLevel = levelIndex.toString();
    // Find the selected option object
    const selectedOption = this.getOptionsForLevel(levelName)
      .find(opt => opt.id.toString() === selectedId);

    // Update the payload for backend
    this.hload.hierarchyId = Number(selectedId);
    this.hload.hirarchyLevel = levelIndex.toString();
    // Get the name too
    this.hload.hierarchyName = selectedOption ? selectedOption.name : null;

    this.dashboardService.getAvailableUserHirarchyData(this.hload).subscribe(
      (data: Map<string, Map<number, string>>) => {
        const newData = new Map(Object.entries(data));

        // Merge: keep previous levels, update only next level
        newData.forEach((value, key) => {
          if (!this.hierarchyHolder.has(key) || this.levels.indexOf(key) > levelIndex) {
            this.hierarchyHolder.set(key, value);
          }
        });

        // Remove deeper levels beyond the one we just updated
        for (let i = levelIndex + 2; i < this.levels.length; i++) {
          const levelName = this.levels[i];
          this.hierarchyHolder.delete(levelName);
          delete this.selectedValues[i];
        }
      },
      (error) => console.error(error)
    );
  }
  trackByLevel(index: number, item: string) {
    return item; // unique per level
  }

  public getReport() {
    this.hload.date = this.reportDate;
    this.getDayLiveCommunicationSummary();
    this.getLastSevenDaysCommunicationStatus();
    this.signalStrength();
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
          renderTo: 'communicationStatus',
          type: 'pie',
          backgroundColor: '#ffffff',
          height: null,
          width: null,
          animation: true,
          events: {
            load: function () {
              const chart = this as Highcharts.Chart;

              // --- Top Labels ---
              chart.renderer.text(`AG (${response.AgCommunicating}/${response.AgTotal})`,
                chart.plotLeft + chart.chartWidth * 0.07, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`NON-AG (${response.NonAgCommunicating}/${response.NonAgTotal})`,
                chart.plotLeft + chart.chartWidth * 0.21, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`33KV (${response.kvComm33}/${response.kvtotal33})`,
                chart.plotLeft + chart.chartWidth * 0.43, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`Total (${response.GrandToalCommunicating}/${response.GrandTotal})`,
                chart.plotLeft + chart.chartWidth * 0.65, chart.plotTop)
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
          text: '<span style="background: linear-gradient(to right, #4a88c7, #a3c7f0); \
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; \
         font-size: 20px; font-weight: bold; font-family: Segoe UI, Arial;">\
         Last Week Communication</span>',
          align: 'center',
          margin: 20,
          style: {
            color: '#4a88c7ff',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
          }
        },
        tooltip: { enabled: true },
        plotOptions: {
          pie: {
            innerSize: '87%',
            size: '50%',
            startAngle: 270,
            allowPointSelect: false,
            dataLabels: { enabled: false },
            borderWidth: 0,// removes the tiny gap line

          }
        },
        series: [
          {
            type: 'pie',
            name: 'AG',
            center: ['10%', '50%'],
            size: 90,
            data: [
              { y: response.AgCommunicating, color: '#52A3F2' },
              { y: response.AgTotal - response.AgCommunicating, color: '#cccbcb' }
            ]
          },
          {
            type: 'pie',
            name: 'NON-AG',
            center: ['35%', '50%'],
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
            center: ['85%', '50%'],
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



  // Last seven days bar
  lastSevenDaysMap!: Map<string, string[]>;
  getLastSevenDaysCommunicationStatus() {
    this.dashboardService.getSevenDaysCommunication(this.hload).subscribe(
      (response) => {
        this.lastSevenDaysMap = new Map(Object.entries(response));
        const upperLimit = Number((this.lastSevenDaysMap.get('TotalCount') ?? [0])[0]);

        const options: Highcharts.Options = {
          chart: {
            renderTo: 'lastSevendaysCommunication',
            type: 'cylinder',
            animation: true,
            backgroundColor: '#ffffffff',
            reflow: true,
            height: null,
            width: null,
            spacingTop: 10,
            spacingBottom: -5,
            spacingLeft: -5,
            spacingRight: 0,
            options3d: {
              enabled: true,
              alpha: 5,
              beta: -15,
              depth: -50,
              viewDistance: -150
            }
          },
          title: {
            text: '<span style="background: linear-gradient(to right, #4a88c7, #a3c7f0); \
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; \
         font-size: 20px; font-weight: bold; font-family: Segoe UI, Arial;">\
         Last Week Communication</span>',
            align: 'center',
            margin: -20,
            style: {
              color: '#4a88c7ff',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif'
            }
          },
          tooltip: {
            enabled: true,
            formatter: function () {
              const value = this.y ?? 0; // default to 0 if null/undefined
              const percentage = (value / upperLimit) * 100;
              return `<b>${this.x}</b>: ${value} (${percentage.toFixed(1)}%)`;
            }
          },
          xAxis: {
            categories: this.lastSevenDaysMap.get('Date') ?? [],
            title: { text: 'Date' },
            gridLineDashStyle: 'Dash',
            gridLineWidth: 1,
            labels: { rotation: 0 },
            startOnTick: true,
            min: 0,
          },
          yAxis: {
            min: 0,
            max: upperLimit,
            gridLineDashStyle: 'Dash',
            gridLineWidth: 1,
            endOnTick: false,
            title: {
              text: '' // removes the y-axis title
            },
            labels: {
              formatter: function () {
                return this.value.toString();
              }
            }
          },
          plotOptions: {
            column: {
              depth: 25,
              borderWidth: 0,
              shape: 'cylinder', // makes columns cylindrical
              dataLabels: { enabled: true },
              pointWidth: 35,
              pointPadding: 10,
              groupPadding: 0.5,
              
            } as any,
          },
          colors: ['#4a88c7', '#ff7f50', '#32cd32', '#ffd700', '#8a2be2', '#ff69b4', '#00ced1'],
          credits: { enabled: false },
          series: [{
            type: 'column',
            shape: 'cylinder',  // Cylinder shape for 3D column
            showInLegend: false,
            name: '',
            colorByPoint: true,
            data: (this.lastSevenDaysMap.get('communicationCount') ?? []).map(val => Number(val))
          } as any]
        };

        Highcharts.chart(options);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  signalStrength() {
    this.dashboardService.getSevenDaysCommunication(this.hload).subscribe(
      (response) => {
        this.lastSevenDaysMap = new Map(Object.entries(response));
        const upperLimit = Number((this.lastSevenDaysMap.get('TotalCount') ?? [0])[0]);

        const options: Highcharts.Options = {
          chart: {
            renderTo: 'signalStatus',
            type: 'column',
            animation: false,
            backgroundColor: '#ffffffff',
            reflow: true,
            height: null,
            width: null,
            spacingTop: 10,
            spacingBottom: -5,
            spacingLeft: -5,
            spacingRight: 0,
            options3d: {
              enabled: true,
              alpha: 5,
              beta: -15,
              depth: -50,
              viewDistance: -50
            }
          },
          title: {
            text: '<span style="background: linear-gradient(to right, #4a88c7, #a3c7f0); \
         -webkit-background-clip: text; -webkit-text-fill-color: transparent; \
         font-size: 20px; font-weight: bold; font-family: Segoe UI, Arial;">\
         Signal Strength</span>',
            align: 'center',
            margin: -20,
            style: {
              color: '#4a88c7ff',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif'
            }
          },
          xAxis: {
            categories: this.lastSevenDaysMap.get('Date') ?? [],
            title: { text: 'Date' },
            gridLineDashStyle: 'Dash',
            labels: { rotation: 0 },
            startOnTick: true,
            min: 0,
            gridLineWidth: 1,

          },
          yAxis: {
            min: 0,
            max: upperLimit,
            gridLineDashStyle: 'Dash',
            gridLineWidth: 1,
            endOnTick: false,
            labels: {
              formatter: function () {
                return this.value.toString();
              }
            },
            title: {
              text: '' // removes the y-axis title
            },
          },
          plotOptions: {
            column: {
              depth: 25,
              borderWidth: 0,
              shape: 'cylinder', // makes columns cylindrical
              dataLabels: { enabled: true },
              pointWidth: 35,
              pointPadding: 10,
              groupPadding: 0.5
            } as any,
          },
          colors: ['#4a88c7', '#ff7f50', '#32cd32', '#ffd700', '#8a2be2', '#ff69b4', '#00ced1'],
          credits: { enabled: false },
          series: [{
            type: 'column',
            shape: 'cylinder',  // Cylinder shape for 3D column
            showInLegend: false,
            name: '',
            colorByPoint: true,
            data: (this.lastSevenDaysMap.get('communicationCount') ?? []).map(val => Number(val))
          } as any]
        };

        Highcharts.chart(options);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  getDefaultDate() {
    const today = new Date();

    // For <input type="date">
    this.reportDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // For displaying in DD-MM-YYYY
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    this.hload.date = `${year}-${month}-${day}`;
  }
}
