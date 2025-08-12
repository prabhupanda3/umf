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
  onLevelChange(levelIndex: number, selectedId: string) {
    // Keep the selected value
    this.selectedValues[levelIndex] = selectedId;

    // Update the payload for backend
    this.hload.hierarchyId = Number(selectedId);
    this.hload.hirarchyLevel = levelIndex.toString();

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
    this.hload.date=this.reportDate;
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
          animation: true,
          spacingRight: 40,
          events: {
            load: function () {
              const chart = this as Highcharts.Chart;

              // --- Top Labels ---
              chart.renderer.text(`AG (${response.AgCommunicating}/${response.AgTotal})`,
                chart.plotLeft + chart.chartWidth * 0.15, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`NON-AG (${response.NonAgCommunicating}/${response.NonAgTotal})`,
                chart.plotLeft + chart.chartWidth * 0.3, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`33KV (${response.kvComm33}/${response.kvtotal33})`,
                chart.plotLeft + chart.chartWidth * 0.47, chart.plotTop)
                .css({ color: '#333', fontSize: '10px', fontWeight: 'bold' })
                .attr({ zIndex: 5 })
                .add();

              chart.renderer.text(`Total (${response.GrandToalCommunicating}/${response.GrandTotal})`,
                chart.plotLeft + chart.chartWidth * 0.63, chart.plotTop)
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
            innerSize: '87%',
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
        //this.lastSevenDaysMap = response;
        // console.log("Total count" + this.lastSevenDaysMap.get('TotalCount'));
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

getDefaultDate(){
   const today = new Date();
  
  // For <input type="date">
  this.reportDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // For displaying in DD-MM-YYYY
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
    this.hload.date= `${year}-${month}-${day}`;
}
}