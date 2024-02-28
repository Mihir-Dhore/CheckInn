import { LightningElement, track } from 'lwc';
import roomDetails from '@salesforce/apex/CheckInn.roomDetails';
import insertRoom from '@salesforce/apex/CheckInn.insertRoom';

export default class AdminRoomCheckInn extends LightningElement {
    @track roomInfo;
  
    connectedCallback(){
        this.showRooms();
    }
    showRooms(){
        roomDetails()
        .then(result=>{
            console.log('room Info',result);
            this.roomInfo = result.map(item=>{
                let statusColor = item.Status__c =='Occupied' ? 'slds-text-color_error':'slds-text-color_success'
                console.log('status color',statusColor);
                return{...item,
                    "statusColor":statusColor,
                }

            });
        }).catch(error=>{
            console.log('error',error.message.body);
        })
    
    }

    //Insert Room
    @track showInsert = false;
    handleAddRoom(){
        this.showInsert = true;
    }

    //Type Picklist
    @track selectedRoomTypeValue;
    TypepicklistOptions = [
        { label: 'Single room', value: 'Single room' },
        { label: 'Double room', value: 'Double room' },
        { label: 'Deluxe Room', value: 'Deluxe Room' },
        { label: 'Suite', value: 'Suite' },
        { label: 'Connecting rooms', value: 'Connecting rooms' }

    ];

    handleTypePicklistChange(event) {
        this.selectedRoomTypeValue = event.detail.value;
        console.log(this.selectedRoomTypeValue)
    }


    //Status Picklist
    @track selectedRoomStatusValue;
    StatuspicklistOptions = [
        { label: 'Available', value: 'Available' },
        { label: 'Occupied', value: 'Occupied' },
        { label: 'Pending', value: 'Pending' }
    ];

    handleStatusPicklistChange(event) {
        this.selectedRoomStatusValue = event.detail.value;
        console.log(this.selectedRoomStatusValue)
    }

    //Rate
    @track rate;

    handleRateChange(event) {
        this.rate = event.target.value;
        console.log(this.rate);

    }


    handleCancel(){
        this.showInsert = false;
    }
    handleSaveClick(){
        insertRoom({type:this.selectedRoomTypeValue, status:this.selectedRoomStatusValue, rate:this.rate})
        .then(result=>{
            alert(result);
        }).catch(error=>{
            console.log(error.message.body);
        });
        this.showInsert = false;

    }
}