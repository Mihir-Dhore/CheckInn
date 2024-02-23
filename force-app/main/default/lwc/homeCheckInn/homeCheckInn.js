import { LightningElement, track } from 'lwc';
import hotelInfo from '@salesforce/apex/CheckInn.hotelInfo';
import hotelllogo from '@salesforce/resourceUrl/hotelllogo';
import hotelImg1 from '@salesforce/resourceUrl/hotelImg1';
import hotelImg2 from '@salesforce/resourceUrl/hotelImg2';
import hotelImg3 from '@salesforce/resourceUrl/hotelImg3';
import MihirPhoto from '@salesforce/resourceUrl/MihirPhoto';

export default class HomeCheckInn extends LightningElement {
    MihirPhoto = MihirPhoto;
    hotelllogo = hotelllogo;
    hotelImg1 = hotelImg1;
    hotelImg2 = hotelImg2;
    hotelImg3 = hotelImg3;
    @track hotelData;
    connectedCallback(){
        this.showHotelInfo();
    }
    showHotelInfo(){
        hotelInfo()
        .then(result=>{
            console.log('result',result);
            this.hotelData = result;

        }).catch(error=>{
            console.log('error',error);

        })

    }

}