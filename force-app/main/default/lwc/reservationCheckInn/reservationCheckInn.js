import { LightningElement,track,wire } from 'lwc';
import getReservation from '@salesforce/apex/CheckInn.getReservation';
import reservHotelImage from '@salesforce/resourceUrl/reservHotelImage';

const columns = [
    // { label: 'Reservation Name', fieldName: 'Name' },
    { label: 'Name', fieldName: 'Name', cellAttributes:{class:'datatable-CellColor'}},
    // { label: 'Room', fieldName: 'Room__c' },
    { label: 'Room', fieldName: 'roomName'},
    { label: 'Check in Date', fieldName: 'Check_in_Date__c' },
    { label: 'Check out Date', fieldName: 'Check_out_Date__c' },
    { label: 'Status', fieldName: 'Status__c', type: 'text', cellAttributes:{class:{fieldName:'statusColor'}  } },
    { label: 'Total Cost', fieldName: 'Total_Cost__c' },

];

export default class ReservationCheckInn extends LightningElement {
    reservHotelImage = reservHotelImage;
    error;
    columns = columns;

    @track reservData;
    @wire(getReservation)
    getReservation({data,error}){
        if(data){
            this.reservData = data.map(item=>{
                let statusColor = item.Status__c =='Pending' ? 'slds-text-color_error':'slds-text-color_success'
                console.log('status color',statusColor)
                return{...item,
                    "statusColor":statusColor,
                    roomName: item.Room__r ? item.Room__r.Name: ''
                }
            })
            
        }else if(error){
            console.log(error);
        }
    }
    
  }