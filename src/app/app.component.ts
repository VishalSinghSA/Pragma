import {
  Component,
  OnInit
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  tap
} from 'rxjs/operators';
import { Observable, forkJoin, interval } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';

interface BeerTemp {
  name: string;
  temperature: number;
  status: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'code-challenge';
  displayedColumns: string[] = ['name', 'temperature', 'status'];
  private readonly products = [{
      id: '1',
      name: 'Pilsner',
      minimumTemperature: 4,
      maximumTemperature: 6,
    },
    {
      id: '2',
      name: 'IPA',
      minimumTemperature: 5,
      maximumTemperature: 6,
    },
    {
      id: '3',
      name: 'Lager',
      minimumTemperature: 4,
      maximumTemperature: 7,
    },
    {
      id: '4',
      name: 'Stout',
      minimumTemperature: 6,
      maximumTemperature: 8,
    },
    {
      id: '5',
      name: 'Wheat beer',
      minimumTemperature: 3,
      maximumTemperature: 5,
    },
    {
      id: '6',
      name: 'Pale Ale',
      minimumTemperature: 4,
      maximumTemperature: 6,
    },
  ];

  private productObservables: Observable<any> [] = [];
  
  
  data = new MatTableDataSource<BeerTemp>();
  constructor(private httpClient: HttpClient) {}

  private getProductObservableList(){
    if(!this.productObservables.length){
      this.productObservables = this.products.map( (p) => {
        return this.httpClient.get(`http://localhost:8081/temperature/${p.id}`);
      });
    }
    return this.productObservables;
  }

  private getProductDetails(id: string){
    return this.products.filter( (p) => {
      return p.id === id;
    });
  }

  loadData(): void{
    const products = this.getProductObservableList();
    forkJoin(products).subscribe(sensors => {  
      let productDetails = {};      
      sensors = sensors.map(sensor => {
        // <span *ngIf="$any(item.value).temperature < $any(item.value).minimumTemperature">too low</span>
        // <span *ngIf="$any(item.value).temperature > $any(item.value).maximumTemperature">too high</span>
        // <span *ngIf="$any(item.value).temperature <= $any(item.value).maximumTemperature && $any(item.value).temperature >= $any(item.value).minimumTemperature">all good</span>
        // productDetails = this.getProductDetails(sensor.id)[0]
        // if(productDetails.minimumTemperature > )
        return {...this.getProductDetails(sensor.id)[0],...sensor}
      });
      this.data = new MatTableDataSource(sensors);
    });
  }
  ngOnInit(): void {
    this.loadData();
    const timer = interval(5000);
    timer.subscribe(() => this.loadData());
  }
}
