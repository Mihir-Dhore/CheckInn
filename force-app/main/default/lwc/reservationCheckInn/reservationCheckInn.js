import { LightningElement,track,wire } from 'lwc';
import getReservation from '@salesforce/apex/CheckInn.getReservation';
import reservHotelImage from '@salesforce/resourceUrl/reservHotelImage';
import withdrawReservation from '@salesforce/apex/CheckInn.withdrawReservation';
import { refreshApex } from '@salesforce/apex';

const columns = [
    // { label: 'Reservation Name', fieldName: 'Name' },
    { label: 'Name', fieldName: 'Name', cellAttributes:{class:'datatable-CellColor'}},
    // { label: 'Room', fieldName: 'Room__c' },
    { label: 'Room', fieldName: 'roomName'},
    { label: 'Check in Date', fieldName: 'Check_in_Date__c' },
    { label: 'Check out Date', fieldName: 'Check_out_Date__c' },
    { label: 'Status', fieldName: 'Status__c', type: 'text', cellAttributes:{class:{fieldName:'statusColor'}  } },
    { label: 'Total Cost', fieldName: 'Total_Cost__c', initialWidth: 100},
    {
        type: "button", label: 'Withdraw', initialWidth: 130, typeAttributes: {
            label: 'Withdraw',
            name: 'Withdraw',
            title: 'Withdraw',
            disabled: false,
            value: 'Withdraw',
            iconPosition: 'left',
            // iconName:'utility:delete',
            variant:'destructive-text'
        }
    }

];

export default class ReservationCheckInn extends LightningElement {
    reservHotelImage = reservHotelImage;
    error;
    columns = columns;

    // To Withdraw Reservation
    @track rowId;
    callRowAction(event){
        let recId = event.detail.row.Id;
        this.rowId = recId;
        console.log('recdId',recId);
        this.withdrawReservation();
    }

    withdrawReservation(){
        withdrawReservation({rowId:this.rowId})
        .then(result=>{
            alert(result);
            return refreshApex(this.wiredReservation);

        }).catch(error=>{
            console.error(error);
        })
    }

    @track reservData;
    @track wiredReservation;
    @wire(getReservation)
    wiredGetReservation(result){
        this.wiredReservation = result;
        if(result.data){
            this.reservData = result.data.map(item=>{
                let statusColor = item.Status__c =='Pending' || item.Status__c =='Pending' ? 'slds-text-color_error':'slds-text-color_success'
                console.log('status color',statusColor)
                return{...item,
                    "statusColor":statusColor,
                    roomName: item.Room__r ? item.Room__r.Name: ''
                }
            })
        }else if(result.error){
            console.log(error);
        }
    }

    
  }