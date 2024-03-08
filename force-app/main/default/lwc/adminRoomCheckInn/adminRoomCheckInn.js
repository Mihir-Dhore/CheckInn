import { LightningElement, track } from 'lwc';
import roomDetails from '@salesforce/apex/CheckInn.roomDetails';
import insertRoom from '@salesforce/apex/CheckInn.insertRoom';

export default class AdminRoomCheckInn extends LightningElement {
    @track roomInfo;
//   Drag and Drop -- START
    @track dragStart;
    @track ElementList = [];

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
          // Initialize ElementList with roomInfo indices    
            this.ElementList = Array.from(Array(this.roomInfo.length).keys());
            console.log('this.ElementList ',JSON.stringify(this.ElementList))
        }).catch(error=>{
            console.log('error',error.message.body);
        })
    
    }

    DragStart(event){
        this.dragStart = event.target.title;
        console.log('this.dragStart ',this.dragStart);
    }
    DragOver(event){
        event.preventDefault();
        return false;
    }
    Drop(event){
        // event.preventDefault();
        event.stopPropagation();
        const dragValName = this.dragStart;
        console.log('dragValName ',dragValName);

        const dropValName = event.target.title;
        console.log('dropValName ',dropValName);

        if(dragValName===dropValName){
            return false;
        }

        const index = dropValName;
        console.log('index',index);
        const currentIndex = parseInt(dragValName);
        const newIndex = parseInt(dropValName);

        console.log('currentIndex-',currentIndex , 'newIndex-',newIndex);
        this.ElementList.splice(newIndex, 0, this.ElementList.splice(currentIndex, 1)[0]);

        // Optionally, update the roomInfo order
        this.roomInfo = this.ElementList.map(index => this.roomInfo[index]);
    }
//   Drag and Drop -- END

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